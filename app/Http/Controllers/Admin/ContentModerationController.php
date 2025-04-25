<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentFlag;
use App\Models\ForbiddenKeyword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContentModerationController extends Controller
{
    /**
     * Display a listing of flagged content
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');
        
        $contentFlags = ContentFlag::with(['flaggable', 'reporter'])
            ->when($status === 'pending', function($query) {
                return $query->where('status', 'pending');
            })
            ->when($status === 'reviewed', function($query) {
                return $query->whereIn('status', ['reviewed', 'rejected', 'actioned']);
            })
            ->latest()
            ->paginate(10);
        
        return Inertia::render('admin/content-moderation/index', [
            'contentFlags' => $contentFlags,
            'filters' => [
                'status' => $status
            ]
        ]);
    }
    
    /**
     * Display details of a specific flagged content
     */
    public function show(ContentFlag $contentFlag)
    {
        $contentFlag->load(['flaggable', 'reporter', 'reviewer']);
        
        return Inertia::render('admin/content-moderation/show', [
            'contentFlag' => $contentFlag
        ]);
    }
    
    /**
     * Mark flagged content as reviewed
     */
    public function review(Request $request, ContentFlag $contentFlag)
    {
        $validated = $request->validate([
            'status' => 'required|in:reviewed,rejected,actioned',
            'notes' => 'nullable|string|max:1000'
        ]);
        
        $contentFlag->status = $validated['status'];
        $contentFlag->reviewer_id = Auth::id();
        $contentFlag->reviewed_at = now();
        $contentFlag->review_notes = $validated['notes'] ?? null;
        $contentFlag->save();
        
        return redirect()->route('admin.content-moderation.index')
            ->with('success', 'Content review status updated successfully');
    }
    
    /**
     * Display a list of forbidden keywords
     */
    public function forbiddenKeywords()
    {
        $keywords = ForbiddenKeyword::orderBy('keyword')
            ->paginate(15);
        
        return Inertia::render('admin/content-moderation/keywords', [
            'keywords' => $keywords
        ]);
    }
    
    /**
     * Store a new forbidden keyword
     */
    public function storeKeyword(Request $request)
    {
        $validated = $request->validate([
            'keyword' => 'required|string|max:100|unique:forbidden_keywords,keyword',
            'severity' => 'required|in:low,medium,high',
            'replacement' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);
        
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        ForbiddenKeyword::create($validated);
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword added successfully');
    }
    
    /**
     * Update an existing forbidden keyword
     */
    public function updateKeyword(Request $request, ForbiddenKeyword $forbiddenKeyword)
    {
        $validated = $request->validate([
            'keyword' => ['required', 'string', 'max:100', Rule::unique('forbidden_keywords')->ignore($forbiddenKeyword)],
            'severity' => 'required|in:low,medium,high',
            'replacement' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);
        
        $forbiddenKeyword->update($validated);
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword updated successfully');
    }
    
    /**
     * Delete a forbidden keyword
     */
    public function destroyKeyword(ForbiddenKeyword $forbiddenKeyword)
    {
        $forbiddenKeyword->delete();
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword deleted successfully');
    }
}

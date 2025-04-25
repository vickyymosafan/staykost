<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentFlag;
use App\Models\ForbiddenKeyword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        
        return view('admin.content-moderation.index', compact('contentFlags', 'status'));
    }
    
    /**
     * Display a specific flagged content
     */
    public function show($id)
    {
        $contentFlag = ContentFlag::with(['flaggable', 'reporter', 'reviewer'])->findOrFail($id);
        
        return view('admin.content-moderation.show', compact('contentFlag'));
    }
    
    /**
     * Review a flagged content
     */
    public function review(Request $request, $id)
    {
        $contentFlag = ContentFlag::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:reviewed,rejected,actioned',
            'admin_notes' => 'nullable|string|max:500',
        ]);
        
        $contentFlag->status = $validated['status'];
        $contentFlag->admin_notes = $validated['admin_notes'];
        $contentFlag->reviewed_by = Auth::id();
        $contentFlag->reviewed_at = now();
        $contentFlag->save();
        
        // If actioned, we might want to hide/remove the content
        if ($validated['status'] === 'actioned' && $contentFlag->flaggable) {
            // Different actions based on flaggable type
            // For example, if it's a property, we might want to change its status
            if ($contentFlag->flaggable_type === 'App\\Models\\Property') {
                $contentFlag->flaggable->update([
                    'status' => 'rejected',
                    'rejection_reason' => 'Inappropriate content. Please revise and resubmit.',
                ]);
            }
        }
        
        return redirect()->route('admin.content-moderation.index')
            ->with('success', 'Content flag has been reviewed');
    }
    
    /**
     * Display a list of forbidden keywords
     */
    public function forbiddenKeywords()
    {
        $keywords = ForbiddenKeyword::orderBy('keyword')->paginate(20);
        
        return view('admin.content-moderation.keywords.index', compact('keywords'));
    }
    
    /**
     * Show the form for creating a new keyword
     */
    public function createKeyword()
    {
        $severityLevels = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
        ];
        
        return view('admin.content-moderation.keywords.create', compact('severityLevels'));
    }
    
    /**
     * Store a new forbidden keyword
     */
    public function storeKeyword(Request $request)
    {
        $validated = $request->validate([
            'keyword' => 'required|string|max:255|unique:forbidden_keywords,keyword',
            'replacement' => 'nullable|string|max:255',
            'severity' => 'required|in:low,medium,high',
            'is_active' => 'boolean',
        ]);
        
        $validated['is_active'] = $request->has('is_active');
        
        ForbiddenKeyword::create($validated);
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword added successfully');
    }
    
    /**
     * Show the form for editing a keyword
     */
    public function editKeyword($id)
    {
        $keyword = ForbiddenKeyword::findOrFail($id);
        
        $severityLevels = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
        ];
        
        return view('admin.content-moderation.keywords.edit', compact('keyword', 'severityLevels'));
    }
    
    /**
     * Update a forbidden keyword
     */
    public function updateKeyword(Request $request, $id)
    {
        $keyword = ForbiddenKeyword::findOrFail($id);
        
        $validated = $request->validate([
            'keyword' => 'required|string|max:255|unique:forbidden_keywords,keyword,'.$id,
            'replacement' => 'nullable|string|max:255',
            'severity' => 'required|in:low,medium,high',
            'is_active' => 'boolean',
        ]);
        
        $validated['is_active'] = $request->has('is_active');
        
        $keyword->update($validated);
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword updated successfully');
    }
    
    /**
     * Delete a forbidden keyword
     */
    public function destroyKeyword($id)
    {
        $keyword = ForbiddenKeyword::findOrFail($id);
        $keyword->delete();
        
        return redirect()->route('admin.content-moderation.keywords')
            ->with('success', 'Forbidden keyword deleted successfully');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categoryId = $request->get('category_id');
        
        $facilities = Facility::with('category')
            ->when($categoryId, function($query) use($categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->orderBy('name')
            ->paginate(10);
        
        $categories = Category::where('type', 'facility_type')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
        
        return Inertia::render('admin/facilities/index', [
            'facilities' => $facilities,
            'categories' => $categories,
            'filters' => [
                'category_id' => $categoryId
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('type', 'facility_type')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
        
        return Inertia::render('admin/facilities/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);
        
        // Add slug and default values
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        Facility::create($validated);
        
        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $facility = Facility::with('category')->findOrFail($id);
        
        return Inertia::render('admin/facilities/show', [
            'facility' => $facility
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $facility = Facility::findOrFail($id);
        
        $categories = Category::where('type', 'facility_type')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
        
        return Inertia::render('admin/facilities/edit', [
            'facility' => $facility,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $facility = Facility::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);
        
        // Update slug if name changed
        if ($facility->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $facility->update($validated);
        
        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $facility = Facility::findOrFail($id);
        
        // Check if facility is being used by properties
        if ($facility->properties()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete facility that is in use');
        }
        
        $facility->delete();
        
        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility deleted successfully');
    }
}

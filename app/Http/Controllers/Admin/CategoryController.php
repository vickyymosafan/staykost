<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $type = $request->get('type', 'room_type');
        
        $categories = Category::where('type', $type)
            ->orderBy('name')
            ->paginate(10);
            
        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'type' => $type,
            'filters' => [
                'type' => $type
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $types = [
            'room_type' => 'Room Type',
            'facility_type' => 'Facility Type',
            'location_zone' => 'Location Zone'
        ];
        
        return Inertia::render('admin/categories/create', [
            'types' => $types
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:room_type,facility_type,location_zone',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        // Add slug
        $validated['slug'] = Str::slug($validated['name']);
        
        // Set default for is_active if not provided
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        Category::create($validated);
        
        return redirect()->route('admin.categories.index', ['type' => $validated['type']])
            ->with('success', 'Category created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return Inertia::render('admin/categories/show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $types = [
            'room_type' => 'Room Type',
            'facility_type' => 'Facility Type',
            'location_zone' => 'Location Zone'
        ];
        
        return Inertia::render('admin/categories/edit', [
            'category' => $category,
            'types' => $types
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:room_type,facility_type,location_zone',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        // Update slug only if name changed
        if ($category->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $category->update($validated);
        
        return redirect()->route('admin.categories.index', ['type' => $category->type])
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if category is in use
        if ($category->facilities()->exists() || $category->properties()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete category that is in use.');
        }
        
        $type = $category->type;
        $category->delete();
        
        return redirect()->route('admin.categories.index', ['type' => $type])
            ->with('success', 'Category deleted successfully');
    }
}

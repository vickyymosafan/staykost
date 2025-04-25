<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
            
        return view('admin.categories.index', compact('categories', 'type'));
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
        
        return view('admin.categories.create', compact('types'));
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
        
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->has('is_active');
        
        Category::create($validated);
        
        return redirect()->route('admin.categories.index', ['type' => $validated['type']])
            ->with('success', 'Category created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::findOrFail($id);
        return view('admin.categories.show', compact('category'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $category = Category::findOrFail($id);
        
        $types = [
            'room_type' => 'Room Type',
            'facility_type' => 'Facility Type',
            'location_zone' => 'Location Zone'
        ];
        
        return view('admin.categories.edit', compact('category', 'types'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:room_type,facility_type,location_zone',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->has('is_active');
        
        $category->update($validated);
        
        return redirect()->route('admin.categories.index', ['type' => $validated['type']])
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $type = $category->type;
        
        // Check if category is being used
        if ($category->properties()->count() > 0 || $category->facilities()->count() > 0) {
            return back()->with('error', 'Cannot delete category because it is in use');
        }
        
        $category->delete();
        
        return redirect()->route('admin.categories.index', ['type' => $type])
            ->with('success', 'Category deleted successfully');
    }
}

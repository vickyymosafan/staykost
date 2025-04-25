<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $facilities = Facility::with('category')
            ->when($request->has('category_id'), function($query) use($request) {
                return $query->where('category_id', $request->category_id);
            })
            ->orderBy('name')
            ->paginate(10);
        
        $categories = Category::where('type', 'facility_type')->where('is_active', true)->get();
        
        return view('admin.facilities.index', compact('facilities', 'categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('type', 'facility_type')->where('is_active', true)->get();
        
        return view('admin.facilities.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);
        
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->has('is_active');
        
        Facility::create($validated);
        
        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $facility = Facility::with('category', 'properties')->findOrFail($id);
        
        return view('admin.facilities.show', compact('facility'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $facility = Facility::findOrFail($id);
        $categories = Category::where('type', 'facility_type')->where('is_active', true)->get();
        
        return view('admin.facilities.edit', compact('facility', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $facility = Facility::findOrFail($id);
        
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);
        
        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->has('is_active');
        
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
        
        // Check if facility is being used by any properties
        if ($facility->properties()->count() > 0) {
            return back()->with('error', 'Cannot delete facility because it is in use by properties');
        }
        
        $facility->delete();
        
        return redirect()->route('admin.facilities.index')
            ->with('success', 'Facility deleted successfully');
    }
}

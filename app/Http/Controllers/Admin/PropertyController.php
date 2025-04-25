<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');
        
        $properties = Property::with(['owner', 'category'])
            ->when($status === 'pending', function($query) {
                return $query->pending();
            })
            ->when($status === 'approved', function($query) {
                return $query->approved();
            })
            ->when($status === 'rejected', function($query) {
                return $query->rejected();
            })
            ->latest()
            ->paginate(10);
        
        return view('admin.properties.index', compact('properties', 'status'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Admin doesn't create properties directly, redirecting to listing
        return redirect()->route('admin.properties.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Admin doesn't create properties directly
        return redirect()->route('admin.properties.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $property = Property::with(['owner', 'category', 'facilities', 'contentFlags'])
            ->findOrFail($id);
        
        return view('admin.properties.show', compact('property'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $property = Property::findOrFail($id);
        $categories = Category::where('type', 'room_type')->where('is_active', true)->get();
        
        return view('admin.properties.edit', compact('property', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $property = Property::findOrFail($id);
        
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'is_available' => 'boolean',
        ]);
        
        $validated['is_available'] = $request->has('is_available');
        
        $property->update($validated);
        
        return redirect()->route('admin.properties.show', $property->id)
            ->with('success', 'Property updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $property = Property::findOrFail($id);
        
        // Soft delete the property
        $property->delete();
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Property deleted successfully');
    }
    
    /**
     * Approve a property listing
     */
    public function approve(string $id)
    {
        $property = Property::findOrFail($id);
        
        $property->status = 'approved';
        $property->approved_at = now();
        $property->rejected_at = null;
        $property->rejection_reason = null;
        $property->save();
        
        // TODO: Send notification to the property owner
        
        return redirect()->route('admin.properties.show', $property->id)
            ->with('success', 'Property listing has been approved');
    }
    
    /**
     * Show the rejection form
     */
    public function showRejectForm(string $id)
    {
        $property = Property::findOrFail($id);
        return view('admin.properties.reject', compact('property'));
    }
    
    /**
     * Reject a property listing
     */
    public function reject(Request $request, string $id)
    {
        $property = Property::findOrFail($id);
        
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);
        
        $property->status = 'rejected';
        $property->rejection_reason = $validated['rejection_reason'];
        $property->rejected_at = now();
        $property->approved_at = null;
        $property->save();
        
        // TODO: Send notification to the property owner
        
        return redirect()->route('admin.properties.show', $property->id)
            ->with('success', 'Property listing has been rejected');
    }
}

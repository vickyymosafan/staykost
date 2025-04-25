<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = Property::with(['owner', 'category']);
        
        if ($status === 'pending') {
            $query->where('status', 'pending');
        } elseif ($status === 'approved') {
            $query->where('status', 'approved');
        } elseif ($status === 'rejected') {
            $query->where('status', 'rejected');
        }
        
        $properties = $query->latest()->paginate(10);
        
        return Inertia::render('admin/properties/index', [
            'properties' => $properties,
            'filters' => [
                'status' => $status
            ]
        ]);
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
    public function show(Property $property)
    {
        $property->load(['owner', 'category', 'facilities']);
        
        return Inertia::render('admin/properties/show', [
            'property' => $property
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        // Admin doesn't edit properties directly
        return redirect()->route('admin.properties.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        // Admin doesn't update properties directly
        return redirect()->route('admin.properties.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        // For now, let's not allow admins to delete properties
        return redirect()->route('admin.properties.index')
            ->with('error', 'Deleting properties is not allowed');
    }
    
    /**
     * Approve a property listing
     */
    public function approve(Property $property)
    {
        if ($property->status !== 'pending') {
            return redirect()->route('admin.properties.index')
                ->with('error', 'Only pending properties can be approved');
        }
        
        $property->status = 'approved';
        $property->approved_at = now();
        $property->approved_by = Auth::id();
        $property->save();
        
        // TODO: Send notification to owner
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Property approved successfully');
    }
    
    /**
     * Show the rejection form
     */
    public function showRejectForm(Property $property)
    {
        if ($property->status !== 'pending') {
            return redirect()->route('admin.properties.index')
                ->with('error', 'Only pending properties can be rejected');
        }
        
        return Inertia::render('admin/properties/reject', [
            'property' => $property
        ]);
    }
    
    /**
     * Reject a property listing
     */
    public function reject(Request $request, Property $property)
    {
        if ($property->status !== 'pending') {
            return redirect()->route('admin.properties.index')
                ->with('error', 'Only pending properties can be rejected');
        }
        
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000'
        ]);
        
        $property->status = 'rejected';
        $property->rejected_at = now();
        $property->rejected_by = Auth::id();
        $property->rejection_reason = $validated['rejection_reason'];
        $property->save();
        
        // TODO: Send notification to owner
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Property rejected successfully');
    }
}

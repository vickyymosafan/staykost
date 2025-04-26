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
        $search = $request->get('search', '');
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        
        $query = Property::with(['owner', 'category']);
        
        // Apply status filtering
        if ($status === 'pending') {
            $query->where('status', 'pending');
        } elseif ($status === 'approved') {
            $query->where('status', 'approved');
        } elseif ($status === 'rejected') {
            $query->where('status', 'rejected');
        } elseif ($status === 'moderation') {
            $query->where(function($q) {
                $q->where('status', 'moderation')
                  ->orWhere('has_reported_content', true);
            });
        }
        
        // Apply search if provided
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('owner', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply sorting
        if ($sort === 'owner_name') {
            $query->join('users', 'properties.user_id', '=', 'users.id')
                ->orderBy('users.name', $direction)
                ->select('properties.*');
        } elseif (in_array($sort, ['name', 'price', 'status', 'created_at'])) {
            $query->orderBy($sort, $direction);
        }
        
        $properties = $query->latest()->paginate(10)->withQueryString();
        
        return Inertia::render('admin/properties/index', [
            'properties' => $properties,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        
        // Gunakan nama file dengan case yang tepat (Create dengan C kapital)
        return Inertia::render('admin/properties/Create', [
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
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'deposit_amount' => 'nullable|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'capacity' => 'nullable|integer|min:1',
            'is_available' => 'boolean',
            'status' => 'required|in:pending,approved,rejected'
        ]);

        // Create slug from name
        $slug = \Illuminate\Support\Str::slug($validated['name']);
        
        // Check for unique slug
        $count = 0;
        $originalSlug = $slug;
        while (Property::where('slug', $slug)->exists()) {
            $count++;
            $slug = $originalSlug . '-' . $count;
        }
        
        // Tambahkan data tambahan
        $validated['slug'] = $slug;
        $validated['user_id'] = $request->input('user_id') ?? Auth::id(); // Default to current admin if not specified
        $validated['last_modified_by'] = Auth::id();
        
        if ($validated['status'] === 'approved') {
            $validated['approved_at'] = now();
        }
        
        $property = Property::create($validated);
        
        // Attach facilities if present
        if ($request->has('facilities')) {
            $property->facilities()->attach($request->input('facilities'));
        }
        
        return redirect()->route('admin.properties.show', $property)
            ->with('success', 'Properti berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        $property->load(['owner', 'category', 'facilities', 'modifiedBy']);
        
        return Inertia::render('admin/properties/show', [
            'property' => $property
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $categories = Category::all();
        
        return Inertia::render('admin/properties/edit', [
            'property' => $property->load('category', 'owner', 'facilities'),
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'is_featured' => 'boolean',
            'has_reported_content' => 'boolean',
        ]);
        
        $property->update($validated);
        $property->last_modified_by = Auth::id();
        $property->save();
        
        return redirect()->route('admin.properties.show', $property)
            ->with('success', 'Properti berhasil diperbarui');
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
        $property->last_modified_by = Auth::id();
        $property->save();
        
        // TODO: Send notification to owner
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Property approved successfully');
    }
    
    /**
     * Reject a property listing with a reason
     */
    public function reject(Request $request, Property $property)
    {
        if ($property->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Hanya properti dengan status menunggu yang dapat ditolak');
        }
        
        $validated = $request->validate([
            'reason' => 'required|string|max:1000'
        ]);
        
        $property->status = 'rejected';
        $property->rejected_at = now();
        $property->rejection_reason = $validated['reason'];
        $property->last_modified_by = Auth::id();
        $property->save();
        
        // TODO: Send notification to owner
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Properti berhasil ditolak');
    }
    
    /**
     * Mark a property for content moderation
     */
    public function moderate(Property $property)
    {
        $property->status = 'moderation';
        $property->has_reported_content = true;
        $property->last_modified_by = Auth::id();
        $property->save();
        
        return redirect()->route('admin.properties.index')
            ->with('success', 'Properti telah ditandai untuk moderasi konten');
    }
    
    /**
     * Toggle the featured status of a property
     */
    public function toggleFeatured(Property $property)
    {
        $property->is_featured = !$property->is_featured;
        $property->last_modified_by = Auth::id();
        $property->save();
        
        $status = $property->is_featured ? 'diaktifkan' : 'dinonaktifkan';
        
        return redirect()->back()
            ->with('success', "Status unggulan properti berhasil {$status}");
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            })
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->when($request->verification_status, function ($query, $status) {
                $query->where('verification_status', $status);
            })
            ->orderBy($request->input('sort_field', 'created_at'), $request->input('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'verification_status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,owner,user',
            'id_card' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'verification_status' => 'nullable|string|in:unverified,pending,verified',
            'verification_notes' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        // Handle ID card upload if provided
        $idCardPath = null;
        if ($request->hasFile('id_card')) {
            $idCardPath = $request->file('id_card')->store('id-cards', 'public');
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'verification_status' => $validated['verification_status'] ?? 'unverified',
            'id_card_path' => $idCardPath,
            'verification_notes' => $validated['verification_notes'] ?? null,
            'permissions' => $validated['permissions'] ?? null,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully');
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:admin,owner,user',
            'id_card' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'verification_status' => 'required|string|in:unverified,pending,verified',
            'verification_notes' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        // Handle ID card upload if provided
        if ($request->hasFile('id_card')) {
            // Delete old ID card if exists
            if ($user->id_card_path) {
                Storage::disk('public')->delete($user->id_card_path);
            }
            $idCardPath = $request->file('id_card')->store('id-cards', 'public');
            $user->id_card_path = $idCardPath;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->verification_status = $validated['verification_status'];
        $user->verification_notes = $validated['verification_notes'];
        $user->permissions = $validated['permissions'] ?? null;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Don't allow deleting yourself
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account');
        }

        // Delete ID card file if exists
        if ($user->id_card_path) {
            Storage::disk('public')->delete($user->id_card_path);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully');
    }

    /**
     * View user details including verification documents
     */
    public function show(User $user)
    {
        $idCardUrl = null;
        if ($user->id_card_path) {
            $idCardUrl = asset('storage/' . $user->id_card_path);
        }
        
        return Inertia::render('admin/users/show', [
            'user' => $user,
            'idCardUrl' => $idCardUrl,
        ]);
    }

    /**
     * Update user verification status
     */
    public function updateVerification(Request $request, User $user)
    {
        $validated = $request->validate([
            'verification_status' => 'required|string|in:unverified,pending,verified',
            'verification_notes' => 'nullable|string',
        ]);

        $user->verification_status = $validated['verification_status'];
        $user->verification_notes = $validated['verification_notes'];
        $user->save();

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'Verification status updated successfully');
    }
}

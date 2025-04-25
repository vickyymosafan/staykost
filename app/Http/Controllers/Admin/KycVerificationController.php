<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KycVerificationController extends Controller
{
    /**
     * Display a listing of users pending KYC verification
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
            // Filter by verification status with 'pending' as default
            ->when($request->has('verification_status'), function ($query, $status) use ($request) {
                $query->where('verification_status', $request->verification_status);
            }, function ($query) {
                $query->where('verification_status', 'pending');
            })
            // Only show users with ID card uploads
            ->whereNotNull('id_card_path')
            ->orderBy($request->input('sort_field', 'created_at'), $request->input('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/kyc/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'verification_status', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Display the specified user's KYC verification details
     */
    public function show(User $user)
    {
        $idCardUrl = null;
        if ($user->id_card_path) {
            $idCardUrl = asset('storage/' . $user->id_card_path);
        }
        
        return Inertia::render('admin/kyc/show', [
            'user' => $user,
            'idCardUrl' => $idCardUrl,
        ]);
    }

    /**
     * Approve a user's KYC verification
     */
    public function approve(Request $request, User $user)
    {
        $validated = $request->validate([
            'verification_notes' => 'nullable|string',
        ]);

        $user->verification_status = 'verified';
        $user->verification_notes = $validated['verification_notes'] ?? 'Dokumen identitas telah diverifikasi';
        $user->verified_at = now();
        $user->verified_by = Auth::id();
        $user->save();

        return redirect()->route('admin.kyc.index')
            ->with('success', 'Verifikasi KYC berhasil disetujui');
    }

    /**
     * Reject a user's KYC verification
     */
    public function reject(Request $request, User $user)
    {
        $validated = $request->validate([
            'verification_notes' => 'required|string',
        ]);

        $user->verification_status = 'unverified';
        $user->verification_notes = $validated['verification_notes'];
        $user->save();

        return redirect()->route('admin.kyc.index')
            ->with('success', 'Verifikasi KYC ditolak');
    }
}

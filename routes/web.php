<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\KycVerificationController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard route - redirects to the appropriate dashboard based on role
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
    
    // Admin routes group
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('dashboard');
        
        // User Management Routes
        Route::resource('users', UserController::class);
        Route::put('users/{user}/verification', [UserController::class, 'updateVerification'])->name('users.update-verification');
        
        // KYC Verification Routes
        Route::get('/kyc', [KycVerificationController::class, 'index'])->name('kyc.index');
        Route::get('/kyc/{user}', [KycVerificationController::class, 'show'])->name('kyc.show');
        Route::put('/kyc/{user}/approve', [KycVerificationController::class, 'approve'])->name('kyc.approve');
        Route::put('/kyc/{user}/reject', [KycVerificationController::class, 'reject'])->name('kyc.reject');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

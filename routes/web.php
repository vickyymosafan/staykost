<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\KycVerificationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\ContentModerationController;

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
        
        // Category Management Routes
        Route::resource('categories', CategoryController::class);
        
        // Property Management Routes
        Route::resource('properties', PropertyController::class);
        Route::put('properties/{property}/approve', [PropertyController::class, 'approve'])->name('properties.approve');
        Route::get('properties/{property}/reject', [PropertyController::class, 'showRejectForm'])->name('properties.reject-form');
        Route::put('properties/{property}/reject', [PropertyController::class, 'reject'])->name('properties.reject');
        
        // Facility Management Routes
        Route::resource('facilities', FacilityController::class);
        
        // Content Moderation Routes
        Route::get('content-moderation', [ContentModerationController::class, 'index'])->name('content-moderation.index');
        Route::get('content-moderation/{contentFlag}', [ContentModerationController::class, 'show'])->name('content-moderation.show');
        Route::put('content-moderation/{contentFlag}/review', [ContentModerationController::class, 'review'])->name('content-moderation.review');
        
        // Forbidden Keywords Routes
        Route::get('content-moderation/keywords', [ContentModerationController::class, 'forbiddenKeywords'])->name('content-moderation.keywords');
        Route::get('content-moderation/keywords/create', [ContentModerationController::class, 'createKeyword'])->name('content-moderation.keywords.create');
        Route::post('content-moderation/keywords', [ContentModerationController::class, 'storeKeyword'])->name('content-moderation.keywords.store');
        Route::get('content-moderation/keywords/{keyword}/edit', [ContentModerationController::class, 'editKeyword'])->name('content-moderation.keywords.edit');
        Route::put('content-moderation/keywords/{keyword}', [ContentModerationController::class, 'updateKeyword'])->name('content-moderation.keywords.update');
        Route::delete('content-moderation/keywords/{keyword}', [ContentModerationController::class, 'destroyKeyword'])->name('content-moderation.keywords.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

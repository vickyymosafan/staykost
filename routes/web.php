<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\KycVerificationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\ContentModerationController;
use App\Http\Controllers\Admin\DashboardController;

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
        // Dashboard routes
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/api/dashboard', [DashboardController::class, 'apiData'])->name('api.dashboard');
        
        // User Management Routes
        Route::resource('users', UserController::class);
        Route::put('users/{user}/verification', [UserController::class, 'updateVerification'])->name('users.update-verification');
        
        // KYC Verification Routes
        Route::get('/kyc', [KycVerificationController::class, 'index'])->name('kyc.index');
        Route::get('/kyc/{user}', [KycVerificationController::class, 'show'])->name('kyc.show');
        Route::put('/kyc/{user}/approve', [KycVerificationController::class, 'approve'])->name('kyc.approve');
        Route::put('/kyc/{user}/reject', [KycVerificationController::class, 'reject'])->name('kyc.reject');
        
        // Category Management Routes
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::resource('categories', CategoryController::class)->except(['index']);
        
        // Property Management Routes
        Route::get('properties', [PropertyController::class, 'index'])->name('properties.index');
        Route::resource('properties', PropertyController::class)->except(['index']);
        Route::put('properties/{property}/approve', [PropertyController::class, 'approve'])->name('properties.approve');
        Route::get('properties/{property}/reject', [PropertyController::class, 'showRejectForm'])->name('properties.reject-form');
        Route::put('properties/{property}/reject', [PropertyController::class, 'reject'])->name('properties.reject');
        
        // Facility Management Routes
        Route::get('facilities', [FacilityController::class, 'index'])->name('facilities.index');
        Route::resource('facilities', FacilityController::class)->except(['index']);
        
        // Content Moderation Routes
        Route::prefix('content-moderation')->name('content-moderation.')->group(function () {
            Route::get('/', [ContentModerationController::class, 'index'])->name('index');
            Route::get('/keywords', [ContentModerationController::class, 'forbiddenKeywords'])->name('keywords');
            
            // REST API untuk content moderation
            Route::get('/{contentFlag}', [ContentModerationController::class, 'show'])->name('show');
            Route::put('/{contentFlag}/review', [ContentModerationController::class, 'review'])->name('review');
            Route::post('/keywords', [ContentModerationController::class, 'storeKeyword'])->name('keywords.store');
            Route::put('/keywords/{forbiddenKeyword}', [ContentModerationController::class, 'updateKeyword'])->name('keywords.update');
            Route::delete('/keywords/{forbiddenKeyword}', [ContentModerationController::class, 'destroyKeyword'])->name('keywords.destroy');
        });

        // Placeholder routes for finance and transactions sections
        Route::prefix('transactions')->name('transactions.')->group(function () {
            Route::get('/', function () { return Inertia::render('admin/transactions/index'); })->name('index');
        });

        Route::prefix('finance')->name('finance.')->group(function () {
            Route::get('/refunds', function () { return Inertia::render('admin/finance/refunds'); })->name('refunds');
            Route::get('/settlements', function () { return Inertia::render('admin/finance/settlements'); })->name('settlements');
            Route::get('/reports', function () { return Inertia::render('admin/finance/reports'); })->name('reports');
        });

        // Placeholder routes for activities
        Route::get('/activities', function () {
            return Inertia::render('admin/activities/index');
        })->name('activities.index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

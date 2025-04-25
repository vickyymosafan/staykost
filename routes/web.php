<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;

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
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

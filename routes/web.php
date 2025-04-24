<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

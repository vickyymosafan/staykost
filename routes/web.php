<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Admin Controllers
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

// Shared routes accessible without login
Route::get('/search', function() {
    return Inertia::render('search');
})->name('search');

Route::get('/property/{property}', function($property) {
    return Inertia::render('property/show', ['property' => $property]);
})->name('property.show');

// API endpoint untuk dashboard admin - pastikan ini tersedia tanpa middleware
Route::get('/api/admin/dashboard', [DashboardController::class, 'apiData']);

// Debug route
Route::get('/debug-page', function() {
    return Inertia::render('debug');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard route - redirects to the appropriate dashboard based on role
    Route::get('/dashboard', function () {
        // Simplified redirect logic for now
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
    
    // Admin routes group
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard routes
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/api/dashboard', [DashboardController::class, 'apiData'])->name('api.dashboard');
        
        // 1.1 Manajemen Pengguna & Akses
        Route::resource('users', UserController::class);
        Route::put('users/{user}/verification', [UserController::class, 'updateVerification'])->name('users.update-verification');
        
        // KYC Verification Routes
        Route::get('/kyc', [KycVerificationController::class, 'index'])->name('kyc.index');
        Route::get('/kyc/{user}', [KycVerificationController::class, 'show'])->name('kyc.show');
        Route::put('/kyc/{user}/approve', [KycVerificationController::class, 'approve'])->name('kyc.approve');
        Route::put('/kyc/{user}/reject', [KycVerificationController::class, 'reject'])->name('kyc.reject');
        
        // 1.2 Manajemen Properti & Konten
        // Category Management Routes
        Route::resource('categories', CategoryController::class);
        
        // Property Management Routes
        Route::resource('properties', PropertyController::class);
        Route::put('properties/{property}/approve', [PropertyController::class, 'approve'])->name('properties.approve');
        Route::get('properties/{property}/reject', [PropertyController::class, 'showRejectForm'])->name('properties.reject-form');
        Route::put('properties/{property}/reject', [PropertyController::class, 'reject'])->name('properties.reject');
        Route::put('properties/{property}/moderate', [PropertyController::class, 'moderate'])->name('properties.moderate');
        Route::put('properties/{property}/toggle-featured', [PropertyController::class, 'toggleFeatured'])->name('properties.toggle-featured');
        
        // Facility Management Routes
        Route::resource('facilities', FacilityController::class);
        
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

        // 1.3 Keuangan & Transaksi
        // Payment Gateway Configuration
        Route::prefix('payment-gateway')->name('payment-gateway.')->group(function () {
            Route::get('/', function () { return Inertia::render('admin/payment-gateway/index'); })->name('index');
            Route::put('/update', function () { return response()->json(['status' => 'success']); })->name('update');
            Route::post('/test', function () { return response()->json(['status' => 'success']); })->name('test');
        });

        Route::prefix('transactions')->name('transactions.')->group(function () {
            Route::get('/', function () { return Inertia::render('admin/transactions/index'); })->name('index');
            Route::get('/{transaction}', function ($transaction) { 
                return Inertia::render('admin/transactions/show', ['transaction' => $transaction]); 
            })->name('show');
        });

        Route::prefix('finance')->name('finance.')->group(function () {
            // Refund Management
            Route::get('/refunds', function () { return Inertia::render('admin/finance/refunds'); })->name('refunds');
            Route::get('/refunds/{refund}', function ($refund) { 
                return Inertia::render('admin/finance/refund-detail', ['refund' => $refund]); 
            })->name('refunds.show');
            Route::put('/refunds/{refund}/approve', function ($refund) { 
                return redirect()->route('admin.finance.refunds'); 
            })->name('refunds.approve');
            Route::put('/refunds/{refund}/reject', function ($refund) { 
                return redirect()->route('admin.finance.refunds'); 
            })->name('refunds.reject');
            
            // Settlement Management
            Route::get('/settlements', function () { 
                return Inertia::render('admin/finance/settlements'); 
            })->name('settlements');
            Route::post('/settlements/schedule', function () { 
                return redirect()->route('admin.finance.settlements'); 
            })->name('settlements.schedule');
            Route::get('/settlements/{settlement}', function ($settlement) { 
                return Inertia::render('admin/finance/settlement-detail', ['settlement' => $settlement]); 
            })->name('settlements.show');
            
            // Financial Reports
            Route::get('/reports', function () { 
                return Inertia::render('admin/finance/reports'); 
            })->name('reports');
            Route::get('/reports/export', function () { 
                return response()->download(storage_path('app/reports/finance.xlsx')); 
            })->name('reports.export');
        });

        // 1.4 Laporan & Analitik
        Route::get('/analytics', function () { 
            return Inertia::render('admin/analytics'); 
        })->name('analytics');
        Route::get('/export/users', function () { 
            return response()->download(storage_path('app/reports/users.xlsx')); 
        })->name('export.users');
        Route::get('/export/properties', function () { 
            return response()->download(storage_path('app/reports/properties.xlsx')); 
        })->name('export.properties');

        // 1.5 Sistem Keamanan & Audit
        Route::get('/activities', function () { 
            return Inertia::render('admin/activities/index'); 
        })->name('activities.index');
        Route::get('/activities/{activity}', function ($activity) { 
            return Inertia::render('admin/activities/show', ['activity' => $activity]); 
        })->name('activities.show');
        
        // 1.6 Pengaturan & Promosi
        // Email Templates
        Route::prefix('email-templates')->name('email-templates.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('admin/email-templates/index'); 
            })->name('index');
            Route::get('/{template}', function ($template) { 
                return Inertia::render('admin/email-templates/edit', ['template' => $template]); 
            })->name('edit');
            Route::put('/{template}', function ($template) { 
                return redirect()->route('admin.email-templates.index'); 
            })->name('update');
            Route::post('/test/{template}', function ($template) { 
                return response()->json(['status' => 'success']); 
            })->name('test');
        });
        
        // Promo & Voucher Management
        Route::prefix('promos')->name('promos.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('admin/promos/index'); 
            })->name('index');
            Route::get('/create', function () { 
                return Inertia::render('admin/promos/create'); 
            })->name('create');
            Route::post('/', function () { 
                return redirect()->route('admin.promos.index'); 
            })->name('store');
            Route::get('/{promo}', function ($promo) { 
                return Inertia::render('admin/promos/show', ['promo' => $promo]); 
            })->name('show');
            Route::get('/{promo}/edit', function ($promo) { 
                return Inertia::render('admin/promos/edit', ['promo' => $promo]); 
            })->name('edit');
            Route::put('/{promo}', function ($promo) { 
                return redirect()->route('admin.promos.index'); 
            })->name('update');
            Route::delete('/{promo}', function ($promo) { 
                return redirect()->route('admin.promos.index'); 
            })->name('destroy');
            Route::put('/{promo}/activate', function ($promo) { 
                return redirect()->route('admin.promos.index'); 
            })->name('activate');
            Route::put('/{promo}/deactivate', function ($promo) { 
                return redirect()->route('admin.promos.index'); 
            })->name('deactivate');
        });
    });

    // Owner routes group
    Route::prefix('owner')->name('owner.')->group(function () {
        // 2.1 Dasbor Properti
        Route::get('/dashboard', function () { 
            return Inertia::render('owner/dashboard'); 
        })->name('dashboard');
        
        // Property Management
        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('owner/properties/index'); 
            })->name('index');
            Route::get('/create', function () { 
                return Inertia::render('owner/properties/create'); 
            })->name('create');
            Route::post('/', function () { 
                return redirect()->route('owner.properties.index'); 
            })->name('store');
            Route::get('/{property}', function ($property) { 
                return Inertia::render('owner/properties/show', ['property' => $property]); 
            })->name('show');
            Route::get('/{property}/edit', function ($property) { 
                return Inertia::render('owner/properties/edit', ['property' => $property]); 
            })->name('edit');
            Route::put('/{property}', function ($property) { 
                return redirect()->route('owner.properties.index'); 
            })->name('update');
            Route::delete('/{property}', function ($property) { 
                return redirect()->route('owner.properties.index'); 
            })->name('destroy');
            Route::get('/{property}/calendar', function ($property) { 
                return Inertia::render('owner/properties/calendar', ['property' => $property]); 
            })->name('calendar');
            Route::post('/{property}/block-dates', function ($property) { 
                return redirect()->route('owner.properties.calendar', $property); 
            })->name('block-dates');
        });
        
        // 2.2 Manajemen Booking & Pelanggan
        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('owner/bookings/index'); 
            })->name('index');
            Route::get('/{booking}', function ($booking) { 
                return Inertia::render('owner/bookings/show', ['booking' => $booking]); 
            })->name('show');
            Route::put('/{booking}/approve', function ($booking) { 
                return redirect()->route('owner.bookings.index'); 
            })->name('approve');
            Route::put('/{booking}/reject', function ($booking) { 
                return redirect()->route('owner.bookings.index'); 
            })->name('reject');
        });
        
        // Digital Contract
        Route::prefix('contracts')->name('contracts.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('owner/contracts/index'); 
            })->name('index');
            Route::get('/{booking}/create', function ($booking) { 
                return Inertia::render('owner/contracts/create', ['booking' => $booking]); 
            })->name('create');
            Route::post('/{booking}', function ($booking) { 
                return redirect()->route('owner.contracts.index'); 
            })->name('store');
            Route::get('/{contract}', function ($contract) { 
                return Inertia::render('owner/contracts/show', ['contract' => $contract]); 
            })->name('show');
        });
        
        // 2.3 Komunikasi & Notifikasi
        Route::prefix('chats')->name('chats.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('owner/chats/index'); 
            })->name('index');
            Route::get('/{user}', function ($user) { 
                return Inertia::render('owner/chats/show', ['user' => $user]); 
            })->name('show');
            Route::post('/{user}/send', function ($user) { 
                return redirect()->route('owner.chats.show', $user); 
            })->name('send');
        });
        
        // 2.4 Laporan & Analitik Khusus Owner
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/revenue', function () { 
                return Inertia::render('owner/reports/revenue'); 
            })->name('revenue');
            Route::get('/bookings', function () { 
                return Inertia::render('owner/reports/bookings'); 
            })->name('bookings');
        });
        Route::get('/reviews', function () { 
            return Inertia::render('owner/reviews'); 
        })->name('reviews');
        Route::post('/reviews/{review}/reply', function ($review) { 
            return redirect()->route('owner.reviews'); 
        })->name('reviews.reply');
    });

    // User routes group
    Route::prefix('user')->name('user.')->group(function () {
        // 3.1 & 3.2 already accessible without login (search & detail listing)
        
        // 3.3 Proses Booking & Pembayaran
        Route::post('/properties/{property}/book', function ($property) { 
            return redirect()->route('user.bookings.confirmation', 1); 
        })->name('bookings.create');
        Route::get('/bookings/{booking}/payment', function ($booking) { 
            return Inertia::render('user/payments/show', ['booking' => $booking]); 
        })->name('payments.show');
        Route::post('/bookings/{booking}/pay', function ($booking) { 
            return redirect()->route('user.bookings.confirmation', $booking); 
        })->name('payments.process');
        Route::get('/bookings/{booking}/confirmation', function ($booking) { 
            return Inertia::render('user/bookings/confirmation', ['booking' => $booking]); 
        })->name('bookings.confirmation');
        
        // 3.4 Dashboard & Manajemen Akun
        Route::get('/dashboard', function () { 
            return Inertia::render('user/dashboard'); 
        })->name('dashboard');
        Route::get('/bookings', function () { 
            return Inertia::render('user/bookings/index'); 
        })->name('bookings.index');
        Route::get('/bookings/{booking}', function ($booking) { 
            return Inertia::render('user/bookings/show', ['booking' => $booking]); 
        })->name('bookings.show');
        Route::get('/payments', function () { 
            return Inertia::render('user/payments/index'); 
        })->name('payments.index');
        
        // Wishlist & Favorite
        Route::prefix('wishlist')->name('wishlist.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('user/wishlist/index'); 
            })->name('index');
            Route::post('/{property}', function ($property) { 
                return redirect()->route('user.wishlist.index'); 
            })->name('store');
            Route::delete('/{wishlist}', function ($wishlist) { 
                return redirect()->route('user.wishlist.index'); 
            })->name('destroy');
        });
        
        // 3.5 Bantuan & Support
        Route::prefix('chats')->name('chats.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('user/chats/index'); 
            })->name('index');
            Route::get('/{owner}', function ($owner) { 
                return Inertia::render('user/chats/show', ['owner' => $owner]); 
            })->name('show');
            Route::post('/{owner}/send', function ($owner) { 
                return redirect()->route('user.chats.show', $owner); 
            })->name('send');
        });
        
        Route::prefix('support')->name('support.')->group(function () {
            Route::get('/', function () { 
                return Inertia::render('user/support/index'); 
            })->name('index');
            Route::post('/ticket', function () { 
                return redirect()->route('user.support.index'); 
            })->name('create');
            Route::get('/ticket/{ticket}', function ($ticket) { 
                return Inertia::render('user/support/show', ['ticket' => $ticket]); 
            })->name('show');
            Route::post('/ticket/{ticket}/reply', function ($ticket) { 
                return redirect()->route('user.support.show', $ticket); 
            })->name('reply');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use App\Models\Activity;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard admin
     */
    public function index()
    {
        return inertia('admin/dashboard');
    }

    /**
     * API untuk mendapatkan data dashboard admin
     */
    public function apiData(Request $request)
    {
        // Ambil parameter periode dari request
        $period = $request->input('period', 'bulan-ini');
        
        // Hitung total pengguna
        $totalUsers = User::count();
        
        // Hitung total properti
        $totalProperties = Property::count();
        
        // Tentukan rentang waktu berdasarkan periode
        $startDate = now();
        $endDate = now();
        
        switch ($period) {
            case 'hari-ini':
                $startDate = now()->startOfDay();
                $endDate = now()->endOfDay();
                break;
            case 'minggu-ini':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
                break;
            case 'bulan-ini':
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
                break;
            case 'tahun-ini':
                $startDate = now()->startOfYear();
                $endDate = now()->endOfYear();
                break;
            default:
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
        }
        
        // Hitung pendapatan berdasarkan periode
        $monthlyRevenue = Booking::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'confirmed')
            ->sum('total_price');
        
        // Hitung tingkat okupansi (persentase kamar yang disewa)
        // Asumsi: setiap properti memiliki jumlah total kamar dan kamar tersedia
        $occupancyRate = 0;
        
        // Jika tabel atau relasi untuk menghitung okupansi sudah ada, bisa menggunakan kode di bawah
        /*
        $totalRooms = Property::sum('total_rooms');
        $occupiedRooms = Property::sum('occupied_rooms');
        
        if ($totalRooms > 0) {
            $occupancyRate = round(($occupiedRooms / $totalRooms) * 100);
        }
        */
        
        // Sementara gunakan nilai default untuk demonstrasi
        $occupancyRate = 75;
        
        // Dapatkan aktivitas terbaru
        $recentActivities = [];
        
        // Jika model Activity sudah ada
        if (class_exists('\App\Models\Activity')) {
            $recentActivities = Activity::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'user' => [
                            'id' => $activity->user->id,
                            'name' => $activity->user->name,
                            'avatar' => $activity->user->avatar,
                        ],
                        'action' => $activity->description,
                        'created_at' => $activity->created_at,
                    ];
                });
        } else {
            // Data dummy untuk demonstrasi
            $recentActivities = [
                [
                    'id' => 1,
                    'user' => [
                        'id' => 1,
                        'name' => 'Andika Pratama',
                        'avatar' => null,
                    ],
                    'action' => 'mendaftar sebagai pemilik kost',
                    'created_at' => now()->subMinutes(10),
                ],
                [
                    'id' => 2,
                    'user' => [
                        'id' => 2,
                        'name' => 'Budi Santoso',
                        'avatar' => null,
                    ],
                    'action' => 'menambahkan properti baru',
                    'created_at' => now()->subMinutes(25),
                ],
                [
                    'id' => 3,
                    'user' => [
                        'id' => 3,
                        'name' => 'Nina Safira',
                        'avatar' => null,
                    ],
                    'action' => 'melaporkan konten yang tidak pantas',
                    'created_at' => now()->subMinutes(42),
                ],
                [
                    'id' => 4,
                    'user' => [
                        'id' => 4,
                        'name' => 'Maya Wijaya',
                        'avatar' => null,
                    ],
                    'action' => 'mengajukan persetujuan listing',
                    'created_at' => now()->subHours(1),
                ],
            ];
        }
        
        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProperties' => $totalProperties,
                'monthlyRevenue' => $monthlyRevenue,
                'occupancyRate' => $occupancyRate,
            ],
            'recentActivities' => $recentActivities,
            'period' => $period,
        ]);
    }
}

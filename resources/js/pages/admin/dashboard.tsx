import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { User, UserPlus, UserCheck, ShieldCheck, Building, Tag, Flag, BarChart3, DollarSign, Calendar, Users, Bell, Activity, Clock, MoreHorizontal, Download, Filter, Database, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

// Periksa jika komponen Alert tersedia, jika tidak, gunakan Card sebagai pengganti
try {
    require('@/components/ui/alert');
} catch (error) {
    console.warn('Alert component not available, using Card instead');
}

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalProperties: number;
        monthlyRevenue: number;
        occupancyRate: number;
    };
    recentActivities: {
        id: number;
        user: {
            id: number;
            name: string;
            avatar: string | null;
        };
        action: string;
        created_at: string;
    }[];
}

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        monthlyRevenue: 0,
        occupancyRate: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini'); // 'hari-ini', 'minggu-ini', 'bulan-ini', 'tahun-ini'

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/api/admin/dashboard', {
                    params: { period: selectedPeriod }
                });
                setStats(response.data.stats);
                setRecentActivities(response.data.recentActivities);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Gagal memuat data dashboard. Silakan coba lagi nanti.');
                toast.error('Gagal memuat data dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedPeriod]);

    // Format currency to IDR
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format relative time for activities
    const formatRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds} detik yang lalu`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
        }
    };

    // Generate avatar initials
    const getInitials = (name: string) => {
        return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();
    };

    // Stats to display
    const statsDisplay = [
        { title: 'Total Pengguna', value: stats.totalUsers.toLocaleString('id-ID'), icon: <Users className='h-5 w-5 text-primary' />, href: '/admin/users' },
        { title: 'Total Properti', value: stats.totalProperties.toLocaleString('id-ID'), icon: <Building className='h-5 w-5 text-primary' />, href: '/admin/properties' },
        { title: 'Pendapatan Bulan Ini', value: formatCurrency(stats.monthlyRevenue), icon: <DollarSign className='h-5 w-5 text-primary' />, href: '/admin/transactions' },
        { title: 'Tingkat Okupansi', value: `${stats.occupancyRate}%`, icon: <BarChart3 className='h-5 w-5 text-primary' />, href: '/admin/properties' },
    ];

    // Skeleton loader for stats
    const StatSkeleton = () => (
        <Card className='shadow-sm'>
            <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-8 w-20 mt-2' />
                    </div>
                    <Skeleton className='h-12 w-12 rounded-full' />
                </div>
                <div className='mt-4'>
                    <Skeleton className='h-5 w-32' />
                </div>
            </CardContent>
        </Card>
    );

    // Skeleton loader for activities
    const ActivitySkeleton = () => (
        <div className='flex items-start gap-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-1 flex-1'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-3 w-24' />
            </div>
        </div>
    );

    // Filter Period options
    const periodOptions = [
        { value: 'hari-ini', label: 'Hari Ini' },
        { value: 'minggu-ini', label: 'Minggu Ini' },
        { value: 'bulan-ini', label: 'Bulan Ini' },
        { value: 'tahun-ini', label: 'Tahun Ini' },
    ];

    return (
        <AppLayout>
            <Head title='Dashboard Admin' />
            <div className='flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50 dark:bg-slate-900'>
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Dashboard Admin</h1>
                        <p className='text-muted-foreground mt-1'>Kelola pengguna, properti, dan pengaturan sistem</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-2 border rounded-md p-1 bg-card'>
                            {periodOptions.map((option) => (
                                <Button 
                                    key={option.value}
                                    variant={selectedPeriod === option.value ? 'default' : 'ghost'} 
                                    size='sm'
                                    onClick={() => setSelectedPeriod(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                        <Button variant='outline' size='sm'>
                            <Download className='mr-2 h-4 w-4' />
                            Ekspor Laporan
                        </Button>
                        <Button size='sm'>
                            <Bell className='mr-2 h-4 w-4' />
                            Notifikasi
                            <Badge className='ml-2' variant='secondary'>3</Badge>
                        </Button>
                    </div>
                </div>

                {error && (
                    <Card className='border-red-500 mb-4 bg-red-50'>
                        <CardContent className='p-4 flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4 text-red-500' />
                            <p className='text-red-700'>{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Statistik Utama */}
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {loading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        statsDisplay.map((stat, index) => (
                            <Card key={index} className='shadow-sm hover:shadow-md transition-all h-full'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
                                            <h3 className='text-3xl font-bold mt-2'>{stat.value}</h3>
                                        </div>
                                        <div className='rounded-full bg-primary/10 p-3'>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                    {/* Menu Manajemen Utama */}
                    <Card className='col-span-3 md:col-span-2 shadow-sm hover:shadow-md transition-all'>
                        <CardHeader className='pb-3'>
                            <CardTitle>Menu Utama</CardTitle>
                            <CardDescription>Akses cepat ke fitur manajemen utama</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid auto-rows-min gap-6 md:grid-cols-3'>
                                <Link href='/admin/users' className='flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1'>
                                    <div className='rounded-full bg-primary/10 p-3 mb-3'>
                                        <User className='h-6 w-6 text-primary' />
                                    </div>
                                    <h3 className='font-medium text-center'>Manajemen Pengguna</h3>
                                    <p className='text-sm text-muted-foreground text-center mt-1'>Kelola semua pengguna</p>
                                </Link>
                                
                                <Link href='/admin/properties' className='flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1'>
                                    <div className='rounded-full bg-primary/10 p-3 mb-3'>
                                        <Building className='h-6 w-6 text-primary' />
                                    </div>
                                    <h3 className='font-medium text-center'>Manajemen Properti</h3>
                                    <p className='text-sm text-muted-foreground text-center mt-1'>Kelola dan moderasi properti</p>
                                </Link>
                                
                                <Link href='/admin/content-moderation' className='flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1'>
                                    <div className='rounded-full bg-primary/10 p-3 mb-3'>
                                        <Flag className='h-6 w-6 text-primary' />
                                    </div>
                                    <h3 className='font-medium text-center'>Moderasi Konten</h3>
                                    <p className='text-sm text-muted-foreground text-center mt-1'>Kelola konten yang ditandai</p>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terbaru */}
                    <Card className='shadow-sm hover:shadow-md transition-all'>
                        <CardHeader className='pb-3'>
                            <div className='flex items-center justify-between'>
                                <CardTitle>Aktivitas Terbaru</CardTitle>
                                <Button variant='ghost' size='icon'>
                                    <MoreHorizontal className='h-4 w-4' />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {loading ? (
                                    <>
                                        <ActivitySkeleton />
                                        <ActivitySkeleton />
                                        <ActivitySkeleton />
                                        <ActivitySkeleton />
                                    </>
                                ) : recentActivities.length > 0 ? (
                                    recentActivities.map((activity: any) => (
                                        <div key={activity.id} className='flex items-start gap-4'>
                                            <Avatar>
                                                {activity.user.avatar ? (
                                                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                                                ) : (
                                                    <AvatarFallback className='bg-primary/10 text-primary'>
                                                        {getInitials(activity.user.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className='space-y-1'>
                                                <p className='text-sm'>
                                                    <span className='font-medium'>{activity.user.name}</span> {activity.action}
                                                </p>
                                                <div className='flex items-center text-xs text-muted-foreground'>
                                                    <Clock className='mr-1 h-3 w-3' />
                                                    {formatRelativeTime(activity.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-sm text-muted-foreground text-center py-4'>Tidak ada aktivitas terbaru</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant='outline' size='sm' className='w-full'>
                                Lihat Semua Aktivitas
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                
                <div className='grid gap-6 md:grid-cols-2'>
                    <Card className='shadow-sm hover:shadow-md transition-all'>
                        <CardHeader>
                            <CardTitle>Manajemen Properti & Konten</CardTitle>
                            <CardDescription>
                                <div className='flex items-center gap-4 mt-2'>
                                    <div className='rounded-lg bg-primary/10 p-2'>
                                        <Tag className='h-5 w-5 text-primary' />
                                    </div>
                                    <p>Kelola properti, kategori, dan moderasi konten</p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <Link href='/admin/properties?status=pending' className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Persetujuan Listing</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Validasi dan moderasi listing properti baru</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Periksa data dan deskripsi</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Setujui atau tolak listing</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Beri alasan penolakan</li>
                                    </ul>
                                </Link>
                                
                                <Link href='/admin/categories' className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Kategori & Tagging</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Kelola kategori dan tag untuk properti</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Tipe kamar (single/sharing)</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Fasilitas (AC, kamar mandi)</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Zona lokasi</li>
                                    </ul>
                                </Link>
                                
                                <Link href='/admin/content-moderation/keywords' className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Kata Terlarang</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Kelola kata-kata yang tidak diperbolehkan</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Tambah/hapus kata terlarang</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Atur tingkat keparahan</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Tentukan penggantian kata</li>
                                    </ul>
                                </Link>
                                
                                <Link href='/admin/content-moderation' className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Konten Ditandai</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Periksa konten yang dilaporkan pengguna</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Tinjau laporan</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Moderasi konten</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Beri peringatan</li>
                                    </ul>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className='shadow-sm hover:shadow-md transition-all'>
                        <CardHeader>
                            <CardTitle>Keuangan & Transaksi</CardTitle>
                            <CardDescription>
                                <div className='flex items-center gap-4 mt-2'>
                                    <div className='rounded-lg bg-primary/10 p-2'>
                                        <DollarSign className='h-5 w-5 text-primary' />
                                    </div>
                                    <p>Kelola transaksi, pembayaran, dan laporan keuangan</p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Transaksi</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Kelola semua transaksi pembayaran</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Lihat status pembayaran</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Konfirmasi pembayaran manual</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Filter transaksi</li>
                                    </ul>
                                </div>
                                
                                <div className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Refund & Pembatalan</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Proses permintaan pengembalian dana</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Review permintaan refund</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Proses pembatalan booking</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Kalkulasi biaya pembatalan</li>
                                    </ul>
                                </div>
                                
                                <div className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Settlement</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Kelola pembayaran ke pemilik kost</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Jadwalkan payout</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Periksa status transfer</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Riwayat settlement</li>
                                    </ul>
                                </div>
                                
                                <div className='group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20'>
                                    <h3 className='font-medium mb-2 group-hover:text-primary transition-colors'>Laporan Keuangan</h3>
                                    <p className='text-sm text-muted-foreground mb-2'>Lihat dan ekspor laporan keuangan</p>
                                    <ul className='text-sm space-y-1'>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Laporan pendapatan</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Analisis revenue</li>
                                        <li className='flex items-center gap-1'><span className='h-1.5 w-1.5 rounded-full bg-primary/70'></span> Ekspor laporan PDF/Excel</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

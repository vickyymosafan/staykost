import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { User, UserPlus, UserCheck, ShieldCheck, Building, Tag, Flag, BarChart3, DollarSign, Calendar, Users, Bell, Activity, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
    // Sample data - in a real app, this would come from your backend
    const stats = [
        { title: "Total Pengguna", value: "2,834", change: "+12.3%", icon: <Users className="h-5 w-5" /> },
        { title: "Total Properti", value: "482", change: "+8.2%", icon: <Building className="h-5 w-5" /> },
        { title: "Pendapatan Bulan Ini", value: "Rp 45.3jt", change: "+5.7%", icon: <DollarSign className="h-5 w-5" /> },
        { title: "Tingkat Okupansi", value: "76%", change: "+2.5%", icon: <BarChart3 className="h-5 w-5" /> },
    ];

    const recentActivity = [
        { user: "Andika Pratama", action: "mendaftar sebagai pemilik kost", time: "10 menit yang lalu", avatar: "A" },
        { user: "Budi Santoso", action: "menambahkan properti baru", time: "25 menit yang lalu", avatar: "B" },
        { user: "Nina Safira", action: "melaporkan konten yang tidak pantas", time: "42 menit yang lalu", avatar: "N" },
        { user: "Maya Wijaya", action: "mengajukan persetujuan listing", time: "1 jam yang lalu", avatar: "M" },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
                        <p className="text-muted-foreground mt-1">Kelola pengguna, properti, dan pengaturan sistem</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Filter Tanggal
                        </Button>
                        <Button variant="outline" size="sm">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Ekspor Laporan
                        </Button>
                        <Button size="sm">
                            <Bell className="mr-2 h-4 w-4" />
                            Notifikasi
                            <Badge className="ml-2" variant="secondary">3</Badge>
                        </Button>
                    </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                                    </div>
                                    <div className="rounded-full bg-primary/10 p-3">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                                        <Activity className="mr-1 h-3 w-3" />
                                        {stat.change}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground ml-2">dibanding bulan lalu</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Menu Manajemen Utama */}
                    <Card className="col-span-3 md:col-span-2 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                            <CardTitle>Menu Utama</CardTitle>
                            <CardDescription>Akses cepat ke fitur manajemen utama</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                                <Link href={route('admin.users.index')} className="flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1">
                                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-center">Manajemen Pengguna</h3>
                                    <p className="text-sm text-muted-foreground text-center mt-1">Kelola semua pengguna</p>
                                </Link>
                                
                                <Link href={route('admin.properties.index')} className="flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1">
                                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                                        <Building className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-center">Manajemen Properti</h3>
                                    <p className="text-sm text-muted-foreground text-center mt-1">Kelola dan moderasi properti</p>
                                </Link>
                                
                                <Link href={route('admin.content-moderation.index')} className="flex flex-col items-center p-6 rounded-xl border bg-card text-card-foreground transition-all hover:bg-accent/40 hover:-translate-y-1">
                                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                                        <Flag className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-center">Moderasi Konten</h3>
                                    <p className="text-sm text-muted-foreground text-center mt-1">Kelola konten yang ditandai</p>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Terbaru */}
                    <Card className="shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Aktivitas Terbaru</CardTitle>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {activity.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <p className="text-sm"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                Lihat Semua Aktivitas
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle>Manajemen Properti & Konten</CardTitle>
                            <CardDescription>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Tag className="h-5 w-5 text-primary" />
                                    </div>
                                    <p>Kelola properti, kategori, dan moderasi konten</p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Link href={route('admin.properties.index', { status: 'pending' })} className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">Persetujuan Listing</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Validasi dan moderasi listing properti baru</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Periksa data dan deskripsi</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Setujui atau tolak listing</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Beri alasan penolakan</li>
                                    </ul>
                                </Link>
                                
                                <Link href={route('admin.categories.index')} className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">Kategori & Tagging</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Kelola kategori dan tag untuk properti</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Tipe kamar (single/sharing)</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Fasilitas (AC, kamar mandi)</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Zona lokasi</li>
                                    </ul>
                                </Link>
                                
                                <Link href={route('admin.content-moderation.keywords')} className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">Kata Terlarang</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Kelola kata-kata yang tidak diperbolehkan</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Tambah/hapus kata terlarang</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Atur tingkat keparahan</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Tentukan penggantian kata</li>
                                    </ul>
                                </Link>
                                
                                <Link href={route('admin.content-moderation.index')} className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">Konten Ditandai</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Periksa konten yang dilaporkan pengguna</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Tinjau laporan</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Ambil tindakan</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Hapus atau setujui konten</li>
                                    </ul>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm hover:shadow-md transition-all">
                        <CardHeader>
                            <CardTitle>Manajemen Peran & Izin</CardTitle>
                            <CardDescription>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <p>Tentukan siapa yang dapat mengakses apa di sistem</p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Admin</h3>
                                    </div>
                                    <Badge className="mb-2" variant="outline">Akses Penuh</Badge>
                                    <p className="text-sm text-muted-foreground mb-2">Administrator sistem</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Kelola semua pengguna</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Setujui daftar</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Konfigurasikan sistem</li>
                                    </ul>
                                </div>
                                
                                <div className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Pemilik</h3>
                                    </div>
                                    <Badge className="mb-2" variant="outline">Akses Menengah</Badge>
                                    <p className="text-sm text-muted-foreground mb-2">Pemilik properti</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Buat daftar</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Kelola pemesanan</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Lihat laporan</li>
                                    </ul>
                                </div>
                                
                                <div className="group rounded-lg border p-4 transition-all hover:bg-accent/40 hover:border-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Pengguna</h3>
                                    </div>
                                    <Badge className="mb-2" variant="outline">Akses Terbatas</Badge>
                                    <p className="text-sm text-muted-foreground mb-2">Pengguna biasa</p>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Jelajahi daftar</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Lakukan pemesanan</li>
                                        <li className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary/70"></span> Tulis ulasan</li>
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

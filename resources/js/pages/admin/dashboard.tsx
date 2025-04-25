import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { User, UserPlus, UserCheck, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
                <p className="text-muted-foreground mb-6">Kelola pengguna, properti, dan pengaturan sistem</p>
                
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href={route('admin.users.index')} className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Manajemen Pengguna</h3>
                                <p className="text-sm text-muted-foreground">Kelola semua pengguna</p>
                            </div>
                        </div>
                    </Link>
                    
                    <Link href={route('admin.users.create')} className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <UserPlus className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Tambah Pengguna Baru</h3>
                                <p className="text-sm text-muted-foreground">Buat akun baru</p>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <UserCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Verifikasi</h3>
                                <p className="text-sm text-muted-foreground">Kelola verifikasi pengguna</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
                    <h2 className="mb-4 text-xl font-semibold">Manajemen Peran & Izin</h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-muted-foreground">Tentukan siapa yang dapat mengakses apa di sistem</p>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                            <h3 className="font-medium mb-2">Admin</h3>
                            <p className="text-sm text-muted-foreground mb-2">Administrator sistem dengan akses penuh</p>
                            <ul className="text-sm space-y-1">
                                <li>• Kelola semua pengguna</li>
                                <li>• Setujui daftar</li>
                                <li>• Konfigurasikan sistem</li>
                            </ul>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                            <h3 className="font-medium mb-2">Pemilik</h3>
                            <p className="text-sm text-muted-foreground mb-2">Pemilik properti yang mengelola daftar</p>
                            <ul className="text-sm space-y-1">
                                <li>• Buat daftar</li>
                                <li>• Kelola pemesanan</li>
                                <li>• Lihat laporan</li>
                            </ul>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                            <h3 className="font-medium mb-2">Pengguna</h3>
                            <p className="text-sm text-muted-foreground mb-2">Pengguna biasa yang dapat memesan properti</p>
                            <ul className="text-sm space-y-1">
                                <li>• Jelajahi daftar</li>
                                <li>• Lakukan pemesanan</li>
                                <li>• Tulis ulasan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

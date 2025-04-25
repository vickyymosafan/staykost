import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Home, Users, Building, Tag, ShieldCheck, Flag, KeyRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Pengguna',
        href: route('admin.users.index'),
        icon: Users,
        children: [
            {
                title: 'Semua Pengguna',
                href: route('admin.users.index'),
            },
            {
                title: 'Verifikasi KYC',
                href: route('admin.kyc.index'),
            },
        ],
    },
    {
        title: 'Properti',
        href: route('admin.properties.index'),
        icon: Building,
        children: [
            {
                title: 'Semua Properti',
                href: route('admin.properties.index'),
            },
            {
                title: 'Menunggu Persetujuan',
                href: route('admin.properties.index', { status: 'pending' }),
            },
            {
                title: 'Disetujui',
                href: route('admin.properties.index', { status: 'approved' }),
            },
            {
                title: 'Ditolak',
                href: route('admin.properties.index', { status: 'rejected' }),
            },
        ],
    },
    {
        title: 'Kategori & Fasilitas',
        href: route('admin.categories.index'),
        icon: Tag,
        children: [
            {
                title: 'Tipe Kamar',
                href: route('admin.categories.index', { type: 'room_type' }),
            },
            {
                title: 'Tipe Fasilitas',
                href: route('admin.categories.index', { type: 'facility_type' }),
            },
            {
                title: 'Zona Lokasi',
                href: route('admin.categories.index', { type: 'location_zone' }),
            },
            {
                title: 'Fasilitas',
                href: route('admin.facilities.index'),
            },
        ],
    },
    {
        title: 'Moderasi Konten',
        href: route('admin.content-moderation.index'),
        icon: Flag,
        children: [
            {
                title: 'Konten Yang Ditandai',
                href: route('admin.content-moderation.index'),
            },
            {
                title: 'Kata Terlarang',
                href: route('admin.content-moderation.keywords'),
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('admin.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: 'Halaman Utama' }}>
                            <Link href="/" prefetch>
                                <Home className="size-4" />
                                <span>Halaman Utama</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

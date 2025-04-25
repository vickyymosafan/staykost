import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-select';
import { Edit, Plus, Search, Trash2, User, UserCheck, Check, X } from 'lucide-react';
import { useState, ChangeEvent } from 'react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export function Pagination({ links }: { links: PaginationLink[] }) {
  // Don't render pagination if there's only 1 page
  if (links.length <= 3) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {links.map((link, key) => {
        // Remove "&laquo;" and "&raquo;" entities
        const label = link.label.replace(/&laquo;\s*/, '').replace(/&raquo;\s*/, '');
        
        // Detect prev/next links
        const isPrevious = link.label.includes('&laquo;');
        const isNext = link.label.includes('&raquo;');
        
        if (!link.url && !link.active) {
          return (
            <span 
              key={key}
              className="px-4 py-2 text-sm text-gray-500 rounded-md"
            >
              ...
            </span>
          );
        }

        return link.url ? (
          <Link
            key={key}
            href={link.url}
            className={`${
              link.active ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            } px-4 py-2 text-sm rounded-md ${
              isPrevious || isNext ? 'px-3' : ''
            }`}
          >
            {isPrevious ? 'u2190 Sebelumnya' : isNext ? 'Berikutnya u2192' : label}
          </Link>
        ) : (
          <span
            key={key}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  verification_status: 'unverified' | 'pending' | 'verified';
  created_at: string;
}

interface Props {
  users: {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
  filters: {
    search?: string;
    role?: string;
    verification_status?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

export default function UserIndex({ users, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [role, setRole] = useState(filters.role || '');
  const [verificationStatus, setVerificationStatus] = useState(filters.verification_status || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  function search() {
    router.get(
      route('admin.users.index'),
      {
        search: searchTerm,
        role: role,
        verification_status: verificationStatus,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  }

  function sort(field: string) {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    router.get(
      route('admin.users.index'),
      {
        search: searchTerm,
        role: role,
        verification_status: verificationStatus,
        sort_field: field,
        sort_direction: direction,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  }

  function deleteUser(id: number) {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      router.delete(route('admin.users.destroy', id));
    }
  }

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    owner: 'Pemilik',
    user: 'Pengguna',
  };

  const verificationLabels: Record<string, string> = {
    unverified: 'Belum Diverifikasi',
    pending: 'Menunggu',
    verified: 'Terverifikasi',
  };

  const verificationColors: Record<string, string> = {
    unverified: 'text-gray-500 bg-gray-100',
    pending: 'text-yellow-700 bg-yellow-100',
    verified: 'text-green-700 bg-green-100',
  };

  return (
    <AppLayout>
      <Head title={verificationStatus === 'pending' ? 'Verifikasi & KYC - Dokumen yang menunggu verifikasi' : 'Manajemen Pengguna'} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">
              {verificationStatus === 'pending' ? 'Verifikasi & KYC - Dokumen yang menunggu verifikasi' : 'Kelola semua pengguna dan akun'}
            </p>
          </div>
          <Link href={route('admin.users.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
            </Button>
          </Link>
        </div>

        {/* KYC Verification Quick Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <Link href={route('admin.users.index', { verification_status: 'pending' })}>  
            <Button
              variant={verificationStatus === 'pending' ? 'default' : 'outline'}
              className="w-full sm:w-auto gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Menunggu Verifikasi
            </Button>
          </Link>
          <Link href={route('admin.users.index', { verification_status: 'verified' })}>  
            <Button
              variant={verificationStatus === 'verified' ? 'default' : 'outline'}
              className="w-full sm:w-auto gap-2"  
            >
              <Check className="h-4 w-4" />
              Terverifikasi
            </Button>
          </Link>
          <Link href={route('admin.users.index', { verification_status: 'unverified' })}>  
            <Button
              variant={verificationStatus === 'unverified' ? 'default' : 'outline'}
              className="w-full sm:w-auto gap-2"
            >
              <X className="h-4 w-4" />
              Belum Terverifikasi
            </Button>
          </Link>
          <Link href={route('admin.users.index')}>  
            <Button
              variant={!verificationStatus ? 'default' : 'outline'}
              className="w-full sm:w-auto gap-2"  
            >
              <User className="h-4 w-4" />
              Semua Pengguna
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row gap-4 border-b">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                className="w-full pl-9"
              />
            </div>
            <Select
              value={role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setRole(e.target.value);
                search();
              }}
              className="md:w-48"
            >
              <option value="">Semua Peran</option>
              <option value="admin">Admin</option>
              <option value="owner">Pemilik</option>
              <option value="user">Pengguna</option>
            </Select>
            <Select
              value={verificationStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setVerificationStatus(e.target.value);
                search();
              }}
              className="md:w-48"
            >
              <option value="">Semua Status Verifikasi</option>
              <option value="unverified">Belum Diverifikasi</option>
              <option value="pending">Menunggu</option>
              <option value="verified">Terverifikasi</option>
            </Select>
            <Button onClick={search} className="md:w-24">
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => sort('name')}
                  >
                    Nama {sortField === 'name' && (sortDirection === 'asc' ? 'u2191' : 'u2193')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => sort('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? 'u2191' : 'u2193')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => sort('role')}
                  >
                    Peran {sortField === 'role' && (sortDirection === 'asc' ? 'u2191' : 'u2193')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => sort('verification_status')}
                  >
                    Status Verifikasi {sortField === 'verification_status' && (sortDirection === 'asc' ? 'u2191' : 'u2193')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => sort('created_at')}
                  >
                    Dibuat {sortField === 'created_at' && (sortDirection === 'asc' ? 'u2191' : 'u2193')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                ) : (
                  users.data.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationColors[user.verification_status] || ''}`}
                        >
                          {verificationLabels[user.verification_status] || user.verification_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={route('admin.users.show', user.id)} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <Button variant="ghost" size="sm">
                              Lihat
                            </Button>
                          </Link>
                          <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {users.last_page > 1 && (
            <div className="px-6 py-4 border-t">
              <Pagination links={users.links} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

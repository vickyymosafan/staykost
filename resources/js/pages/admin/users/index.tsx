import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-select';
import { Edit, Plus, Search, Trash2, User, UserCheck, Check, X, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, ChangeEvent } from 'react';

// Types
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  verification_status: 'unverified' | 'pending' | 'verified';
  created_at: string;
  id_card_path: string | null;
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

// Constants
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

// Components
const Pagination = ({ links }: { links: PaginationLink[] }) => {
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
            {isPrevious ? '← Sebelumnya' : isNext ? 'Berikutnya →' : label}
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
};

const SortableHeader = ({ 
  label, 
  field, 
  currentSort, 
  direction, 
  onSort 
}: { 
  label: string; 
  field: string; 
  currentSort: string; 
  direction: string; 
  onSort: (field: string) => void 
}) => (
  <th className="px-6 py-3 cursor-pointer" onClick={() => onSort(field)}>
    <div className="flex items-center gap-1">
      {label}
      {currentSort === field && (
        <span className="ml-1">
          {direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        </span>
      )}
    </div>
  </th>
);

const VerificationStatusBadge = ({ status, idCardPath }: { status: string, idCardPath: string | null }) => (
  <>
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${verificationColors[status] || ''}`}>
      {verificationLabels[status] || status}
    </span>
    {status === 'pending' && idCardPath && (
      <span className="ml-2 text-xs text-blue-600">
        <FileText className="h-3 w-3 inline" /> Dokumen tersedia
      </span>
    )}
  </>
);

const UserActions = ({ user, onDelete }: { user: User, onDelete: (id: number) => void }) => (
  <div className="flex justify-end gap-2">
    <Link href={route('admin.users.show', user.id)}>
      <Button variant="outline" size="sm">
        {user.verification_status === 'pending' ? (
          <>
            <UserCheck className="h-4 w-4 mr-1" /> Verifikasi KYC
          </>
        ) : (
          <>
            <User className="h-4 w-4 mr-1" /> Detail
          </>
        )}
      </Button>
    </Link>
    <Link href={route('admin.users.edit', user.id)}>
      <Button variant="outline" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
    </Link>
    <Button variant="outline" size="sm" onClick={() => onDelete(user.id)}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  </div>
);

const SearchBar = ({ 
  searchTerm, 
  role, 
  verificationStatus, 
  onSearchChange, 
  onRoleChange, 
  onVerificationChange, 
  onSearch 
}: { 
  searchTerm: string; 
  role: string; 
  verificationStatus: string; 
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void; 
  onRoleChange: (e: ChangeEvent<HTMLSelectElement>) => void; 
  onVerificationChange: (e: ChangeEvent<HTMLSelectElement>) => void; 
  onSearch: () => void; 
}) => (
  <div className="p-4 flex flex-col md:flex-row gap-4 border-b">
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder="Cari pengguna..."
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="w-full pl-9"
      />
    </div>
    <Select
      value={role}
      onChange={onRoleChange}
      className="md:w-48"
    >
      <option value="">Semua Peran</option>
      <option value="admin">Admin</option>
      <option value="owner">Pemilik</option>
      <option value="user">Pengguna</option>
    </Select>
    <Select
      value={verificationStatus}
      onChange={onVerificationChange}
      className="md:w-48"
    >
      <option value="">Semua Status Verifikasi</option>
      <option value="unverified">Belum Diverifikasi</option>
      <option value="pending">Menunggu</option>
      <option value="verified">Terverifikasi</option>
    </Select>
  </div>
);

const VerificationQuickFilters = ({ activeStatus }: { activeStatus: string }) => (
  <div className="mb-6 flex flex-col sm:flex-row gap-3">
    <Link href={route('admin.users.index', { verification_status: 'pending' })}>  
      <Button
        variant={activeStatus === 'pending' ? 'default' : 'outline'}
        className="w-full sm:w-auto gap-2"
      >
        <UserCheck className="h-4 w-4" />
        Menunggu Verifikasi
      </Button>
    </Link>
    <Link href={route('admin.users.index', { verification_status: 'verified' })}>  
      <Button
        variant={activeStatus === 'verified' ? 'default' : 'outline'}
        className="w-full sm:w-auto gap-2"  
      >
        <Check className="h-4 w-4" />
        Terverifikasi
      </Button>
    </Link>
    <Link href={route('admin.users.index', { verification_status: 'unverified' })}>  
      <Button
        variant={activeStatus === 'unverified' ? 'default' : 'outline'}
        className="w-full sm:w-auto gap-2"
      >
        <X className="h-4 w-4" />
        Belum Diverifikasi
      </Button>
    </Link>
    <Link href={route('admin.users.index')}>  
      <Button
        variant={!activeStatus ? 'default' : 'outline'}
        className="w-full sm:w-auto gap-2"
      >
        <User className="h-4 w-4" />
        Semua Pengguna
      </Button>
    </Link>
  </div>
);

// Main Component
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

  return (
    <AppLayout>
      <Head title={verificationStatus === 'pending' ? 'Verifikasi & KYC - Dokumen yang menunggu verifikasi' : 'Manajemen Pengguna'} />
      
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {verificationStatus === 'pending' ? 'Verifikasi & KYC' : 'Manajemen Pengguna'}
              </h1>
              <p className="text-muted-foreground">
                {verificationStatus === 'pending' 
                  ? 'Kelola verifikasi dokumen identitas pengguna' 
                  : 'Kelola semua pengguna dan akun'}
              </p>
            </div>
            <Link href={route('admin.users.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
              </Button>
            </Link>
          </div>

          {/* KYC Verification Quick Filters */}
          <VerificationQuickFilters activeStatus={verificationStatus} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <SearchBar 
              searchTerm={searchTerm}
              role={role}
              verificationStatus={verificationStatus}
              onSearchChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onRoleChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setRole(e.target.value);
                search();
              }}
              onVerificationChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setVerificationStatus(e.target.value);
                search();
              }}
              onSearch={search}
            />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader 
                      label="Nama" 
                      field="name" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={sort} 
                    />
                    <SortableHeader 
                      label="Email" 
                      field="email" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={sort} 
                    />
                    <SortableHeader 
                      label="Peran" 
                      field="role" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={sort} 
                    />
                    <SortableHeader 
                      label="Status Verifikasi" 
                      field="verification_status" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={sort} 
                    />
                    <SortableHeader 
                      label="Tanggal Dibuat" 
                      field="created_at" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={sort} 
                    />
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.data.map((user) => (
                    <tr key={user.id} className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <VerificationStatusBadge status={user.verification_status} idCardPath={user.id_card_path} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <UserActions user={user} onDelete={deleteUser} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan {users.data.length} dari {users.current_page} halaman
              </div>
              <Pagination links={users.links} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

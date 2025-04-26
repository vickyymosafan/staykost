import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/table';
import { 
  Building, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Plus,
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

// Types
interface Property {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  } | null;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface PropertiesIndexProps {
  properties?: {
    data: Property[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
  filters?: {
    status: string;
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
  };
}

// Utils
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(price);
};

// Components
const PropertyStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3" /> Menunggu</Badge>;
    case 'approved':
      return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" /> Disetujui</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Ditolak</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const PropertyTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <span className="text-primary">↑</span> : 
      <span className="text-primary">↓</span>;
  };

  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead 
          className="cursor-pointer" 
          onClick={() => onSort('name')}
        >
          <div className="flex items-center">
            Nama Properti {getSortIcon('name')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('owner_name')}
        >
          <div className="flex items-center">
            Pemilik {getSortIcon('owner_name')}
          </div>
        </TableHead>
        <TableHead>Kategori</TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('price')}
        >
          <div className="flex items-center">
            Harga {getSortIcon('price')}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('status')}
        >
          <div className="flex items-center">
            Status {getSortIcon('status')}
          </div>
        </TableHead>
        <TableHead className="text-right">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const PropertyEmptyState = ({ 
  activeStatus, 
  searchQuery, 
  statuses 
}: { 
  activeStatus: string;
  searchQuery: string;
  statuses: Record<string, string>;
}) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
        <div className="flex flex-col items-center justify-center">
          <Building className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium mb-1">Tidak ada properti ditemukan</h3>
          {searchQuery ? (
            <p className="text-sm">Tidak ditemukan hasil untuk pencarian "{searchQuery}"</p>
          ) : activeStatus !== 'all' ? (
            <p className="text-sm">Tidak ada properti dengan status "{statuses[activeStatus]}"</p>
          ) : (
            <p className="text-sm">Tambahkan properti baru untuk mulai menampilkan data</p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

const PropertySearchFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  activeStatus, 
  handleStatusChange, 
  handleSearch,
  statuses
}: { 
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeStatus: string;
  handleStatusChange: (status: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  statuses: Record<string, string>;
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
        <div className="relative w-full sm:w-auto">
          <form onSubmit={handleSearch} className="w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari properti..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <Select value={activeStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <span className="truncate">
                {activeStatus === 'all' ? 'Semua Status' : `Status: ${statuses[activeStatus as keyof typeof statuses]}`}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Missing import statements
import { TableHead, TableHeader } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Filter, ChevronsUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function PropertiesIndex({ properties, filters }: PropertiesIndexProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [activeStatus, setActiveStatus] = useState(filters?.status || 'all');
  const sortField = filters?.sort || 'created_at';
  const sortDirection = filters?.direction || 'desc';

  const statuses = {
    all: 'Semua',
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  };

  // Handlers
  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    applyFilters({ status });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    applyFilters({ sort: field, direction });
  };

  const applyFilters = (newFilters: Record<string, any>) => {
    router.get(
      route('admin.properties.index'),
      {
        ...filters,
        ...newFilters,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Manajemen Properti" />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-center sm:text-left">Manajemen Properti</h1>
            <p className="text-muted-foreground text-center sm:text-left">Kelola dan monitor properti pada platform</p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href={route('admin.properties.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Properti
            </Link>
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-center sm:text-left">Daftar Properti</CardTitle>
            <CardDescription className="text-center sm:text-left">Manajemen listing properti</CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Search & Filter */}
            <PropertySearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeStatus={activeStatus}
              handleStatusChange={handleStatusChange}
              handleSearch={handleSearch}
              statuses={statuses}
            />

            {/* Table */}
            <div className="mt-4 rounded-md border overflow-hidden">
              <Table>
                <PropertyTableHeader 
                  sortField={sortField} 
                  sortDirection={sortDirection as 'asc' | 'desc'} 
                  onSort={handleSort} 
                />
                <TableBody>
                  {properties && properties.data.length > 0 ? (
                    properties.data.map(property => (
                      <TableRow key={property.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{property.owner.name}</span>
                            <span className="text-xs text-muted-foreground">{property.owner.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.category?.name || '-'}</TableCell>
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell><PropertyStatusBadge status={property.status} /></TableCell>
                        <TableCell className="text-right">
                          <PropertyActions property={property} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <PropertyEmptyState 
                      activeStatus={activeStatus}
                      searchQuery={searchQuery}
                      statuses={statuses}
                    />
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {properties && properties.meta && properties.meta.last_page > 1 && (
              <div className="mt-4 p-4 flex flex-col sm:flex-row items-center justify-between border-t gap-3">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  Menampilkan {properties.meta.from || 0} - {properties.meta.to || 0} dari {properties.meta.total} properti
                </div>
                <Pagination
                  current_page={properties.meta.current_page}
                  last_page={properties.meta.last_page}
                  from={properties.meta.from}
                  to={properties.meta.to}
                  total={properties.meta.total}
                  path={properties.meta.path}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// Property Actions Component
const PropertyActions = ({ property }: { property: Property }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="Lihat Detail">
        <Link href={route('admin.properties.show', property.id)}>
          <span className="sr-only">Lihat</span>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      
      {property.status === 'pending' && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Setujui"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menyetujui properti ini?')) {
                router.put(route('admin.properties.approve', property.id));
              }
            }}
          >
            <span className="sr-only">Setujui</span>
            <CheckCircle className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Tolak" 
            asChild
          >
            <Link href={route('admin.properties.reject-form', property.id)}>
              <span className="sr-only">Tolak</span>
              <XCircle className="h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Edit"
        asChild
      >
        <Link href={route('admin.properties.edit', property.id)}>
          <span className="sr-only">Edit</span>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

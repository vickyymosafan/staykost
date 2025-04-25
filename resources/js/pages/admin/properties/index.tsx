import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Building, CheckCircle, XCircle, Clock, Eye, Edit, Trash } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

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
  };
}

export default function PropertiesIndex({ properties, filters }: PropertiesIndexProps) {
  const [activeStatus, setActiveStatus] = useState(filters?.status || 'all');
  
  const statuses = {
    all: 'Semua',
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu</Badge>;
      case 'approved':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" /> Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    router.get(route('admin.properties.index'), { status }, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Properti" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Properti</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Daftar Properti</CardTitle>
                <CardDescription>Kelola dan validasi listing properti</CardDescription>
              </div>
              
              <div className="w-full sm:w-72">
                <Select value={activeStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Properti</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {properties && properties.data && properties.data.length > 0 ? (
                  properties.data.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.owner.name}</TableCell>
                      <TableCell>{property.category?.name || '-'}</TableCell>
                      <TableCell>Rp {property.price}</TableCell>
                      <TableCell>{getStatusBadge(property.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.properties.show', property.id)}>
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          {property.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-green-600"
                                onClick={() => {
                                  if (confirm('Apakah Anda yakin ingin menyetujui properti ini?')) {
                                    router.put(route('admin.properties.approve', property.id));
                                  }
                                }}
                              >
                                <span className="sr-only">Approve</span>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="icon" className="text-red-600" asChild>
                                <Link href={route('admin.properties.reject-form', property.id)}>
                                  <span className="sr-only">Reject</span>
                                  <XCircle className="h-4 w-4" />
                                </Link>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Building className="h-10 w-10 mb-2 text-muted-foreground/50" />
                        <p>
                          {activeStatus === 'all'
                            ? 'Tidak ada properti ditemukan'
                            : `Tidak ada properti dengan status "${statuses[activeStatus as keyof typeof statuses]}" ditemukan`}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {properties && properties.meta && (
              <div className="mt-6">
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

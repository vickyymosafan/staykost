import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Refrigerator, PlusCircle, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: number;
  name: string;
}

interface Facility {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  category: Category | null;
}

interface FacilitiesIndexProps {
  facilities: {
    data: Facility[];
    links: any;
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
  categories: Category[];
}

export default function FacilitiesIndex({ facilities, categories }: FacilitiesIndexProps) {
  const handleCategoryChange = (value: string) => {
    router.get(route('admin.facilities.index', { category_id: value }));
  };

  // Render facility icon
  const renderIcon = (icon: string | null) => {
    if (!icon) return <Refrigerator className="h-4 w-4" />;
    
    // You can use a dynamic component based on the icon name
    // For simplicity, we'll just show the icon name
    return <span className="text-xs font-mono">{icon}</span>;
  };

  return (
    <AppLayout>
      <Head title="Kelola Fasilitas" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola Fasilitas</h1>
            <p className="text-muted-foreground">Manajemen fasilitas properti</p>
          </div>
          <Button asChild>
            <Link href={route('admin.facilities.create')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Fasilitas
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Fasilitas</CardTitle>
                <CardDescription>Kelola fasilitas untuk properti</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Refrigerator className="h-10 w-10 mb-2 text-muted-foreground/50" />
                        <p>Tidak ada fasilitas ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  facilities.data.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.category?.name || '-'}</TableCell>
                      <TableCell>{facility.description || '-'}</TableCell>
                      <TableCell>{renderIcon(facility.icon)}</TableCell>
                      <TableCell>
                        {facility.is_active ? (
                          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3" /> Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3" /> Tidak Aktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={route('admin.facilities.edit', facility.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" asChild>
                            <Link 
                              href={route('admin.facilities.destroy', facility.id)} 
                              method="delete" 
                              as="button"
                              data={{ _confirm: 'Apakah Anda yakin ingin menghapus fasilitas ini?' }}
                            >
                              <Trash className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Pagination
                current_page={facilities.meta.current_page}
                last_page={facilities.meta.last_page}
                from={facilities.meta.from}
                to={facilities.meta.to}
                total={facilities.meta.total}
                path={facilities.meta.path}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

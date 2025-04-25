import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Tag, PlusCircle, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'room_type' | 'facility_type' | 'location_zone';
  description: string | null;
  is_active: boolean;
}

interface CategoriesIndexProps {
  categories: {
    data: Category[];
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
  type: string;
}

export default function CategoriesIndex({ categories, type }: CategoriesIndexProps) {
  const getCategoryTypeLabel = (type: string) => {
    switch (type) {
      case 'room_type':
        return 'Tipe Kamar';
      case 'facility_type':
        return 'Tipe Fasilitas';
      case 'location_zone':
        return 'Zona Lokasi';
      default:
        return type;
    }
  };

  const handleTypeChange = (value: string) => {
    router.get(route('admin.categories.index', { type: value }));
  };

  return (
    <AppLayout>
      <Head title="Kelola Kategori" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola Kategori</h1>
            <p className="text-muted-foreground">Manajemen kategori dan tag properti</p>
          </div>
          <Button asChild>
            <Link href={route('admin.categories.create')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Kategori</CardTitle>
                <CardDescription>Kelola kategorisasi properti</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={type} onValueChange={handleTypeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="room_type">Tipe Kamar</TabsTrigger>
                <TabsTrigger value="facility_type">Tipe Fasilitas</TabsTrigger>
                <TabsTrigger value="location_zone">Zona Lokasi</TabsTrigger>
              </TabsList>

              <TabsContent value={type} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center">
                            <Tag className="h-10 w-10 mb-2 text-muted-foreground/50" />
                            <p>Tidak ada kategori ditemukan</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.data.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.description || '-'}</TableCell>
                          <TableCell>
                            {category.is_active ? (
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
                                <Link href={route('admin.categories.edit', category.id)}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600" asChild>
                                <Link 
                                  href={route('admin.categories.destroy', category.id)} 
                                  method="delete" 
                                  as="button"
                                  data={{ _confirm: 'Apakah Anda yakin ingin menghapus kategori ini?' }}
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
                    current_page={categories.meta.current_page}
                    last_page={categories.meta.last_page}
                    from={categories.meta.from}
                    to={categories.meta.to}
                    total={categories.meta.total}
                    path={categories.meta.path}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

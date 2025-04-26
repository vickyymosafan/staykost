import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'room_type' | 'facility_type' | 'location_zone';
  description: string | null;
  is_active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface CategoriesIndexProps {
  categories?: {
    data: Category[];
    meta: PaginationMeta;
  };
  type?: string;
  filters?: {
    type: string;
  };
}

// Category type mapping
const CATEGORY_TYPES = {
  room_type: 'Tipe Kamar',
  facility_type: 'Tipe Fasilitas',
  location_zone: 'Zona Lokasi'
};

type CategoryType = keyof typeof CATEGORY_TYPES;

// Components
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  isActive ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      <CheckCircle className="h-3 w-3 mr-1" /> Aktif
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
      <XCircle className="h-3 w-3 mr-1" /> Tidak Aktif
    </Badge>
  )
);

const CategoryActions = ({ category }: { category: Category }) => {
  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      router.delete(route('admin.categories.destroy', category.id));
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={route('admin.categories.show', category.id)}>
          <span className="sr-only">View</span>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href={route('admin.categories.edit', category.id)}>
          <span className="sr-only">Edit</span>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-500" 
        onClick={handleDelete}
      >
        <span className="sr-only">Delete</span>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

const CategoriesTable = ({ categories, activeType }: { categories?: { data: Category[], meta: PaginationMeta }, activeType: CategoryType }) => {
  if (!categories || !categories.data || categories.data.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              Tidak ada data kategori untuk {CATEGORY_TYPES[activeType]}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description || '-'}</TableCell>
              <TableCell>
                <StatusBadge isActive={category.is_active} />
              </TableCell>
              <TableCell className="text-right">
                <CategoryActions category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.meta && (
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
      )}
    </>
  );
};

export default function CategoriesIndex({ categories, type = 'room_type', filters }: CategoriesIndexProps) {
  const initialType = type || (filters?.type || 'room_type');
  const [activeType, setActiveType] = useState<CategoryType>(initialType as CategoryType);
  
  useEffect(() => {
    // If type changes from props, update the active type
    if (type && type !== activeType) {
      setActiveType(type as CategoryType);
    }
  }, [type]);
  
  const handleTypeChange = (newType: string) => {
    const categoryType = newType as CategoryType;
    setActiveType(categoryType);
    router.get(route('admin.categories.index'), { type: categoryType }, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Kategori" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kategori</h1>
          <Button asChild>
            <Link href={route('admin.categories.create')}>
              <PlusCircle className="h-4 w-4 mr-2" /> Tambah Kategori
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Semua Kategori</CardTitle>
            <CardDescription>Kelola kategori untuk properti, fasilitas, dan lokasi</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={activeType} value={activeType} onValueChange={handleTypeChange}>
              <TabsList className="mb-4">
                {Object.entries(CATEGORY_TYPES).map(([value, label]) => (
                  <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeType}>
                <CategoriesTable categories={categories} activeType={activeType} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

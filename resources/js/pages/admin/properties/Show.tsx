import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Edit, MapPin, User, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  icon?: string;
}

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Property {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  price: string;
  deposit_amount: string | null;
  capacity: string;
  is_available: number;
  status: string;
  is_featured: number;
  has_reported_content: number;
  rejection_reason: string | null;
  category_id: number | null;
  user_id: number | null;
  last_modified_by: number | null;
  created_at: string;
  updated_at: string;
  slug: string;
  owner?: User;
  category?: Category;
  facilities?: Facility[];
  modifiedBy?: User;
}

interface PropertyShowProps {
  property: Property;
}

export default function PropertyShow({ property }: PropertyShowProps) {
  // Helper function untuk menampilkan status property dalam bentuk badge
  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Disetujui</Badge>;
    } else if (status === 'rejected') {
      return <Badge variant="destructive"><XCircle className="h-3.5 w-3.5 mr-1" /> Ditolak</Badge>;
    } else if (status === 'needs_moderation') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Perlu Moderasi</Badge>;
    } else {
      return <Badge variant="secondary"><Calendar className="h-3.5 w-3.5 mr-1" /> Menunggu</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title={`Detail Properti: ${property.name}`} />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={route('admin.properties.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {property.address}, {property.city}
                {property.state && `, ${property.state}`}
                {property.zip_code && ` ${property.zip_code}`}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri - Info Utama */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Detail Properti</CardTitle>
                  <CardDescription>Informasi lengkap tentang properti</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(property.status)}
                  {property.is_featured === 1 && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      Unggulan
                    </Badge>
                  )}
                  {property.has_reported_content === 1 && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Konten Dilaporkan
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deskripsi */}
                <div className="space-y-2">
                  <h3 className="font-medium">Deskripsi</h3>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>

                <Separator />

                {/* Tanggal & Pemilik */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Tanggal Dibuat</h3>
                    <p className="text-gray-700">{new Date(property.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Terakhir Diperbarui</h3>
                    <p className="text-gray-700">{new Date(property.updated_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {property.owner && (
                  <div>
                    <h3 className="font-medium">Pemilik</h3>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4" />
                      <span>{property.owner.name} ({property.owner.email})</span>
                    </div>
                  </div>
                )}

                {property.modifiedBy && (
                  <div>
                    <h3 className="font-medium">Terakhir Dimodifikasi Oleh</h3>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4" />
                      <span>{property.modifiedBy.name}</span>
                    </div>
                  </div>
                )}

                {property.status === 'rejected' && property.rejection_reason && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <h3 className="font-medium text-red-800">Alasan Penolakan</h3>
                    <p className="text-red-700">{property.rejection_reason}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={route('admin.properties.edit', property.id)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Properti
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Fasilitas */}
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas</CardTitle>
                <CardDescription>Fasilitas yang tersedia di properti ini</CardDescription>
              </CardHeader>
              <CardContent>
                {property.facilities && property.facilities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.facilities.map((facility) => (
                      <div key={facility.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{facility.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Tidak ada fasilitas yang tercatat</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan - Info Tambahan */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Harga</CardTitle>
                <CardDescription>Detail biaya sewa properti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Harga Sewa</h3>
                  <p className="text-xl font-bold">Rp {Number(property.price).toLocaleString('id-ID')}</p>
                </div>
                {property.deposit_amount && (
                  <div>
                    <h3 className="font-medium">Deposit</h3>
                    <p className="text-gray-700">Rp {Number(property.deposit_amount).toLocaleString('id-ID')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Properti</CardTitle>
                <CardDescription>Detail spesifikasi properti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Status Ketersediaan</h3>
                  <Badge variant={property.is_available === 1 ? "default" : "secondary"}>
                    {property.is_available === 1 ? "Tersedia" : "Tidak Tersedia"}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium">Kapasitas</h3>
                  <p className="text-gray-700">{property.capacity} orang</p>
                </div>
                {property.category && (
                  <div>
                    <h3 className="font-medium">Kategori</h3>
                    <p className="text-gray-700">{property.category.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tindakan</CardTitle>
                <CardDescription>Opsi pengelolaan properti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {property.status === 'pending' && (
                  <Button className="w-full justify-start" asChild>
                    <Link 
                      href={route('admin.properties.approve', property.id)} 
                      method="put" 
                      as="button"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Setujui Properti
                    </Link>
                  </Button>
                )}
                
                {property.status === 'pending' && (
                  <Button variant="destructive" className="w-full justify-start" asChild>
                    <Link 
                      href={route('admin.properties.reject-form', property.id)} 
                      as="button"
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Tolak Properti
                    </Link>
                  </Button>
                )}
                
                {property.has_reported_content === 1 && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link 
                      href={route('admin.properties.moderate', property.id)} 
                      method="put" 
                      as="button"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Tandai Sudah Dimoderasi
                    </Link>
                  </Button>
                )}
                
                <Button variant={property.is_featured === 1 ? "outline" : "secondary"} className="w-full justify-start" asChild>
                  <Link 
                    href={route('admin.properties.toggle-featured', property.id)} 
                    method="put" 
                    as="button"
                  >
                    <Star className="h-4 w-4 mr-2" /> 
                    {property.is_featured === 1 ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

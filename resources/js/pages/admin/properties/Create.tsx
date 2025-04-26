import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Category {
  id: number;
  name: string;
}

interface CreatePropertyProps {
  categories?: Category[];
}

export default function CreateProperty({ categories = [] }: CreatePropertyProps) {
  // Inisialisasi form dengan nilai default yang sesuai dengan tipe data di database
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '0', // String karena input field adalah string
    deposit_amount: '0', // String karena input field adalah string
    category_id: '', // String untuk select
    address: '',
    city: '',
    state: '',
    zip_code: '',
    capacity: '1', // String karena input field adalah string
    is_available: 1, // 1 untuk true, 0 untuk false (untuk kompatibilitas dengan backend)
    status: 'pending',
    user_id: '', // Untuk mengakomodasi relasi ke pemilik
  });

  // Handler untuk input perubahan
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setData(id as keyof typeof data, value);
  };

  // State terpisah untuk UI checkbox
  const [isAvailable, setIsAvailable] = useState(true);

  // Fungsi untuk menangani perubahan checkbox
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAvailable(checked);
    // Set is_available sebagai 1 atau 0 untuk kompatibilitas dengan backend
    setData('is_available', checked ? 1 : 0);
  };

  // Handler untuk form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salin data untuk modifikasi sebelum pengiriman
    const formData: Record<string, any> = {};
    
    // Copy semua field dari form data
    Object.keys(data).forEach(key => {
      formData[key] = data[key as keyof typeof data];
    });
    
    // Konversi field kosong ke null untuk backend
    if (formData.category_id === '') formData.category_id = null;
    if (formData.deposit_amount === '0' || formData.deposit_amount === '') formData.deposit_amount = null;
    if (formData.state === '') formData.state = null;
    if (formData.zip_code === '') formData.zip_code = null;
    if (formData.user_id === '') formData.user_id = null;

    post(route('admin.properties.store'), formData);
  };

  return (
    <AppLayout>
      <Head title="Tambah Properti Baru" />
      
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href={route('admin.properties.index')}>
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tambah Properti Baru</h1>
              <p className="text-muted-foreground">Tambahkan properti baru ke platform</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kolom Kiri - Informasi Umum */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Umum</CardTitle>
                  <CardDescription>Detail dasar properti</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Properti <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama properti"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_id">Kategori</Label>
                    <Select 
                      value={data.category_id} 
                      onValueChange={(value) => setData('category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Tidak Ada</SelectItem>
                        {Array.isArray(categories) && categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={handleChange}
                      placeholder="Masukkan deskripsi properti"
                      rows={5}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga (Rp) <span className="text-red-500">*</span></Label>
                      <Input
                        id="price"
                        type="number"
                        value={data.price}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="10000"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deposit_amount">Deposit (Rp)</Label>
                      <Input
                        id="deposit_amount"
                        type="number"
                        value={data.deposit_amount}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="10000"
                      />
                      {errors.deposit_amount && <p className="text-red-500 text-sm">{errors.deposit_amount}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas (Orang)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={data.capacity}
                      onChange={handleChange}
                      placeholder="1"
                      min="1"
                    />
                    {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alamat</CardTitle>
                  <CardDescription>Lokasi fisik properti</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="address"
                      value={data.address}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap"
                      rows={2}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        value={data.city}
                        onChange={handleChange}
                        placeholder="Masukkan kota"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">Provinsi</Label>
                      <Input
                        id="state"
                        value={data.state}
                        onChange={handleChange}
                        placeholder="Masukkan provinsi"
                      />
                      {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Kode Pos</Label>
                    <Input
                      id="zip_code"
                      value={data.zip_code}
                      onChange={handleChange}
                      placeholder="Masukkan kode pos"
                    />
                    {errors.zip_code && <p className="text-red-500 text-sm">{errors.zip_code}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Kolom Kanan - Status & Ketersediaan */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status & Publikasi</CardTitle>
                  <CardDescription>Pengaturan visibilitas properti</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status Publikasi <span className="text-red-500">*</span></Label>
                    <Select 
                      value={data.status} 
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                        <SelectItem value="approved">Disetujui</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_available"
                      className="size-4 rounded-[4px] border shadow-xs"
                      checked={isAvailable}
                      onChange={handleAvailabilityChange}
                    />
                    <Label htmlFor="is_available" className="cursor-pointer">
                      Tersedia untuk dibooking
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tindakan</CardTitle>
                    <CardDescription>Simpan atau batalkan perubahan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" type="submit" disabled={processing}>
                      <Save className="w-4 h-4 mr-2" /> Simpan Properti
                    </Button>
                    <Button variant="outline" type="button" className="w-full" asChild>
                      <a href={route('admin.properties.index')}>Batal</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

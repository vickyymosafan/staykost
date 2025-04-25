import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-select';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { ChangeEvent } from 'react';

type UserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  verification_status: string;
  verification_notes: string;
  id_card: File | null;
  permissions: string[];
  [key: string]: any; // Add index signature for string keys
};

export default function UserCreate() {
  const { data, setData, post, processing, errors, reset } = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    verification_status: 'unverified',
    verification_notes: '',
    id_card: null,
    permissions: [],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('admin.users.store'), {
      onSuccess: () => reset(),
    });
  }

  return (
    <AppLayout>
      <Head title="Tambah Pengguna Baru" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href={route('admin.users.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Daftar Pengguna
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Pengguna Baru</h1>
        </div>

        <div className="max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                  required
                  className="mt-1 block w-full"
                  error={errors.name}
                />
                {errors.name && <div className="text-red-500 mt-1 text-sm">{errors.name}</div>}
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                  required
                  className="mt-1 block w-full"
                  error={errors.email}
                />
                {errors.email && <div className="text-red-500 mt-1 text-sm">{errors.email}</div>}
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kata Sandi
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                  required
                  className="mt-1 block w-full"
                  error={errors.password}
                />
                {errors.password && <div className="text-red-500 mt-1 text-sm">{errors.password}</div>}
              </div>

              <div>
                <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Konfirmasi Kata Sandi
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peran
                </Label>
                <Select
                  id="role"
                  value={data.role}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setData('role', e.target.value)}
                  required
                  className="mt-1 block w-full"
                  error={errors.role}
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Pemilik</option>
                  <option value="user">Pengguna</option>
                </Select>
                {errors.role && <div className="text-red-500 mt-1 text-sm">{errors.role}</div>}
              </div>

              <div>
                <Label htmlFor="verification_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Verifikasi
                </Label>
                <Select
                  id="verification_status"
                  value={data.verification_status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setData('verification_status', e.target.value)}
                  className="mt-1 block w-full"
                  error={errors.verification_status}
                >
                  <option value="unverified">Belum Diverifikasi</option>
                  <option value="pending">Menunggu</option>
                  <option value="verified">Terverifikasi</option>
                </Select>
                {errors.verification_status && <div className="text-red-500 mt-1 text-sm">{errors.verification_status}</div>}
              </div>

              <div>
                <Label htmlFor="id_card" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kartu Identitas (KTP/Passport)
                </Label>
                <Input
                  id="id_card"
                  type="file"
                  className="mt-1 block w-full"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    setData('id_card', file);
                  }}
                  error={errors.id_card}
                  accept="image/jpeg,image/png,application/pdf"
                />
                <p className="text-xs text-gray-500 mt-1">Unggah gambar (JPG, PNG) atau dokumen PDF</p>
                {errors.id_card && <div className="text-red-500 mt-1 text-sm">{errors.id_card}</div>}
              </div>

              <div>
                <Label htmlFor="verification_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan Verifikasi
                </Label>
                <Textarea
                  id="verification_notes"
                  value={data.verification_notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('verification_notes', e.target.value)}
                  className="mt-1 block w-full"
                  rows={3}
                  error={errors.verification_notes}
                />
                {errors.verification_notes && <div className="text-red-500 mt-1 text-sm">{errors.verification_notes}</div>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Link href={route('admin.users.index')}>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                Tambah Pengguna
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

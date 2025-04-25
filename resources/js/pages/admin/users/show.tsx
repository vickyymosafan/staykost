import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Mail, Phone, UserIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '@/components/ui/form-select';
import { ChangeEvent } from 'react';

type UserRole = 'admin' | 'owner' | 'user';
type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  verification_status: VerificationStatus;
  verification_notes: string | null;
  id_card_path: string | null;
  permissions: any | null;
  created_at: string;
}

interface Props {
  user: User;
  idCardUrl: string | null;
}

interface VerificationFormData {
  verification_status: string;
  verification_notes: string;
  [key: string]: any; // Add index signature for string keys
}

export default function UserShow({ user, idCardUrl }: Props) {
  const { data, setData, errors, processing, put } = useForm<VerificationFormData>({
    verification_status: user.verification_status,
    verification_notes: user.verification_notes || '',
  });

  function submitVerification(e: React.FormEvent) {
    e.preventDefault();
    put(route('admin.users.update-verification', user.id));
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
    unverified: 'text-gray-700 bg-gray-100',
    pending: 'text-yellow-700 bg-yellow-100',
    verified: 'text-green-700 bg-green-100',
  };

  return (
    <AppLayout>
      <Head title={`Detail Pengguna: ${user.name}`} />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href={route('admin.users.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Daftar Pengguna
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Detail Pengguna: {user.name}</h1>
        </div>

        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <UserIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-1" /> {user.email}
                </div>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full mb-4 ${verificationColors[user.verification_status] || ''}`}
                >
                  {verificationLabels[user.verification_status] || user.verification_status}
                </span>
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Akun Dibuat</p>
                    <p className="text-sm text-gray-900 dark:text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()} pada {new Date(user.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Link href={route('admin.users.edit', user.id)}>
                      <Button>
                        Edit Pengguna
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Verification Document Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Verifikasi Identitas</h3>
              </div>
              <div className="p-6">
                {idCardUrl ? (
                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dokumen Kartu Identitas
                    </Label>
                    <div className="border rounded-lg p-4">
                      {idCardUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dokumen PDF</p>
                          <a 
                            href={idCardUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Button>
                              Lihat Dokumen PDF
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <div>
                          <img 
                            src={idCardUrl} 
                            alt="Kartu Identitas" 
                            className="max-w-full h-auto mx-auto rounded-lg border"
                            style={{ maxHeight: '400px' }} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-center py-8 px-4 border rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada dokumen identitas yang diunggah</p>
                  </div>
                )}

                <form onSubmit={submitVerification} className="space-y-4">
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
                    <Label htmlFor="verification_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Catatan Verifikasi
                    </Label>
                    <Textarea
                      id="verification_notes"
                      value={data.verification_notes}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('verification_notes', e.target.value)}
                      className="mt-1 block w-full"
                      rows={4}
                      placeholder="Tambahkan catatan tentang proses verifikasi atau persyaratan"
                      error={errors.verification_notes}
                    />
                    {errors.verification_notes && <div className="text-red-500 mt-1 text-sm">{errors.verification_notes}</div>}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                      <Check className="h-4 w-4 mr-2" /> Perbarui Verifikasi
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

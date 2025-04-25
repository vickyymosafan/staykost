import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-select';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
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
}

interface Props {
  user: User;
}

type UserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  verification_status: string;
  verification_notes: string;
  id_card: File | null;
  permissions: any[];
  _method: string;
  [key: string]: any; // Add index signature for string keys
};

export default function UserEdit({ user }: Props) {
  const { data, setData, errors, put, processing } = useForm<UserFormData>({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    role: user.role || 'user',
    verification_status: user.verification_status || 'unverified',
    verification_notes: user.verification_notes || '',
    id_card: null,
    permissions: user.permissions || [],
    _method: 'PUT',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('admin.users.update', user.id));
  }

  return (
    <AppLayout>
      <Head title={`Edit User: ${user.name}`} />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href={route('admin.users.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit User: {user.name}</h1>
        </div>

        <div className="max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <form onSubmit={submit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
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
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                  className="mt-1 block w-full"
                  error={errors.password}
                  placeholder="Leave blank to keep current password"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current password</p>
                {errors.password && <div className="text-red-500 mt-1 text-sm">{errors.password}</div>}
              </div>

              <div>
                <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
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
                  <option value="owner">Owner</option>
                  <option value="user">User</option>
                </Select>
                {errors.role && <div className="text-red-500 mt-1 text-sm">{errors.role}</div>}
              </div>

              <div>
                <Label htmlFor="verification_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Status
                </Label>
                <Select
                  id="verification_status"
                  value={data.verification_status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setData('verification_status', e.target.value)}
                  className="mt-1 block w-full"
                  error={errors.verification_status}
                >
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                </Select>
                {errors.verification_status && <div className="text-red-500 mt-1 text-sm">{errors.verification_status}</div>}
              </div>

              <div>
                <Label htmlFor="id_card" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID Card (KTP/Passport)
                </Label>
                {user.id_card_path && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current document: <a href={`/storage/${user.id_card_path}`} target="_blank" className="text-blue-600 hover:underline">View Document</a>
                    </p>
                  </div>
                )}
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
                <p className="text-xs text-gray-500 mt-1">Upload image (JPG, PNG) or PDF document</p>
                {errors.id_card && <div className="text-red-500 mt-1 text-sm">{errors.id_card}</div>}
              </div>

              <div>
                <Label htmlFor="verification_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Notes
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
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={processing}>
                Update User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

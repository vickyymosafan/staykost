import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export default function KycShow({ user, idCardUrl }) {
    const [notes, setNotes] = useState(user.verification_notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApprove = () => {
        setIsSubmitting(true);
        router.put(
            route('admin.kyc.approve', user.id),
            { verification_notes: notes },
            {
                onSuccess: () => {
                    toast.success('Verifikasi dokumen berhasil disetujui');
                    setIsSubmitting(false);
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat memproses permintaan');
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleReject = () => {
        if (!notes.trim()) {
            toast.error('Harap berikan alasan penolakan');
            return;
        }

        setIsSubmitting(true);
        router.put(
            route('admin.kyc.reject', user.id),
            { verification_notes: notes },
            {
                onSuccess: () => {
                    toast.success('Verifikasi dokumen ditolak');
                    setIsSubmitting(false);
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat memproses permintaan');
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Detail Verifikasi KYC" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.visit(route('admin.kyc.index'))}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Verifikasi KYC</h1>
                        <p className="text-muted-foreground">Verifikasi dokumen identitas pengguna</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pengguna</CardTitle>
                            <CardDescription>Detail pengguna yang meminta verifikasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Nama</h3>
                                <p>{user.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p>{user.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Peran</h3>
                                <Badge variant={user.role === 'admin' ? 'default' : user.role === 'owner' ? 'outline' : 'secondary'}>
                                    {user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Pemilik' : 'Pengguna'}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Status Verifikasi</h3>
                                <Badge
                                    variant={
                                        user.verification_status === 'verified'
                                            ? 'success'
                                            : user.verification_status === 'pending'
                                            ? 'warning'
                                            : 'destructive'
                                    }
                                >
                                    {user.verification_status === 'verified'
                                        ? 'Terverifikasi'
                                        : user.verification_status === 'pending'
                                        ? 'Menunggu'
                                        : 'Belum Verifikasi'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen Identitas</CardTitle>
                            <CardDescription>Foto KTP/Passport yang diunggah pengguna</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {idCardUrl ? (
                                <div className="overflow-hidden rounded-md border">
                                    <img src={idCardUrl} alt="Dokumen Identitas" className="w-full object-cover" />
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                                    <p className="text-muted-foreground">Tidak ada dokumen identitas yang diunggah</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Catatan Verifikasi</CardTitle>
                            <CardDescription>
                                Tambahkan catatan untuk persetujuan atau penolakan verifikasi dokumen
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tambahkan catatan verifikasi di sini..."
                                className="min-h-[100px]"
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="gap-1"
                            >
                                <X className="h-4 w-4" /> Tolak Verifikasi
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="gap-1"
                            >
                                <Check className="h-4 w-4" /> Setujui Verifikasi
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

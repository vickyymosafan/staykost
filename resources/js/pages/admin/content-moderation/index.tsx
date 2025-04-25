import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Flag, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ContentFlag {
  id: number;
  flaggable_id: number;
  flaggable_type: string;
  reason: string;
  details: string | null;
  status: 'pending' | 'reviewed' | 'rejected' | 'actioned';
  reported_by: User | null;
  reviewed_by: User | null;
  reviewed_at: string | null;
  created_at: string;
  flaggable: any; // This could be a property, review, etc.
}

interface ContentFlagsIndexProps {
  contentFlags: {
    data: ContentFlag[];
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
  status: string;
}

export default function ContentFlagsIndex({ contentFlags, status }: ContentFlagsIndexProps) {
  // Function to render the flaggable item name
  const getFlaggableName = (flag: ContentFlag) => {
    if (!flag.flaggable) return 'Konten tidak ditemukan';
    
    // Determine name based on flaggable type
    if (flag.flaggable_type.includes('Property')) {
      return flag.flaggable.name || 'Properti';
    }
    return 'Konten';
  };

  // Function to format the flaggable type for display
  const formatFlaggableType = (type: string) => {
    if (type.includes('Property')) return 'Properti';
    if (type.includes('Review')) return 'Ulasan';
    return type.split('\\').pop() || type;
  };

  // Function to render the status badge
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="h-3 w-3" /> Menunggu Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"><Eye className="h-3 w-3" /> Ditinjau</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3" /> Ditolak</Badge>;
      case 'actioned':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" /> Ditindaklanjuti</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (value: string) => {
    router.get(route('admin.content-moderation.index', { status: value }));
  };

  return (
    <AppLayout>
      <Head title="Moderasi Konten" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Moderasi Konten</h1>
            <p className="text-muted-foreground">Kelola laporan dan konten yang ditandai</p>
          </div>
          <Button asChild>
            <Link href={route('admin.content-moderation.keywords')}>
              <Flag className="h-4 w-4 mr-2" />
              Kelola Kata Terlarang
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Konten Yang Ditandai</CardTitle>
                <CardDescription>Laporan konten yang bermasalah</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu Review</SelectItem>
                    <SelectItem value="reviewed">Sudah Ditinjau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Konten</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Pelapor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentFlags.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Flag className="h-10 w-10 mb-2 text-muted-foreground/50" />
                        <p>Tidak ada konten yang ditandai</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contentFlags.data.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="font-medium">{getFlaggableName(flag)}</TableCell>
                      <TableCell>{formatFlaggableType(flag.flaggable_type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{flag.reason}</TableCell>
                      <TableCell>{flag.reported_by?.name || 'Sistem'}</TableCell>
                      <TableCell className="whitespace-nowrap">{new Date(flag.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{renderStatus(flag.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={route('admin.content-moderation.show', flag.id)}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Pagination
                current_page={contentFlags.meta.current_page}
                last_page={contentFlags.meta.last_page}
                from={contentFlags.meta.from}
                to={contentFlags.meta.to}
                total={contentFlags.meta.total}
                path={contentFlags.meta.path}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

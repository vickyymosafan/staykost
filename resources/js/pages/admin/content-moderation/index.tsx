import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Flag, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

// Types
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
  reporter: User | null; 
  reviewer: User | null; 
  reviewed_at: string | null;
  created_at: string;
  flaggable: any; 
}

interface ContentFlagsIndexProps {
  contentFlags?: {
    data: ContentFlag[];
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
  filters?: {
    status: string;
  };
}

// Helper Components
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
          <AlertCircle className="h-3 w-3" /> Menunggu Review
        </Badge>
      );
    case 'reviewed':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
          <Eye className="h-3 w-3" /> Ditinjau
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3" /> Ditolak
        </Badge>
      );
    case 'actioned':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3" /> Ditindaklanjuti
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const EmptyState = ({ status }: { status: string }) => (
  <TableRow>
    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
      <div className="flex flex-col items-center justify-center">
        <Flag className="h-10 w-10 mb-2 text-muted-foreground/50" />
        <p>Tidak ada konten yang ditandai dengan status {status === 'pending' ? 'menunggu review' : 'sudah ditinjau'}</p>
      </div>
    </TableCell>
  </TableRow>
);

const FlagTableRow = ({ flag, getFlaggableName, formatFlaggableType }: { 
  flag: ContentFlag, 
  getFlaggableName: (flag: ContentFlag) => string,
  formatFlaggableType: (type: string) => string
}) => (
  <TableRow key={flag.id}>
    <TableCell className="font-medium">{getFlaggableName(flag)}</TableCell>
    <TableCell>{formatFlaggableType(flag.flaggable_type)}</TableCell>
    <TableCell className="max-w-[200px] truncate">{flag.reason}</TableCell>
    <TableCell>{flag.reporter?.name || 'Sistem'}</TableCell>
    <TableCell className="whitespace-nowrap">{new Date(flag.created_at).toLocaleDateString('id-ID')}</TableCell>
    <TableCell><StatusBadge status={flag.status} /></TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="icon" asChild>
        <Link href={route('admin.content-moderation.show', flag.id)}>
          <span className="sr-only">Lihat</span>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </TableCell>
  </TableRow>
);

const StatusFilter = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
  <div className="w-full sm:w-72">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Menunggu Review</SelectItem>
        <SelectItem value="reviewed">Sudah Ditinjau</SelectItem>
        <SelectItem value="rejected">Ditolak</SelectItem>
        <SelectItem value="actioned">Ditindaklanjuti</SelectItem>
        <SelectItem value="all">Semua Status</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// Main Component
export default function ContentFlagsIndex({ contentFlags, filters }: ContentFlagsIndexProps) {
  const [activeStatus, setActiveStatus] = useState(filters?.status || 'pending');
  
  useEffect(() => {
    if (filters?.status && filters.status !== activeStatus) {
      setActiveStatus(filters.status);
    }
  }, [filters]);
  
  const getFlaggableName = (flag: ContentFlag) => {
    if (!flag.flaggable) return 'Konten tidak ditemukan';
    
    if (flag.flaggable_type.includes('Property')) {
      return flag.flaggable.name || 'Properti';
    }
    return 'Konten';
  };

  const formatFlaggableType = (type: string) => {
    if (type.includes('Property')) return 'Properti';
    if (type.includes('Review')) return 'Ulasan';
    return type.split('\\').pop() || type;
  };

  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
    router.get(route('admin.content-moderation.index'), { status: value }, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout>
      <Head title="Moderasi Konten" />
      
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Moderasi Konten</h1>
              <p className="text-muted-foreground">Kelola laporan dan konten yang ditandai</p>
            </div>
            <Button asChild>
              <Link href={route('admin.content-moderation.keywords')}>
                <Flag className="h-4 w-4 mr-2" />
                Kelola Kata Terlarang
              </Link>
            </Button>
          </div>

          <Card className="shadow-md">
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Konten Yang Ditandai</CardTitle>
                  <CardDescription>Laporan konten yang bermasalah</CardDescription>
                </div>
                <StatusFilter value={activeStatus} onChange={handleStatusChange} />
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
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
                    {contentFlags && contentFlags.data && contentFlags.data.length > 0 ? (
                      contentFlags.data.map((flag) => (
                        <FlagTableRow 
                          key={flag.id}
                          flag={flag} 
                          getFlaggableName={getFlaggableName}
                          formatFlaggableType={formatFlaggableType}
                        />
                      ))
                    ) : (
                      <EmptyState status={activeStatus} />
                    )}
                  </TableBody>
                </Table>
              </div>

              {contentFlags && contentFlags.meta && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current_page={contentFlags.meta.current_page}
                    last_page={contentFlags.meta.last_page}
                    from={contentFlags.meta.from}
                    to={contentFlags.meta.to}
                    total={contentFlags.meta.total}
                    path={contentFlags.meta.path}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

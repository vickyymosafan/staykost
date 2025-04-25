import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { AlertTriangle, PlusCircle, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ForbiddenKeyword {
  id: number;
  keyword: string;
  replacement: string | null;
  severity: 'low' | 'medium' | 'high';
  is_active: boolean;
}

interface KeywordsIndexProps {
  keywords: {
    data: ForbiddenKeyword[];
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
}

export default function KeywordsIndex({ keywords }: KeywordsIndexProps) {
  // Function to render severity badge
  const renderSeverity = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Rendah</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Sedang</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Tinggi</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <AppLayout>
      <Head title="Kelola Kata Terlarang" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kelola Kata Terlarang</h1>
            <p className="text-muted-foreground">Atur kata-kata yang tidak diperbolehkan dalam konten</p>
          </div>
          <Button asChild>
            <Link href={route('admin.content-moderation.keywords.create')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Kata Terlarang
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Daftar Kata Terlarang</CardTitle>
                <CardDescription>Kata-kata yang akan otomatis ditandai atau diganti</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Tinggi</Badge>
                  <span className="text-xs text-muted-foreground">= Otomatis ditolak</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Perhatian</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Kata dengan tingkat keparahan <strong>tinggi</strong> akan otomatis menolak konten yang mengandungnya. 
                  Kata dengan tingkat <strong>sedang</strong> akan ditandai untuk ditinjau. 
                  Kata dengan tingkat <strong>rendah</strong> akan otomatis diganti dengan kata penggantinya.
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kata</TableHead>
                  <TableHead>Pengganti</TableHead>
                  <TableHead>Tingkat Keparahan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <AlertTriangle className="h-10 w-10 mb-2 text-muted-foreground/50" />
                        <p>Tidak ada kata terlarang ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  keywords.data.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>{keyword.replacement || '-'}</TableCell>
                      <TableCell>{renderSeverity(keyword.severity)}</TableCell>
                      <TableCell>
                        {keyword.is_active ? (
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
                            <Link href={route('admin.content-moderation.keywords.edit', keyword.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" asChild>
                            <Link 
                              href={route('admin.content-moderation.keywords.destroy', keyword.id)} 
                              method="delete" 
                              as="button"
                              data={{ _confirm: 'Apakah Anda yakin ingin menghapus kata terlarang ini?' }}
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
                current_page={keywords.meta.current_page}
                last_page={keywords.meta.last_page}
                from={keywords.meta.from}
                to={keywords.meta.to}
                total={keywords.meta.total}
                path={keywords.meta.path}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

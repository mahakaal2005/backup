'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type Report = {
  report_id: string;
  blob_url: string;
  session_id: string;
  created_at?: string;
};

function DownloadButton({ reportId, sessionId }: { reportId: string; sessionId: string }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/reports/download/${reportId}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `navix_report_${reportId.slice(0, 8)}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Button size="sm" onClick={handleDownload} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Download Report
    </Button>
  );
}

export const columns: ColumnDef<Report>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'report_id',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Report ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className="bg-blue-200 text-blue-700 font-mono text-xs">
        {row.original.report_id.slice(0, 8)}
      </Badge>
    ),
  },
  {
    accessorKey: 'session_id',
    header: 'Session',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {row.original.session_id.slice(0, 12)}...
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleString() : '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <DownloadButton reportId={row.original.report_id} sessionId={row.original.session_id} />
    ),
  },
];

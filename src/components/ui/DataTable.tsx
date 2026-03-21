import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Printer
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './Table';
import { Input } from './Input';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
  title?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  pageSize = 10,
  onRowClick,
  actions,
  title
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filtering & Sorting combined
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (globalFilter) {
      result = result.filter(item => 
        Object.values(item as any).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a: any, b: any) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, globalFilter, sortKey, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4 w-full">
      {/* Table Controls (Search & Refresh) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-4 flex-1">
          {title && <h2 className="text-xl font-bold text-text-primary whitespace-nowrap">{title}</h2>}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -trangray-y-1/2 h-4 w-4 text-text-disabled" />
            <Input 
              placeholder="Search data..." 
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-10 border-border bg-background focus:ring-gold-500/10 focus:border-gold-500 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          <Button variant="outline" size="sm" className="h-10 px-3 border-border hover:bg-background">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader className="bg-background/50">
              <TableRow className="hover:bg-transparent border-b border-border">
                {columns.map((col) => (
                  <TableHead 
                    key={col.key as string}
                    style={{ width: col.width }}
                    className={cn(
                      "group py-4 px-4 font-bold text-[11px] uppercase tracking-wider text-text-secondary select-none",
                      col.sortable && "cursor-pointer hover:text-gold-600 transition-colors"
                    )}
                    onClick={() => col.sortable && handleSort(col.key as string)}
                  >
                    <div className={cn(
                      "flex items-center gap-1.5",
                      col.align === 'center' ? "justify-center" : col.align === 'right' ? "justify-end" : "justify-start"
                    )}>
                      {col.header}
                      {col.sortable && (
                        <div className="inline-flex items-center transition-opacity opacity-30 group-hover:opacity-100">
                          {sortKey === col.key ? (
                            sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-gold-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gold-600" />
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow 
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "group h-10 border-b border-border last:border-0 hover:bg-gold-50 transition-colors cursor-default",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <TableCell 
                      key={col.key as string}
                      className={cn(
                        "px-4 py-3 text-sm text-text-primary",
                        col.align === 'center' && "text-center",
                        col.align === 'right' && "text-right"
                      )}
                    >
                      {col.render 
                        ? col.render((item as any)[col.key], item) 
                        : String((item as any)[col.key] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center bg-background/20">
                    <div className="flex flex-col items-center justify-center text-text-disabled">
                      <Search className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm font-medium">No results found for "{globalFilter}"</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Improved Pagination Footer */}
        <div className="px-6 py-4 border-t border-border bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
              Showing {Math.min(processedData.length, (currentPage - 1) * pageSize + 1)} - {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border hover:bg-white disabled:opacity-30 transition-all font-bold"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                // Simple logic to center the current page when total pages > 5
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                      currentPage === pageNum 
                        ? "bg-gold-500 text-white shadow-lg shadow-gold-500/30" 
                        : "text-text-secondary hover:bg-gold-50 hover:text-gold-600"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border hover:bg-white disabled:opacity-30 transition-all font-bold"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

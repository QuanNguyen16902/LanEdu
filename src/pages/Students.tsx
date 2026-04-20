import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockStudents } from '@/services/mockData';
import { Search, UserPlus, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

interface StudentType {
  id: string;
  name: string;
  email: string;
  class: string;
  attendance: number;
  score: number;
}

export default function StudentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const columns: Column<StudentType>[] = [
    {
      key: 'name',
      header: 'Họ và tên',
      sortable: true,
      render: (value, student) => (
        <div className="flex items-center gap-3">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} 
            alt={student.name} 
            className="w-8 h-8 rounded-full border border-border shadow-sm"
          />
          <div>
            <p className="text-sm font-semibold text-text-primary leading-tight">{student.name}</p>
            <p className="text-[11px] text-text-secondary">{student.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'class',
      header: 'Lớp',
      sortable: true,
      render: (value) => (
        <Badge variant="info" className="text-[10px] font-semibold px-2 py-0.5 rounded-full border-gold-200 text-gold-700 bg-gold-50">
          {value}
        </Badge>
      )
    },
    {
      key: 'attendance',
      header: 'Tỷ lệ chuyên cần',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-1.5 bg-background rounded-full overflow-hidden border border-border">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                value >= 90 ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.3)]" : 
                value >= 80 ? "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-error shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              )}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-text-primary">{value}%</span>
        </div>
      )
    },
    {
      key: 'score',
      header: 'Điểm số',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span className={cn(
          "text-sm font-semibold px-2 py-1 rounded bg-background border border-border",
          value >= 8 ? "text-success border-success/20 bg-success/5" : 
          value >= 5 ? "text-warning border-warning/20 bg-warning/5" : "text-error border-error/20 bg-error/5"
        )}>
          {value.toFixed(1)}
        </span>
      )
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (_, student) => isAdmin && (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-gold-600 hover:bg-gold-50">
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 w-full mx-auto bg-[#F8FAFC] min-h-full">
      <DataTable 
        title="Danh sách học sinh"
        columns={columns} 
        data={mockStudents as StudentType[]} 
        pageSize={10}
        actions={
          isAdmin && (
            <Button size="sm" className="h-10 px-4 bg-gold-500 hover:bg-gold-600 text-white shadow-lg shadow-gold-500/20 font-semibold gap-2 border-none">
              <UserPlus className="w-4 h-4" />
              Thêm học sinh
            </Button>
          )
        }
      />
    </div>
  );
}

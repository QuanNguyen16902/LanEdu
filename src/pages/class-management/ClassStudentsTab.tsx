import React from 'react';
import { Search, Folder, Edit2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Student } from '@/services/mockData';

interface ClassStudentsTabProps {
  selectedClass: string | null;
  filteredStudents: Student[];
  searchQuery: string;
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  onOpenDetails?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  schedule?: string;
}

export function ClassStudentsTab({
  selectedClass,
  filteredStudents,
  searchQuery,
  selectedRows,
  toggleRow,
  toggleAll,
  onOpenDetails,
  onEdit,
  schedule
}: ClassStudentsTabProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto bg-white">
        <Table className="border-collapse table-fixed min-w-[1000px] w-full">
          <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10">
            <TableRow className="h-10 hover:bg-transparent border-b border-gray-200">
              <TableHead className="w-8 px-2 border-r border-gray-200">
                <Checkbox
                  checked={selectedRows.size === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-10 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">TT</TableHead>
              <TableHead className="w-28 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Trạng thái</TableHead>
              <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Mã học sinh</TableHead>
              <TableHead className="w-44 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Họ tên</TableHead>
              <TableHead className="w-28 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Ngày sinh</TableHead>
              <TableHead className="w-24 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Giới tính</TableHead>
              <TableHead className="w-28 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Học phí</TableHead>
              <TableHead className="w-24 text-center text-[11px] font-medium text-gray-500 px-3">Thao tác</TableHead>
            </TableRow>
            <TableRow className="h-8 bg-white border-b border-gray-200">
              <TableCell className="border-r border-gray-200" />
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="border-r border-gray-200 px-2 text-center opacity-40"><Search className="w-3 h-3 mx-auto" /></TableCell>
              <TableCell className="px-2 text-center opacity-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedClass ? filteredStudents.map((student, idx) => (
              <TableRow
                key={student.id}
                className="h-9 hover:bg-gold-50/20 transition-colors border-b border-gray-200 group"
              >
                <TableCell className="px-2 border-r border-gray-200">
                  <Checkbox checked={selectedRows.has(student.id)} onCheckedChange={() => toggleRow(student.id)} />
                </TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                    student.status === 'Học viên chính thức' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                  )}>
                    {student.status === 'Học viên chính thức' ? 'CHÍNH THỨC' : 'TIỀM NĂNG'}
                  </span>
                </TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{student.id}</TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">
                  <button
                    onClick={() => onOpenDetails?.(student)}
                    className="hover:text-gold-600 hover:underline transition-all text-left"
                  >
                    {student.name}
                  </button>
                </TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{student.dob}</TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{student.gender}</TableCell>
                <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200 tabular-nums">
                  {(student.pricePerSession ?? 180000).toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell className="text-center px-2">
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-gold-50 hover:text-gold-600 rounded-md"
                      onClick={() => onEdit?.(student)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow className="h-[400px] hover:bg-transparent border-none">
                <TableCell colSpan={12} className="text-center py-20 border-none">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Folder className="w-12 h-12 text-gray-300" />
                    <p className="text-[13px] font-medium text-gray-500">Vui lòng chọn lớp nộp từ danh mục bên trái</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="h-9 border-t border-gray-100 px-4 flex items-center justify-between shrink-0 bg-gray-50/50">
        <span className="text-[11px] text-gray-400">
          Tổng số: <b className="text-gray-700">{filteredStudents.length}</b> học sinh
        </span>
      </div>
    </div>
  );
}

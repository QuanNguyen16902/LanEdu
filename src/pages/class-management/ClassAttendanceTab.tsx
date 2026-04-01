import React from 'react';
import { Calendar, CheckCircle, Search, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Student, AttendanceRecord } from '@/services/mockData';

interface ClassAttendanceTabProps {
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
  currentStats: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
  filteredStudents: Student[];
  records: AttendanceRecord[];
  handleStatusChange: (studentId: string, status: string) => void;
  markAllPresent: () => void;
  selectedClass: string | null;
  onOpenDetails?: (student: Student) => void;
}

export function ClassAttendanceTab({
  attendanceDate,
  setAttendanceDate,
  currentStats,
  filteredStudents,
  records,
  handleStatusChange,
  markAllPresent,
  selectedClass,
  onOpenDetails,
}: ClassAttendanceTabProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Attendance stats bar */}
      <div className="px-4 py-2 bg-gold-50/30 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-medium text-gray-600">Có mặt: <b className="text-emerald-700">{currentStats.present}</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-medium text-gray-600">Đi muộn: <b className="text-amber-700">{currentStats.late}</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[11px] font-medium text-gray-600">Vắng mặt: <b className="text-rose-700">{currentStats.absent}</b></span>
          </div>
          <div className="h-3 w-px bg-gray-200" />
          <span className="text-[11px] text-gray-400">
            Tỷ lệ chuyên cần:{' '}
            <b className="text-gray-900">
              {currentStats.total > 0 ? Math.round((currentStats.present / currentStats.total) * 100) : 0}%
            </b>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="date"
              value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              className="text-[11px] font-bold border-none focus:ring-0 p-0 h-auto outline-none bg-transparent text-gray-700"
            />
          </div>
          <Button
            size="sm"
            onClick={markAllPresent}
            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-4 rounded-md gap-2 border-none shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Có mặt tất cả
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table className="border-collapse table-fixed w-full">
          <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10">
            <TableRow className="h-10 hover:bg-transparent border-b border-gray-200">
              <TableHead className="w-8 border-r border-gray-200" />
              <TableHead className="w-10 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">TT</TableHead>
              <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Mã học sinh</TableHead>
              <TableHead className="w-44 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Họ tên</TableHead>
              <TableHead className="w-[280px] text-center text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Điểm danh</TableHead>
              <TableHead className="text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Ghi chú</TableHead>
              <TableHead className="w-24 text-center text-[11px] font-medium text-gray-500 px-3">Giờ</TableHead>
            </TableRow>
            <TableRow className="h-8 bg-white border-b border-gray-200">
              <TableCell className="border-r border-gray-200" />
              <TableCell className="border-r border-gray-200" />
              <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
              <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
              <TableCell className="border-r border-gray-200" />
              <TableCell className="border-r border-gray-200" />
              <TableCell />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, idx) => {
              const record = records.find(r => r.studentId === student.id && r.date === attendanceDate);
              return (
                <TableRow key={student.id} className="h-9 hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                  <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                  </TableCell>
                  <TableCell className="text-[11px] text-gray-500 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                  <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{student.id}</TableCell>
                  <TableCell className="text-[11px] font-semibold text-gray-900 px-3 border-r border-gray-200">
                    <button
                      onClick={() => onOpenDetails?.(student)}
                      className="hover:text-gold-600 hover:underline transition-all text-left"
                    >
                      {student.name}
                    </button>
                  </TableCell>
                  <TableCell className="px-2 border-r border-gray-200">
                    <div className="flex items-center justify-center gap-1">
                      {(['PRESENT', 'LATE', 'ABSENT'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(student.id, s)}
                          className={cn(
                            'flex-1 py-1 px-1 text-[9px] font-bold rounded transition-all border',
                            record?.status === s
                              ? s === 'PRESENT' ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                : s === 'LATE' ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                                  : 'bg-rose-500 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                          )}
                        >
                          {s === 'PRESENT' ? 'CÓ MẶT' : s === 'LATE' ? 'MUỘN' : 'VẮNG'}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 border-r border-gray-200">
                    <input
                      placeholder="Lý do vắng / ghi chú..."
                      className="text-[11px] bg-transparent border-none outline-none w-full text-gray-500 placeholder:text-gray-200 italic"
                    />
                  </TableCell>
                  <TableCell className="text-center text-[10px] text-gray-400 tabular-nums">
                    {record ? '16:40:12' : '--:--:--'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

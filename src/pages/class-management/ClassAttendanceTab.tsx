import React, { useMemo } from 'react';
import { 
  Calendar, CheckCircle, Search, GripVertical, RefreshCw, 
  Printer, LayoutGrid, List, UserCheck, Clock, AlertCircle, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
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
  viewType: 'daily' | 'monthly';
  setViewType: (view: 'daily' | 'monthly') => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  currentStats: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
  filteredStudents: Student[];
  records: AttendanceRecord[];
  handleStatusChange: (studentId: string, status: string) => void;
  handleNoteChange: (studentId: string, note: string) => void;
  onMarkAllPresent: () => void;
  onOpenDetails?: (student: Student) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ClassAttendanceTab({
  attendanceDate,
  setAttendanceDate,
  viewType,
  setViewType,
  currentMonth,
  setCurrentMonth,
  currentStats,
  filteredStudents,
  records,
  handleStatusChange,
  handleNoteChange,
  onMarkAllPresent,
  onOpenDetails,
  onSave,
  isSaving,
}: ClassAttendanceTabProps) {
  // Helpers for Monthly View
  const [year, month] = currentMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'PRESENT': return { char: 'P', color: 'bg-emerald-500', text: 'text-emerald-700', subtle: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'LATE': return { char: 'M', color: 'bg-amber-500', text: 'text-amber-700', subtle: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'ABSENT': return { char: 'V', color: 'bg-rose-500', text: 'text-rose-700', subtle: 'bg-rose-50 text-rose-600 border-rose-100' };
      default: return null;
    }
  };

  const attendanceRate = useMemo(() => {
    return currentStats.total > 0 ? Math.round((currentStats.present / currentStats.total) * 100) : 0;
  }, [currentStats]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
      {/* --- Header: Controls (Minimized) --- */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Mode Selector (Segmented Pill) */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewType('daily')}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                viewType === 'daily' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <List className="w-3.5 h-3.5" />
              Theo ngày
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-medium transition-all",
                viewType === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Theo tháng
            </button>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Selection UI */}
          {viewType === 'daily' ? (
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 hover:bg-white transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="text-[11px] font-medium border-none focus:ring-0 p-0 h-auto outline-none bg-transparent text-slate-700 cursor-pointer"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 hover:bg-white transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="month"
                value={currentMonth}
                onChange={e => setCurrentMonth(e.target.value)}
                className="text-[11px] font-medium border-none focus:ring-0 p-0 h-auto outline-none bg-transparent text-slate-700 cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllPresent}
            disabled={filteredStudents.length === 0}
            className="h-7 px-3 text-emerald-600 border-emerald-100 bg-emerald-50/10 hover:bg-emerald-50 text-[10.5px] font-semibold rounded-md gap-1.5 transition-all shadow-none"
          >
            <CheckCircle className="w-3 h-3" />
            Có mặt toàn bộ
          </Button>
          
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || filteredStudents.length === 0}
            className="h-7 bg-slate-900 hover:bg-black text-white text-[10.5px] font-semibold px-4 rounded-md gap-1.5 shadow-sm transition-all"
          >
            {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            Lưu điểm danh
          </Button>
        </div>
      </div>

      {/* --- Main Area --- */}
      <div className="flex-1 overflow-auto p-3">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
          {viewType === 'daily' ? (
            <Table className="border-collapse table-fixed w-full">
              <TableHeader className="bg-slate-100 sticky top-0 z-10">
                <TableRow className="h-10 hover:bg-transparent border-b border-slate-200">
                  <TableHead className="w-10 text-center border-r border-slate-200"><GripVertical className="w-3.5 h-3.5 mx-auto text-slate-300" /></TableHead>
                  <TableHead className="w-12 text-[11px] text-slate-500 px-3 border-r border-slate-200">TT</TableHead>
                  <TableHead className="w-32 text-[11px] text-slate-500 px-3 border-r border-slate-200">Mã số</TableHead>
                  <TableHead className="w-56 text-[11px] text-slate-500 px-3 border-r border-slate-200">Họ và tên</TableHead>
                  <TableHead className="w-[300px] text-center text-[11px] text-slate-500 px-3 border-r border-slate-200">Điểm danh</TableHead>
                  <TableHead className="w-24 text-center text-[11px] text-slate-500 px-3 border-r border-slate-200">Giờ vào</TableHead>
                  <TableHead className="text-[11px] text-slate-500 px-3">Ghi chú nhanh</TableHead>
                </TableRow>
                <TableRow className="h-8 bg-white border-b border-slate-200">
                  <TableCell className="border-r border-slate-200" />
                  <TableCell className="border-r border-slate-200" />
                  <TableCell className="px-2 border-r border-slate-200"><Search className="w-3 h-3 text-slate-300" /></TableCell>
                  <TableCell className="px-2 border-r border-slate-200"><Search className="w-3 h-3 text-slate-300" /></TableCell>
                  <TableCell className="border-r border-slate-200" />
                  <TableCell className="border-r border-slate-200" />
                  <TableCell />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, idx) => {
                  const record = records.find(r => r.studentId === student.id && r.date === attendanceDate);
                  return (
                    <TableRow key={student.id} className="h-10 hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                      <TableCell className="text-center border-r border-slate-200">
                        <GripVertical className="w-3.5 h-3.5 mx-auto text-slate-200 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </TableCell>
                      <TableCell className="text-[11px] font-normal text-slate-800 px-3 border-r border-slate-200">{idx + 1}</TableCell>
                      <TableCell className="text-[11px] font-normal text-slate-500 px-3 border-r border-slate-200 tabular-nums">{student.id}</TableCell>
                      <TableCell className="px-3 border-r border-slate-200">
                        <button
                          onClick={() => onOpenDetails?.(student)}
                          className="text-[11px] font-medium text-slate-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {student.name}
                        </button>
                      </TableCell>
                      <TableCell className="px-2 border-r border-slate-200">
                        <div className="flex bg-slate-100 p-0.5 rounded-md h-7 border border-slate-200">
                          {(['PRESENT', 'LATE', 'ABSENT'] as const).map(s => {
                            const isActive = record?.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(student.id, s)}
                                className={cn(
                                  "flex-1 px-2 rounded text-[10px] font-semibold transition-all uppercase tracking-tight",
                                  isActive
                                    ? s === 'PRESENT' ? 'bg-emerald-500 text-white shadow-sm'
                                      : s === 'LATE' ? 'bg-amber-500 text-white shadow-sm'
                                      : 'bg-rose-500 text-white shadow-sm'
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                                )}
                              >
                                {s === 'PRESENT' ? 'Có mặt' : s === 'LATE' ? 'Muộn' : 'Vắng'}
                              </button>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        "text-center text-[11px] tabular-nums font-medium border-r border-slate-200",
                        !record?.updatedAt ? "text-slate-300" :
                        record.status === 'PRESENT' ? "text-emerald-600" :
                        record.status === 'LATE' ? "text-amber-600" :
                        "text-rose-600"
                      )}>
                        {record?.updatedAt 
                          ? new Date(record.updatedAt).toLocaleTimeString('vi-VN', { hour12: false }) 
                          : '--:--'}
                      </TableCell>
                      <TableCell className="px-3">
                        <input
                          placeholder="Nhập ghi chú..."
                          value={record?.note || ''}
                          onChange={e => handleNoteChange(student.id, e.target.value)}
                          className="text-[12px] bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-300 italic"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            /* --- Monthly Register View --- */
            <div className="overflow-x-auto h-full scrollbar-thin scrollbar-thumb-slate-200">
              <Table className="border-collapse table-fixed w-max min-w-full">
                <TableHeader className="bg-slate-100 sticky top-0 z-20">
                  <TableRow className="h-10 border-b border-slate-200">
                    <TableHead className="w-10 text-center text-[11px] font-medium text-slate-500 bg-slate-100 sticky left-0 z-30 border-r border-slate-200 uppercase">TT</TableHead>
                    <TableHead className="w-52 text-[11px] font-medium text-slate-500 px-4 bg-slate-100 sticky left-10 z-30 border-r border-slate-200 uppercase">Họ và tên</TableHead>
                    {daysArray.map(day => {
                      const date = new Date(year, month - 1, day);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                        <TableHead 
                          key={day} 
                          className={cn(
                            "w-9 text-center text-[10px] font-semibold border-r border-slate-200/50",
                            isWeekend ? "text-rose-500 bg-rose-50/50" : "text-slate-500"
                          )}
                        >
                          <div className="flex flex-col gap-0">
                            <span>{day}</span>
                            <span className="text-[8px] opacity-60 uppercase">{['CN','T2','T3','T4','T5','T6','T7'][date.getDay()]}</span>
                          </div>
                        </TableHead>
                      );
                    })}
                    <TableHead className="w-20 text-center text-[11px] font-medium text-slate-600 bg-emerald-50 sticky right-0 z-30 border-l border-emerald-100 uppercase">Tổng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, idx) => {
                    const studentRecords = records.filter(r => r.studentId === student.id);
                    const presentCount = studentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
                    
                    return (
                      <TableRow key={student.id} className="h-9 hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                        <TableCell className="text-[11px] font-medium text-slate-400 text-center bg-white sticky left-0 z-10 border-r border-slate-200">{idx + 1}</TableCell>
                        <TableCell className="text-[11px] font-medium text-slate-900 px-4 bg-white sticky left-10 z-10 border-r border-slate-200 truncate tabular-nums">
                          {student.name}
                        </TableCell>
                        {daysArray.map(day => {
                          const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
                          const record = studentRecords.find(r => r.date === dateStr);
                          const info = getStatusInfo(record?.status);
                          const isWeekend = new Date(year, month-1, day).getDay() % 6 === 0;

                          return (
                            <TableCell key={day} className={cn("p-0 border-r border-slate-100 text-center", isWeekend && "bg-rose-50/10")}>
                              {info ? (
                                <div className={cn(
                                  "w-6 h-6 mx-auto rounded flex items-center justify-center text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-110",
                                  info.color
                                )}>
                                  {info.char}
                                </div>
                              ) : (
                                <span className="text-slate-100 font-normal">.</span>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center px-1 bg-emerald-50/50 sticky right-0 z-10 border-l border-emerald-100">
                          <span className="text-[13px] font-semibold text-emerald-700">{presentCount}</span>
                          <span className="text-[9px] text-emerald-600/40 font-medium ml-0.5">/{daysInMonth}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer / Legend --- */}
      <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Có mặt (P)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Đi muộn (M)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-rose-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Vắng mặt (V)</span>
          </div>
        </div>
        
        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 italic">
          <RefreshCw className="w-3 h-3 animate-pulse" />
          Dữ liệu đồng bộ thời gian thực
        </div>
      </div>
    </div>
  );
}

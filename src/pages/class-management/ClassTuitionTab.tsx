import React from 'react';
import { Calendar, FileDown, TrendingUp, CreditCard, AlertCircle, Receipt, Printer, X, ChevronLeft, ChevronRight, Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Student, AttendanceRecord } from '@/services/mockData';
import { toast } from 'sonner';

interface ClassTuitionTabProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  paymentStats: {
    total: number;
    paid: number;
    pending: number;
    totalAmount: number;
  };
  filteredStudents: Student[];
  getTotalUnpaidSessions: (id: string) => number;
  getSessionsCount: (id: string) => number;
  records: AttendanceRecord[];
  openPaymentModal: (student: Student) => void;
  openDetailPanel: (student: Student) => void;
}

export function ClassTuitionTab({
  selectedMonth,
  setSelectedMonth,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  paymentStats,
  filteredStudents,
  getTotalUnpaidSessions,
  getSessionsCount,
  records,
  openPaymentModal,
  openDetailPanel,
}: ClassTuitionTabProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* Monthly Header & Selector */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-tight">Kỳ thu phí:</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-[11px] font-bold bg-transparent border-none outline-none text-gray-700 cursor-pointer"
              >
                <option value="2026-03">Tháng 03/2026</option>
                <option value="2026-02">Tháng 02/2026</option>
                <option value="2026-01">Tháng 01/2026</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:border-l sm:border-gray-200 sm:pl-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Từ ngày</span>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-[11px] font-bold bg-white border border-gray-200 rounded px-2 py-1 outline-none text-gray-700 focus:border-gold-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Đến ngày</span>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-[11px] font-bold bg-white border border-gray-200 rounded px-2 py-1 outline-none text-gray-700 focus:border-gold-400"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-gray-200 bg-white gap-2 rounded-md">
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 border-b border-gray-100 shrink-0">
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Tổng đã thu</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{paymentStats.totalAmount.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg px-4 py-3 flex items-center justify-between border border-emerald-100">
          <div>
            <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Học sinh đã đóng</p>
            <p className="text-base font-bold text-emerald-700 mt-0.5">{paymentStats.paid} / {paymentStats.total} em</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-emerald-100">
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
        <div className="bg-amber-50 rounded-lg px-4 py-3 flex items-center justify-between border border-amber-100">
          <div>
            <p className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Chưa thu</p>
            <p className="text-base font-bold text-amber-700 mt-0.5">{paymentStats.pending} em</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase">Trạng thái đóng phí học sinh</h3>
        </div>
        <div className="flex-1 overflow-auto bg-white border-b border-gray-100">
          <Table className="border-collapse table-fixed min-w-[1100px] w-full">
            <TableHeader className="bg-white sticky top-0 z-10">
              <TableRow className="h-9 hover:bg-transparent border-b border-gray-200 text-[10px]">
                <TableHead className="w-10 px-3 border-r border-gray-200">TT</TableHead>
                <TableHead className="w-44 px-3 border-r border-gray-200">Họ tên</TableHead>
                <TableHead className="w-28 text-center border-r border-gray-200">Học phí/buổi</TableHead>
                <TableHead className="w-24 text-center border-r border-gray-200">Trạng thái</TableHead>
                <TableHead className="w-24 text-center border-r border-gray-200">Số buổi</TableHead>
                <TableHead className="w-24 text-center border-r border-gray-200">Đã đóng (buổi)</TableHead>
                <TableHead className="w-24 text-center border-r border-gray-200">Chưa đóng (buổi)</TableHead>
                <TableHead className="w-32 text-center border-r border-gray-200">Tiền chưa đóng</TableHead>
                <TableHead className="w-24 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, idx) => {
                const totalUnpaid = getTotalUnpaidSessions(student.id);
                const price = student.pricePerSession ?? 180000;
                const estimatedDebt = totalUnpaid * price;

                return (
                  <TableRow 
                    key={student.id} 
                    className="h-10 hover:bg-gold-50/30 transition-colors border-b border-gray-200 cursor-pointer group"
                    onClick={() => openDetailPanel(student)}
                  >
                    <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                    <TableCell className="text-[11px] text-gray-800 px-3 border-r border-gray-200">{student.name}</TableCell>
                    <TableCell className=" text-center text-[11px] text-gray-800 border-r border-gray-200 tabular-nums px-3">
                      {price.toLocaleString('vi-VN')}đ
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-200">
                      <Badge 
                        variant="neutral" 
                        className={cn(
                          "text-[9px] font-bold border-none px-2 h-4",
                          totalUnpaid === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}
                      >
                        {totalUnpaid === 0 ? 'ĐÃ ĐÓNG' : 'CÒN NỢ'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-gray-800 border-r border-gray-200 tabular-nums">
                      {getSessionsCount(student.id)}
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-emerald-600 border-r border-gray-200 tabular-nums">
                      {records.filter(r => r.studentId === student.id && (r.status === 'PRESENT' || r.status === 'LATE') && r.isPaid && r.date >= fromDate && r.date <= toDate).length}
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-rose-600 border-r border-gray-200 tabular-nums">
                      {totalUnpaid}
                    </TableCell>
                    <TableCell className="text-center text-[11px] text-gray-800 px-3 border-r border-gray-200 tabular-nums">
                      {estimatedDebt > 0 ? estimatedDebt.toLocaleString('vi-VN') + 'đ' : '—'}
                    </TableCell>
                    <TableCell className="text-center px-3" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        className={cn(
                          "h-6 text-[9px] font-bold border-none shadow-none px-3",
                          totalUnpaid === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#E6B800] hover:bg-gold-600 text-white"
                        )}
                        disabled={totalUnpaid === 0}
                        onClick={() => openPaymentModal(student)}
                      >
                       Tạo phiếu thu
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function TuitionDetailPanel({ isOpen, onClose, student, records, fromDate, toDate }: any) {
  const [viewType, setViewType] = React.useState<'calendar' | 'table'>('calendar');
  const [viewMode, setViewMode] = React.useState<'month' | 'week'>('month');
  const [selectedDateMsg, setSelectedDateMsg] = React.useState<string | null>(null);
  const [currentViewDate, setCurrentViewDate] = React.useState(new Date(fromDate));

  if (!student) return null;

  const sessionList = records.filter(
    (a: any) => a.studentId === student.id && (a.status === 'PRESENT' || a.status === 'LATE') && a.date >= fromDate && a.date <= toDate
  ).sort((a: any, b: any) => a.date.localeCompare(b.date));

  const price = student.pricePerSession || 180000;
  const totalTuition = sessionList.length * price;
  const totalPossibleSessions = 20; 
  const progress = Math.min((sessionList.length / totalPossibleSessions) * 100, 100);

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const monthName = currentViewDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonthDate = new Date(year, month, 0);
  const prevMonthDays = prevMonthDate.getDate();
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startOffset + 1;
    if (day > 0 && day <= daysInMonth) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = records.find((r: any) => r.studentId === student.id && r.date === dateStr);
      return { day, dateStr, record, isCurrentMonth: true };
    } else if (day <= 0) {
      const pDay = prevMonthDays + day;
      const pDateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
      return { day: pDay, dateStr: pDateStr, isCurrentMonth: false };
    } else {
      const fDay = day - daysInMonth;
      const fDateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(fDay).padStart(2, '0')}`;
      return { day: fDay, dateStr: fDateStr, isCurrentMonth: false };
    }
  });

  const currentWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    currentWeeks.push(calendarDays.slice(i, i + 7));
  }

  // Week View Logic: find the current week or first week of month
  const today = new Date().toISOString().split('T')[0];
  const activeWeekIndex = currentWeeks.findIndex(w => w.some(d => d.dateStr === today)) || 0;
  const displayDays = viewMode === 'month' ? calendarDays : currentWeeks[activeWeekIndex === -1 ? 0 : activeWeekIndex];

  const navigateMonth = (direction: number) => {
    setCurrentViewDate(new Date(year, month + direction, 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[1100px] w-[98vw] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl flex flex-col h-[90vh]"
      >
        {/* 1. TOP SUMMARY BAR (Sticky) */}
        <div className="h-20 bg-white border-b border-gray-100 flex items-center px-10 shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex-1 flex items-center justify-between mr-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Học sinh</span>
              <span className="text-base font-bold text-gray-900">{student.name}</span>
            </div>
            
            <div className="h-8 w-px bg-gray-100 mx-4"></div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Tổng buổi đã học</span>
              <span className="text-xl font-bold text-gray-900 tabular-nums">
                {sessionList.length} <span className="text-[11px] font-medium text-gray-400 ml-1">buổi</span>
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Đơn giá/buổi</span>
              <span className="text-xl font-bold text-gray-900 tabular-nums">
                {price.toLocaleString()} <span className="text-[11px] font-medium text-gray-400 ml-1">đ</span>
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest mb-0.5">Tổng học phí dự kiến</span>
              <span className="text-2xl font-black text-[#C9A96E] tabular-nums">
                {totalTuition.toLocaleString()} <span className="text-[13px] font-bold ml-1">VNĐ</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* 2. LEFT SIDE (70%) - Main Workspace */}
          <div className="flex-[0.72] flex flex-col bg-[#FBFBFC] overflow-hidden border-r border-gray-100">
            {/* Toolbar */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setViewType('calendar')}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all",
                      viewType === 'calendar' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Lịch học
                  </button>
                  <button 
                    onClick={() => setViewType('table')}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-[11px] font-bold transition-all",
                      viewType === 'table' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    Danh sách
                  </button>
                </div>
                
                {viewType === 'calendar' && (
                  <div className="flex bg-gray-100 p-0.5 rounded-lg ml-2">
                    <button 
                      onClick={() => setViewMode('month')}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                        viewMode === 'month' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                      )}
                    >
                      Tháng
                    </button>
                    <button 
                      onClick={() => setViewMode('week')}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                        viewMode === 'week' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                      )}
                    >
                      Tuần
                    </button>
                  </div>
                )}
              </div>

              {viewType === 'calendar' && (
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1">
                    <button onClick={() => navigateMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-800 min-w-[120px] text-center">{monthName}</span>
                    <button onClick={() => navigateMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {viewType === 'table' && (
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                    Bộ lọc: {fromDate} - {toDate}
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1">
              <div className="p-8">
                {viewType === 'calendar' ? (
                  <div className="max-w-[700px] mx-auto">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2">
                          {day}
                        </div>
                      ))}
                      
                      {displayDays.map((dateObj, idx) => {
                        const isAttended = dateObj.record && (dateObj.record.status === 'PRESENT' || dateObj.record.status === 'LATE');
                        const isAbsent = dateObj.record && (dateObj.record.status === 'ABSENT' || dateObj.record.status === 'EXCUSED');
                        const isTodayIndicator = dateObj.dateStr === today;
                        const isWeekend = idx % 7 === 5 || idx % 7 === 6;

                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedDateMsg(`${dateObj.dateStr}: ${isAttended ? (dateObj.record?.status === 'PRESENT' ? 'Có mặt' : 'Đi muộn') : (isAbsent ? 'Vắng mặt' : 'Chưa ghi nhận')}`)}
                            className={cn(
                              "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all group cursor-pointer border",
                              !dateObj.isCurrentMonth ? "opacity-30 bg-gray-50" : "bg-white hover:border-[#C9A96E] hover:shadow-xl hover:-translate-y-0.5",
                              isAttended ? "bg-[#C9A96E]/5 border-[#C9A96E]/20" : "border-gray-100",
                              isAbsent && "bg-rose-50 border-rose-100",
                              isTodayIndicator && "border-2 border-[#C9A96E] shadow-lg shadow-[#C9A96E]/10",
                              isWeekend && !isAttended && !isAbsent && "bg-gray-50/50"
                            )}
                          >
                            <span className={cn(
                              "text-sm font-bold",
                              isAttended ? "text-[#C9A96E]" : (isAbsent ? "text-rose-500" : "text-gray-700"),
                              !dateObj.isCurrentMonth && "text-gray-400"
                            )}>
                              {dateObj.day}
                            </span>
                            
                            {isAttended && (
                              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C9A96E]"></div>
                            )}

                            {/* Hover Tooltip */}
                            <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-40 bg-gray-900 text-white rounded-lg p-2.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                              <p className="font-bold border-b border-white/10 pb-1 mb-1">{dateObj.dateStr}</p>
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "font-bold uppercase tracking-tighter",
                                  isAttended ? "text-amber-400" : (isAbsent ? "text-rose-400" : "text-gray-400")
                                )}>
                                  {isAttended ? (dateObj.record?.status === 'PRESENT' ? 'Có mặt' : 'Đi muộn') : (isAbsent ? 'Vắng mặt' : 'Không có dữ liệu')}
                                </span>
                                {isAttended && <span className="text-[8px] opacity-60">+$180k</span>}
                              </div>
                              {dateObj.record?.note && (
                                <p className="mt-1.5 pt-1.5 border-t border-white/5 opacity-70 italic truncate">"{dateObj.record.note}"</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[750px] mx-auto bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="h-10 hover:bg-transparent border-b border-gray-100">
                          <TableHead className="w-12 text-center text-[10px] font-bold uppercase text-gray-400">STT</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase text-gray-400">Ngày học</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase text-gray-400">Trạng thái</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase text-gray-400">Ghi chú</TableHead>
                          <TableHead className="text-right text-[10px] font-bold uppercase text-gray-400 pr-6">Chi phí</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessionList.map((rec, idx) => (
                          <TableRow key={idx} className="h-12 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <TableCell className="text-[11px] text-gray-400 text-center font-medium">{idx + 1}</TableCell>
                            <TableCell className="text-[12px] text-gray-900 font-bold">
                              {new Date(rec.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="neutral" 
                                className={cn(
                                  "text-[10px] font-bold h-5 px-2 border-none",
                                  rec.status === 'PRESENT' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                )}
                              >
                                {rec.status === 'PRESENT' ? 'CỐ MẶT' : 'ĐI MUỘN'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[11px] text-gray-500 italic max-w-[200px] truncate">
                              {rec.note || '—'}
                            </TableCell>
                            <TableCell className="text-right text-[12px] font-bold text-gray-900 pr-6 tabular-nums">
                              {price.toLocaleString()}đ
                            </TableCell>
                          </TableRow>
                        ))}
                        {sessionList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-gray-400 text-xs italic">
                              Không tìm thấy dữ liệu điểm danh trong khoảng thời gian này.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 3. RIGHT SIDE (28%) - Calculations & Actions */}
          <div className="flex-[0.28] flex flex-col bg-white overflow-hidden">
            <div className="p-8 flex flex-col h-full">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chi tiết tính phí</h3>
              
              <div className="space-y-6 flex-1">
                {/* Breakdown Card */}
                <div className="bg-[#FBFBFC] rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-gray-500">Số buổi học thực tế</span>
                    <span className="text-[13px] font-bold text-gray-900">{sessionList.length} buổi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-gray-500">Đơn giá áp dụng</span>
                    <span className="text-[13px] font-bold text-gray-900">{price.toLocaleString()}đ</span>
                  </div>
                  <div className="h-px bg-gray-200/60 w-full my-1"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Công thức</span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#C9A96E]">
                      <span>{sessionList.length}</span>
                      <span className="text-gray-300">×</span>
                      <span>{price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-800">Cần thanh toán</span>
                    <span className="text-2xl font-black text-[#C9A96E] tabular-nums">
                      {totalTuition.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white border-2 border-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Tiến độ hoàn thành</span>
                    <span className="text-xs font-black text-[#C9A96E]">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C9A96E] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                     <p className="text-[10px] text-gray-400">
                      Đã đạt <span className="font-bold text-gray-600">{sessionList.length}</span> trên <span className="font-bold text-gray-600">{totalPossibleSessions}</span> buổi mục tiêu
                    </p>
                    <Info className="w-3 h-3 text-gray-300 cursor-help" />
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="py-4 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Ngày bắt đầu kỳ</span>
                      <span className="font-bold text-gray-900">{fromDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Thời điểm chốt phí</span>
                      <span className="font-bold text-gray-900">{toDate}</span>
                    </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-gray-100">
                <Button 
                  className="w-full bg-[#C9A96E] hover:bg-[#b09460] text-white h-12 rounded-xl shadow-lg shadow-[#C9A96E]/20 font-bold gap-3 text-xs tracking-wide transition-all active:scale-95"
                  onClick={() => toast.success('Đang khởi tạo phiếu thu...')}
                >
                  <Printer className="w-4 h-4" />
                  XUẤT BIÊN LAI THU PHÍ
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="border-gray-200 hover:bg-gray-50 h-10 rounded-xl font-bold text-[10px] px-0 gap-2 overflow-hidden"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    BÁO CÁO PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 hover:bg-gray-50 h-10 rounded-xl font-bold text-[10px] px-0 gap-2 overflow-hidden"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    BÁO CÁO EXCEL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIDE DRAWER EFFECT (CSS based overlay) */}
        {selectedDateMsg && (
          <div className="absolute right-0 top-20 bottom-0 w-80 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-gray-100 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">Chi tiết ngày học</h4>
              <button onClick={() => setSelectedDateMsg(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 flex-1">
              <div className="flex flex-col gap-6">
                <div className="p-4 bg-[#FBFBFC] rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Thời gian</p>
                  <p className="text-sm font-bold text-gray-900">{selectedDateMsg.split(':')[0]}</p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Trạng thái điểm danh</p>
                  <Badge variant="neutral" className="bg-[#C9A96E]/10 text-[#C9A96E] border-none font-black text-[10px] px-3 py-1">
                    {selectedDateMsg.split(':')[1]}
                  </Badge>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Ghi chú từ giáo viên</p>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    {selectedDateMsg.includes('Có mặt') ? "Học sinh tham gia đầy đủ, tích cực phát biểu." : "Học sinh vắng không phép hoặc chưa có thông tin ghi nhận."}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-10 rounded-xl text-xs font-bold border-gray-200">
                CHỈNH SỬA TRẠNG THÁI
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

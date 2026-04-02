import React from 'react';
import { Calendar, FileDown, TrendingUp, CreditCard, AlertCircle, Receipt, Printer } from 'lucide-react';
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
                    <TableCell className="text-[11px] text-gray-500 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                    <TableCell className="text-[11px] font-semibold text-gray-900 px-3 border-r border-gray-200">{student.name}</TableCell>
                    <TableCell className=" text-center text-[11px] font-bold text-gray-600 border-r border-gray-200 tabular-nums px-3">
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
                    <TableCell className="text-center text-[11px] font-bold text-gray-600 border-r border-gray-200 tabular-nums">
                      {getSessionsCount(student.id)}
                    </TableCell>
                    <TableCell className="text-center text-[11px] font-bold text-emerald-600 border-r border-gray-200 tabular-nums">
                      {records.filter(r => r.studentId === student.id && r.status === 'PRESENT' && r.isPaid && r.date >= fromDate && r.date <= toDate).length}
                    </TableCell>
                    <TableCell className="text-center text-[11px] font-bold text-rose-600 border-r border-gray-200 tabular-nums">
                      {totalUnpaid}
                    </TableCell>
                    <TableCell className="text-center text-[11px] font-bold text-gray-900 px-3 border-r border-gray-200 tabular-nums">
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
  if (!student) return null;

  const sessionList = records.filter(
    (a: any) => a.studentId === student.id && a.status === 'PRESENT' && a.date >= fromDate && a.date <= toDate
  ).sort((a: any, b: any) => a.date.localeCompare(b.date));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[580px] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl"
      >
        <DialogHeader className="p-6 bg-gradient-to-br from-[#1E40AF] to-blue-900 text-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-200" />
                Theo dõi chi tiết học phí
              </DialogTitle>
              <p className="text-[11px] opacity-80 mt-1 uppercase font-bold tracking-wider">Học sinh: {student.name} • {student.id}</p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
              Lớp {student.class}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Số buổi học</p>
              <p className="text-xl font-black">{sessionList.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Tiền nợ ưu tính</p>
              <p className="text-xl font-black">{(sessionList.length * 180000).toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Bắt đầu học</p>
              <p className="text-base font-bold mt-1">15/01/2026</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 flex flex-col min-h-[300px]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Nhật ký đi học (Có mặt)</h3>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
              {fromDate.split('-').reverse().join('/')} - {toDate.split('-').reverse().join('/')}
            </span>
          </div>

          <ScrollArea className="h-64 pr-4">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
                <TableRow className="h-8 hover:bg-transparent">
                  <TableHead className="w-12 text-[10px] uppercase font-bold text-gray-400">STT</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-gray-400">Ngày học</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-gray-400">Giờ vào</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold text-gray-400">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionList.map((s: any, i: number) => (
                  <TableRow key={s.id} className="h-10 hover:bg-gray-50/80 border-b border-gray-100 last:border-none group">
                    <TableCell className="text-[11px] font-medium text-gray-400">{i + 1}</TableCell>
                    <TableCell className="text-[11px] font-bold text-gray-800">
                      {new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500 font-medium font-mono">18:30:22</TableCell>
                    <TableCell className="text-right text-[11px] font-black text-[#1E40AF] tabular-nums">
                      180.000đ
                    </TableCell>
                  </TableRow>
                ))}
                {sessionList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-[11px] text-gray-400 italic">
                      Không có dữ liệu buổi học trong khoảng ngày này
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <div className="p-4 bg-gray-50 border-t flex gap-2 justify-end">
          <Button 
            variant="outline"
            className="bg-white text-gray-700 border-gray-200 h-9 text-[11px] font-bold px-6"
            onClick={onClose}
          >
            ĐÓNG
          </Button>
          <Button 
            className="bg-[#1E40AF] hover:bg-blue-800 text-white h-9 text-[11px] font-bold px-8 shadow-lg gap-2"
            onClick={() => toast.success('Đang khởi tạo PDF...')}
          >
            <Printer className="w-4 h-4" />
            XUẤT PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

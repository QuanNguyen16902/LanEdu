import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Student, mockAttendance } from '@/services/mockData';
import { 
  X, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Calendar,
  ChevronDown,
  Info,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

interface PaymentSlipModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { amount: number; method: string; note: string }) => void;
}

const BANKS = [
  { id: 'cash', name: 'Tiền mặt', icon: '💵' },
  { id: 'tpbank', name: 'TPBank (Trần Hoan)', icon: '🏛️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'techcom', name: 'Techcombank', icon: '🏛️' },
  { id: 'bidv', name: 'BIDV', icon: '🏛️' },
  { id: 'mbbank', name: 'MB Bank', icon: '🏛️' },
  { id: 'agribank', name: 'Agribank', icon: '🏛️' },
  { id: 'vietcom', name: 'Vietcombank', icon: '🏛️' },
  { id: 'vnpay', name: 'VNPay', icon: '📱' },
];

export function PaymentSlipModal({ student, isOpen, onClose, onSave }: PaymentSlipModalProps) {
  const [selectedBank, setSelectedBank] = useState('tpbank');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const unpaidSessionsByMonth = useMemo(() => {
    if (!student) return [];
    
    // Group records by month
    const groups: Record<string, number> = {};
    mockAttendance
      .filter(a => a.studentId === student.id && a.status === 'PRESENT' && !a.isPaid)
      .forEach(a => {
        const month = new Date(a.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        groups[month] = (groups[month] || 0) + 1;
      });

    return Object.entries(groups).map(([month, count]) => ({
      month: `Tháng ${month}`,
      sessions: count,
      amount: count * (student.pricePerSession ?? 180000),
      status: 'UNPAID'
    }));
  }, [student]);

  const totalFee = useMemo(() => {
    return unpaidSessionsByMonth.reduce((sum, item) => sum + item.amount, 0);
  }, [unpaidSessionsByMonth]);

  React.useEffect(() => {
    if (totalFee !== undefined) {
        setPaymentAmount(totalFee);
    }
  }, [totalFee]);

  if (!student) return null;

  const feeItems = unpaidSessionsByMonth;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-screen h-screen m-0 p-0 border-none bg-zinc-50 flex flex-col rounded-none gap-0">
        {/* Header Bar */}
        <div className="bg-white border-b border-zinc-200 px-4 h-12 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-[13px] font-bold text-zinc-800">
               CT000000{student.id.slice(-4)}: Thu phí ({student.id} - {student.name} - {student.class})
             </span>
          </div>
          <button 
             onClick={onClose}
             className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white border-b border-zinc-200 px-4 h-12 flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-8 px-3 text-[11px] font-bold border-zinc-200 gap-1.5 uppercase hover:bg-zinc-50">
              <Plus size={14} className="text-blue-600" />
              Thêm khoản nộp
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 text-[11px] font-bold border-zinc-200 gap-1.5 uppercase hover:bg-zinc-50">
              <RotateCcw size={14} className="text-amber-600" />
              Điều chỉnh chiết khấu
            </Button>
            <div className="h-4 w-px bg-zinc-200 mx-2" />
            <Button size="sm" className="h-8 px-4 text-[11px] font-bold bg-white text-emerald-600 border border-emerald-100 gap-1.5 uppercase hover:bg-emerald-50">
              <Save size={14} />
              Lưu
            </Button>
            <Button size="sm" onClick={onClose} className="h-8 px-4 text-[11px] font-bold bg-white text-rose-600 border border-rose-100 gap-1.5 uppercase hover:bg-rose-50">
              <X size={14} />
              Hủy
            </Button>
        </div>

        {/* Main Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Fee Details Table */}
          <div className="flex-1 border-r border-zinc-200 bg-white flex flex-col p-4 overflow-hidden">
             <div className="flex-1 overflow-auto border border-zinc-100 rounded-sm shadow-sm">
                <Table className="text-[11px] border-collapse min-w-full">
                  <TableHeader className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200">
                    <TableRow className="h-10 hover:bg-transparent transition-none">
                      <TableHead className="w-10 text-center text-zinc-500 uppercase font-bold tracking-tight">#</TableHead>
                      <TableHead className="w-10 border-l border-zinc-200"></TableHead>
                      <TableHead className="w-32 border-l border-zinc-200 text-zinc-500 uppercase font-bold tracking-tight">Nhóm</TableHead>
                      <TableHead className="border-l border-zinc-200 text-zinc-500 uppercase font-bold tracking-tight">Tên khoản nộp</TableHead>
                      <TableHead className="w-32 border-l border-zinc-200 text-zinc-500 uppercase font-bold tracking-tight text-right">Định mức</TableHead>
                      <TableHead className="w-32 border-l border-zinc-200 text-zinc-500 uppercase font-bold tracking-tight text-right">Phải nộp</TableHead>
                      <TableHead className="w-32 border-l border-zinc-200 text-zinc-500 uppercase font-bold tracking-tight text-right">Đã nộp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Header Group */}
                    <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                      <TableCell colSpan={7} className="py-2 px-3 font-bold text-blue-600 flex items-center gap-2">
                        <ChevronDown size={14} />
                        Nhóm: Học phí
                      </TableCell>
                    </TableRow>
                    
                    {feeItems.map((item, idx) => (
                      <TableRow key={item.month} className="h-10 group hover:bg-blue-50/30">
                        <TableCell className="text-center font-mono text-zinc-400">{idx + 1}</TableCell>
                        <TableCell className="text-center border-l border-zinc-100">
                          <button className="text-zinc-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        </TableCell>
                        <TableCell className="px-3 border-l border-zinc-100 text-zinc-600">Học phí</TableCell>
                        <TableCell className="px-3 border-l border-zinc-100">
                           <div className="font-medium text-zinc-800">Học phí {item.month}</div>
                           <div className="text-[10px] text-zinc-400">HP-2026-{idx+1}</div>
                        </TableCell>
                        <TableCell className="px-3 border-l border-zinc-100 text-right font-medium text-zinc-600">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-3 border-l border-zinc-100 text-right font-bold text-zinc-800">
                          {item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-3 border-l border-zinc-100 text-right text-zinc-400">0</TableCell>
                      </TableRow>
                    ))}

                    {/* Fill remaining space with empty rows for visual consistency */}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <TableRow key={`empty-${i}`} className="h-10 border-b border-zinc-50">
                         <TableCell className="text-center text-zinc-200">{feeItems.length + i + 1}</TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                         <TableCell className="border-l border-zinc-50"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </div>
          </div>

          {/* Right Column: Payment & Summary Panel */}
          <div className="w-[450px] bg-white p-4 flex flex-col gap-4 overflow-y-auto shrink-0 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border border-zinc-100 rounded-lg p-3 bg-zinc-50/30">
               {[
                 { label: 'Số tiền thừa', value: '0', color: 'text-emerald-600' },
                 { label: 'Tổng định mức', value: totalFee.toLocaleString() },
                 { label: 'Tổng miễn giảm', value: '0' },
                 { label: 'Tổng phải nộp', value: totalFee.toLocaleString(), bold: true },
                 { label: 'Đã nộp', value: '0', color: 'text-blue-600', bold: true },
                 { label: 'Còn lại', value: totalFee.toLocaleString(), color: 'text-rose-600', bold: true },
               ].map((item, idx) => (
                 <React.Fragment key={idx}>
                   <span className="text-[11px] text-zinc-500 font-medium">{item.label}</span>
                   <span className={cn(
                     "text-[11px] text-right font-mono",
                     item.color || "text-zinc-800",
                     item.bold && "font-bold"
                   )}>
                     {item.value}
                   </span>
                 </React.Fragment>
               ))}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Hình thức thanh toán</h3>
                  <Info size={12} className="text-zinc-300" />
               </div>
               <div className="grid grid-cols-2 gap-2">
                 {BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md border text-[11px] font-medium transition-all text-left",
                        selectedBank === bank.id 
                          ? bank.color || "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                          : "bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300"
                      )}
                    >
                      <span className="text-base grayscale-[0.5]">{bank.icon}</span>
                      <span className="truncate">{bank.name}</span>
                    </button>
                 ))}
               </div>
            </div>

            {/* Payment Details Input */}
            <div className="space-y-4 pt-2">
               <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase">Số tiền thu</label>
                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded cursor-pointer" onClick={() => setPaymentAmount(totalFee)}>Toàn bộ</span>
                  </div>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <Input 
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="h-10 pl-9 font-mono text-lg font-bold text-zinc-800 border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all rounded-lg"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase px-1">Ngày thu</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                      <Input 
                        disabled
                        value="25/03/2026"
                        className="h-9 pl-9 bg-zinc-50 text-[12px] border-zinc-200 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-zinc-500 uppercase px-1 opacity-0">Action</label>
                     <Button
                       className="h-9 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] gap-2 shadow-sm border-none rounded-lg"
                       onClick={() => {
                         onSave?.({ amount: paymentAmount, method: selectedBank, note: notes });
                         onClose();
                       }}
                     >
                       Cập nhật
                     </Button>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase px-1">Ghi chú</label>
                  <Textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú thanh toán..."
                    className="text-[12px] border-zinc-200 focus:border-blue-500 rounded-lg min-h-[80px]"
                  />
               </div>
            </div>

            {/* Sub-table: Payment Allocation/Log */}
            <div className="mt-auto border border-zinc-100 rounded-lg overflow-hidden bg-zinc-50/10">
               <Table className="text-[10px]">
                  <TableHeader className="bg-zinc-50">
                    <TableRow className="h-8">
                       <TableHead className="w-10 text-center font-bold">#</TableHead>
                       <TableHead className="font-bold">Hình thức</TableHead>
                       <TableHead className="text-right font-bold pr-4">Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="h-9 bg-white">
                      <TableCell className="text-center">...</TableCell>
                      <TableCell>
                         <div className="font-bold text-zinc-800">CK TPBank</div>
                         <div className="text-[9px] text-zinc-400">25/03/2026</div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-zinc-900 pr-4">
                        {paymentAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {/* Placeholder for more history */}
                  </TableBody>
               </Table>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-white border-t border-zinc-200 h-14 flex items-center justify-center shrink-0">
            <Button 
               variant="outline" 
               className="h-9 px-10 rounded-md border-zinc-300 text-zinc-600 hover:bg-zinc-50 text-[12px] font-bold shadow-sm" 
               onClick={onClose}
            >
              Đóng
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

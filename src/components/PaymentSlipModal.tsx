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
  CreditCard, 
  Calendar,
  DollarSign,
  User,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentSlipModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { amount: number; method: string; note: string }) => void;
}

const BANKS = [
  { id: 'cash', name: 'Tiền mặt', icon: '💵' },
  { id: 'tpbank', name: 'TPBank', icon: '🏛️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'mbbank', name: 'MB Bank', icon: '🏛️' },
  { id: 'vnpay', name: 'VNPay', icon: '📱' },
];

export function PaymentSlipModal({ student, isOpen, onClose, onSave }: PaymentSlipModalProps) {
  const [selectedBank, setSelectedBank] = useState('tpbank');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const unpaidSessions = useMemo(() => {
    if (!student) return 0;
    return mockAttendance.filter(a => a.studentId === student.id && a.status === 'PRESENT' && !a.isPaid).length;
  }, [student]);

  const totalFee = useMemo(() => {
    if (!student) return 0;
    return unpaidSessions * (student.pricePerSession ?? 180000);
  }, [student, unpaidSessions]);

  React.useEffect(() => {
    if (isOpen && totalFee > 0) {
      setPaymentAmount(totalFee);
    }
    if (!isOpen) {
      setNotes('');
    }
  }, [isOpen, totalFee]);

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden bg-white border-none shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-3xl outline-none ring-0">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#1e2227] to-[#2d3436] text-white relative">
          <button 
             onClick={onClose}
             className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold border border-gold-500/30 shrink-0">
               <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Thu phí học viên</h2>
              <p className="text-[13px] text-white/60 font-medium mt-0.5">
                {student.name} • Lớp {student.class}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Summary Info */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[12px] font-medium text-gray-500 mb-1">Số buổi chưa đóng</p>
                <div className="flex items-end gap-2">
                   <span className="text-xl font-bold text-gray-800">{unpaidSessions}</span>
                   <span className="text-[11px] text-gray-400 font-medium mb-1 truncate">Buổi</span>
                </div>
             </div>
             <div className="bg-gold-50 rounded-2xl p-4 border border-gold-100">
                <p className="text-[12px] font-medium text-gold-700 mb-1">Tổng tiền cần thu</p>
                <div className="flex items-end gap-2">
                   <span className="text-xl font-bold text-gold-700 tabular-nums">{totalFee.toLocaleString('vi-VN')}</span>
                   <span className="text-[11px] text-gold-600 font-bold mb-1 truncate">VNĐ</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            {/* Amount input */}
            <div className="space-y-2">
               <label className="text-[13px] font-bold text-gray-700">Số tiền thu thực tế</label>
               <div className="relative group">
                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-600 transition-colors" size={18} />
                 <Input 
                   type="number"
                   value={paymentAmount}
                   onChange={(e) => setPaymentAmount(Number(e.target.value))}
                   className="h-14 pl-12 font-bold text-lg text-[#1e2227] border-gray-200 bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all rounded-2xl"
                 />
               </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
               <label className="text-[13px] font-bold text-gray-700">Hình thức thanh toán</label>
               <div className="grid grid-cols-2 gap-3">
                 {BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl border text-[13px] font-bold transition-all text-left",
                        selectedBank === bank.id 
                          ? bank.color || "bg-gold-50 text-gold-700 border-gold-200 shadow-sm"
                          : "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <span className="text-lg">{bank.icon}</span>
                      <span className="truncate">{bank.name}</span>
                    </button>
                 ))}
               </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
               <label className="text-[13px] font-bold text-gray-700">Ghi chú thêm</label>
               <Textarea 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder="Ví dụ: Phụ huynh nộp trước một nửa..."
                 className="text-[13px] p-4 border-gray-200 bg-white focus:border-gold-500 rounded-2xl min-h-[100px] resize-none focus:ring-4 focus:ring-gold-500/10 transition-all"
               />
            </div>
          </div>

          <Button
             className="w-full h-14 bg-[#1e2227] hover:bg-[#2d3436] text-white font-bold text-sm gap-2 shadow-xl shadow-gray-200 border-none rounded-2xl mt-2 transition-all active:scale-[0.98]"
             onClick={() => {
               onSave?.({ amount: paymentAmount, method: selectedBank, note: notes });
               onClose();
             }}
           >
             <CreditCard className="w-5 h-5" />
             Xác nhận thu tiền
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

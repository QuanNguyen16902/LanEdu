import React, { useState, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { mockAttendance, Student } from '@/services/mockData';
import { Printer, Save, GraduationCap, CalendarDays, Wallet, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PaymentSlipModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSlipModal({ student, isOpen, onClose }: PaymentSlipModalProps) {
  const [pricePerSession, setPricePerSession] = useState(200000);
  const [notes, setNotes] = useState('');
  const [month, setMonth] = useState('Tháng 3');

  const attendanceDates = useMemo(() => {
    if (!student) return [];
    return mockAttendance
      .filter(a => a.studentId === student.id && a.status === 'PRESENT')
      .map(a => a.date)
      .sort();
  }, [student]);

  const numSessions = attendanceDates.length;
  const totalFee = numSessions * pricePerSession;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('payment-slip');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Phieu_Hoc_Phi_${student.name.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[95vh] overflow-y-auto p-0 border-none bg-gray-50">
        <div className="p-4 print:p-0 print:bg-white">
          {/* Payment Slip UI */}
          <div id="payment-slip" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 -trangray-y-1/4 trangray-x-1/4">
                <GraduationCap size={120} />
              </div>
              <h3 className="text-sm font-bold tracking-widest uppercase opacity-80 mb-1">LỚP TIẾNG ANH CÔ LAN</h3>
              <h2 className="text-xl font-black mb-1">PHIẾU HỌC PHÍ</h2>
              <p className="text-emerald-100 text-xs font-medium">{month} / 2026</p>
            </div>

            <div className="p-5 space-y-5">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Học sinh</p>
                  <p className="text-base font-bold text-gray-900">{student.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phụ huynh</p>
                  <p className="text-base font-bold text-gray-900">Phụ huynh {student.name.split(' ').pop()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Học phí / buổi</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={pricePerSession} 
                      onChange={(e) => setPricePerSession(Number(e.target.value))}
                      className="h-8 w-32 font-bold text-gray-900 print:border-none print:p-0"
                    />
                    <span className="text-sm font-medium text-gray-500">VNĐ</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số buổi học</p>
                  <p className="text-lg font-bold text-gray-900">{numSessions} buổi</p>
                </div>
              </div>

              {/* Total Fee Card */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-0.5">
                  <Wallet size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tổng học phí</span>
                </div>
                <h2 className="text-3xl font-black text-emerald-700">
                  {totalFee.toLocaleString('vi-VN')} <span className="text-lg">VNĐ</span>
                </h2>
              </div>

              {/* Attendance Dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <CalendarDays size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Ngày đi học</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attendanceDates.length > 0 ? (
                    attendanceDates.map(date => (
                      <span key={date}>
                        <Badge variant="neutral" className="bg-gray-100 text-gray-600 border-none px-3 py-1 rounded-full font-bold text-[11px]">
                          {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </Badge>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có dữ liệu điểm danh</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nhận xét của giáo viên</h4>
                <Textarea 
                  placeholder="Nhập nhận xét về tình hình học tập của học sinh..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm italic print:border-none print:p-0 print:bg-transparent"
                />
              </div>

              {/* Footer Signatures */}
              <div className="grid grid-cols-2 pt-4 border-t border-gray-100 text-center">
                <div className="space-y-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Người lập phiếu</p>
                  <p className="text-sm font-bold text-gray-900">Cô Quỳnh</p>
                </div>
                <div className="space-y-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Phụ huynh xác nhận</p>
                  <p className="text-gray-200">................................</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-white border-t border-gray-200 sticky bottom-0 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>Hủy</Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
              <Printer size={14} />
              In phiếu
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleExportPDF}>
              <FileDown size={14} />
              Xuất PDF
            </Button>
            <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
              <Save size={14} />
              Lưu phiếu
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

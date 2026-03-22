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
  const [month] = useState('Tháng 3');

  const attendanceDates = useMemo(() => {
    if (!student) return [];
    return mockAttendance
      .filter(a => a.studentId === student.id && a.status === 'PRESENT')
      .map(a => a.date)
      .sort();
  }, [student]);

  const numSessions = attendanceDates.length;
  const totalFee = numSessions * pricePerSession;

  const presetNotes = `Con học về chủ đề: "Các con vật - Animals".
- Con nắm được từ vựng, có thể đọc, viết và sử dụng từ được học vào giao tiếp.
- Có thể miêu tả khả năng của các con vật. VD: A cat can walk. (Con mèo có thể đi).
- Trên lớp con ngoan, luôn năng nổ tham gia vào các hoạt động của lớp.`;

  // Reset price when student changes
  React.useEffect(() => {
    if (student?.pricePerSession) {
      setPricePerSession(student.pricePerSession);
    }
  }, [student?.id, student?.pricePerSession]);

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
      <DialogContent className="max-w-[380px] p-0 border-none bg-white overflow-hidden rounded-3xl max-h-[98vh] flex flex-col">
        <div id="payment-slip" className="bg-white overflow-y-auto flex-1">
          {/* Header */}
          <div className="bg-[#41B3A3] pt-5 pb-4 px-5 text-white text-center">
            <h3 className="text-[11px] font-medium tracking-tight mb-1 flex items-center justify-center gap-2">
              🌈 LỚP TIẾNG ANH CÔ LAN 🌈
            </h3>
            <h2 className="text-[18px] font-bold mb-0.5 tracking-tight">PHIẾU HỌC PHÍ</h2>
            <p className="text-white/90 text-[12px]">{month} / 2026</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Main Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-gray-100/50">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">🧸</span>
                  <span className="text-[13px] font-medium">Học sinh</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">{student.name}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100/50">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">💎</span>
                  <span className="text-[13px] font-medium">Học phí / buổi</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">{pricePerSession.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100/50">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-base">📝</span>
                  <span className="text-[13px] font-medium">Số buổi học</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">{numSessions} buổi</span>
              </div>
            </div>

            {/* Total Fee Card */}
            <div className="bg-[#F0FDFA] border-2 border-[#CCFBF1] rounded-xl p-4 text-center shadow-sm">
              <p className="text-[#3E7E74] text-[11px] font-bold tracking-[0.1em] uppercase mb-0.5">TỔNG HỌC PHÍ</p>
              <h2 className="text-[28px] font-black text-[#1F5F55] leading-tight flex items-center justify-center gap-1">
                {totalFee.toLocaleString('vi-VN')} <span className="text-xl font-bold italic">đ</span>
              </h2>
            </div>

            {/* Attendance Dates */}
            <div className="text-center space-y-2">
              <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">NGÀY ĐI HỌC</h4>
              <div className="flex flex-wrap justify-center gap-1.5">
                {attendanceDates.length > 0 ? (
                  attendanceDates.map(date => (
                    <div 
                      key={date}
                      className="bg-[#F0FDFA] border border-[#CCFBF1] text-[#3E7E74] px-2 py-0.5 rounded-md font-bold text-[11px]"
                    >
                      {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Chưa có dữ liệu điểm danh</p>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-1.5">
              <p className="text-center text-[#B45309] text-[10px] font-bold tracking-widest">--- NHẬN XÉT ---</p>
              <div className="bg-[#FEFCE8] border border-[#FEF9C3] rounded-xl p-3 text-[11px] text-[#451A03] leading-[1.5] shadow-sm">
                {presetNotes.split('\n').map((line, i) => (
                  <p key={i} className={cn(i > 0 && line.startsWith('-') ? "mt-0.5" : i > 0 ? "mt-1" : "")}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-center print:hidden shrink-0">
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-gray-200 text-gray-600 hover:bg-white text-xs" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-teal-100 text-teal-700 bg-teal-50 hover:bg-teal-100 text-xs" onClick={handleExportPDF}>
              <FileDown size={12} className="mr-1.5" />
              Tải xuống
            </Button>
            <Button size="sm" className="h-8 px-3 rounded-lg bg-[#41B3A3] hover:bg-[#348F82] text-white text-xs" onClick={handlePrint}>
              <Printer size={12} className="mr-1.5" />
              In phiếu
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

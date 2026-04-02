import React from 'react';
import { Receipt, Calendar, CreditCard, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Student, AttendanceRecord } from '@/services/mockData';

interface StudentDetailPanelProps {
  isOpen: boolean;
  student: Student | null;
  records: AttendanceRecord[];
  getTotalUnpaidSessions: (studentId: string) => number;
  onOpenPaymentModal: (student: Student) => void;
  onClose: () => void;
}

export function StudentDetailPanel({
  isOpen,
  student,
  records,
  getTotalUnpaidSessions,
  onOpenPaymentModal,
  onClose
}: StudentDetailPanelProps) {
  return (
    <div className={cn(
      "bg-white transition-all duration-300 ease-in-out shrink-0 overflow-hidden shadow-[-4px_0_15px_rgba(0,0,0,0.03)] relative",
      isOpen && student ? "w-[340px] border-l border-gray-100 opacity-100" : "w-0 border-none opacity-0"
    )}>
      <div className="w-[340px] h-full flex flex-col absolute top-0 right-0">
        {student && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 text-gray-900 shadow-sm relative z-10">
              <div className="flex items-center gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-[15px] leading-tight truncate pr-4">{student.name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-1 flex items-center gap-1.5 opacity-90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 
                    {student.id}
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-5">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase">
                    <Receipt className="w-3 h-3" />
                    Thông tin học phí
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gold-200 transition-colors">
                      <span className="text-[11px] font-medium text-gray-500">Số buổi chưa đóng</span>
                      <span className="text-[13px] font-bold text-rose-600">{getTotalUnpaidSessions(student.id)} buổi</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gold-200 transition-colors">
                      <span className="text-[11px] font-medium text-gray-500">Tổng tiền nợ</span>
                      <span className="text-[13px] font-bold text-gray-900">
                         {(getTotalUnpaidSessions(student.id) * (student.pricePerSession || 180000)).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>

                

                <div>
                  <h4 className="text-[11px] font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase">
                    <Calendar className="w-3 h-3" />
                    Lịch sử điểm danh (5 buổi)
                  </h4>
                  <div className="space-y-2 bg-white border border-gray-100 rounded-xl p-1">
                    {records.filter(r => r.studentId === student.id).slice(0, 5).map(record => (
                      <div key={record.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 group">
                        <span className="text-[11px] text-gray-500 font-medium group-hover:text-gold-700 transition-colors">
                          {record.date.split('-').reverse().join('/')}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          record.status === 'PRESENT' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {record.status === 'PRESENT' ? 'CÓ MẶT' : 'VẮNG'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase">
                    <MessageSquare className="w-3 h-3" />
                    Nhận xét chung
                  </h4>
                  
                    <div className="flex gap-2">
                       <textarea 
                         placeholder="Thêm nhận xét..." 
                         className="flex-1 text-[11px] bg-white border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                       />
                       <Button size="sm" className="h-auto py-1.5 px-3 bg-[#1e2227] hover:bg-[#2d3436] text-white text-[10px] rounded-md font-bold transition-all">Lưu</Button>
                    </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-2 shrink-0">
              <Button 
                className="flex-1 bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-white font-bold h-10 rounded-xl shadow-md shadow-gold-500/20 transition-all"
                onClick={() => onOpenPaymentModal(student)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Tạo phiếu thu
              </Button>
              <Button 
                 variant="outline"
                 className="h-10 w-10 p-0 rounded-xl text-gray-500 hover:text-gray-900 border-gray-200 bg-white"
                 onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Calendar, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { mockAttendance } from '@/services/mockData';

interface AttendanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export function AttendanceDetailsModal({ isOpen, onClose, student }: AttendanceDetailsModalProps) {
  if (!student) return null;

  const currentMonth = '2026-03';
  const records = mockAttendance.filter(a => a.studentId === student.id && a.date.startsWith(currentMonth));
  const stats = {
    present: records.filter(r => r.status === 'PRESENT').length,
    late: records.filter(r => r.status === 'LATE').length,
    absent: records.filter(r => r.status === 'ABSENT').length,
    total: records.length,
  };

  const daysInMonth = 31;
  const firstDay = new Date(2026, 2, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[680px] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl">
        <DialogHeader className="p-5 bg-gradient-to-br from-gold-500 to-amber-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Chi tiết điểm danh
              </DialogTitle>
              <p className="text-[11px] opacity-90 mt-1 font-medium italic">
                Học sinh: {student.name} • {student.id}
              </p>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
              Tháng 03/2026
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Có mặt', value: stats.present },
              { label: 'Đi muộn', value: stats.late },
              { label: 'Tỷ lệ', value: `${stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%` },
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">{item.label}</p>
                <p className="text-xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">Lịch chuyên cần</h3>
            <div className="flex gap-4">
              {[['emerald', 'Đủ'], ['amber', 'Muộn'], ['rose', 'Vắng']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
                  <span className="text-[9px] font-bold text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-1">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {days.map(day => {
              const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
              const rec = records.find(r => r.date === dateStr);
              return (
                <div
                  key={day}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] font-bold transition-all relative',
                    rec?.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    rec?.status === 'LATE' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    rec?.status === 'ABSENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-gray-50 text-gray-400'
                  )}
                >
                  {day}
                  {rec && (
                    <span className={cn(
                      'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white',
                      rec.status === 'PRESENT' ? 'bg-emerald-500' :
                      rec.status === 'LATE' ? 'bg-amber-500' : 'bg-rose-500'
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-900 uppercase mb-3">Nhật ký gần đây</div>
            <ScrollArea className="h-32">
              <div className="space-y-2 pr-4">
                {records.slice().reverse().map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 border border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">
                        {new Date(r.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-[9px] text-gray-400">Giờ vào: 17:30</span>
                    </div>
                    <Badge
                      variant="neutral"
                      className={cn(
                        'text-[9px] px-2 h-4 border-none font-bold uppercase',
                        r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      )}
                    >
                      {r.status === 'PRESENT' ? 'CÓ MẶT' : r.status === 'LATE' ? 'MUỘN' : 'VẮNG'}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 border-gray-200 h-8 text-[11px] font-bold px-6 shadow-none">
            ĐÓNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

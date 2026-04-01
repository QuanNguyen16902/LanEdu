import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Search, 
  Clock, 
  Users,
  CalendarCheck,
  CheckCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { mockStudents, mockSchedules, Student, AttendanceRecord, mockAttendance } from '@/services/mockData';
import { toast } from 'sonner';

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAttendanceModal({ isOpen, onClose }: QuickAttendanceModalProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(mockSchedules[0]?.class || null);
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const classes = useMemo(() => mockSchedules, []);
  
  const students = useMemo(() => {
    if (!selectedClass) return [];
    return mockStudents.filter(s => s.class === selectedClass);
  }, [selectedClass]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    setRecords(prev => {
      const existing = prev.findIndex(r => r.studentId === studentId && r.date === today);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], status };
        return next;
      }
      return [...prev, { 
        id: `qa-${Date.now()}-${studentId}`, 
        studentId, 
        date: today, 
        status, 
        classId: selectedClass || '' 
      }];
    });
  };

  const handleMarkAll = () => {
    if (!selectedClass) return;
    const next = [...records];
    students.forEach(s => {
      const idx = next.findIndex(r => r.studentId === s.id && r.date === today);
      if (idx >= 0) {
        next[idx] = { ...next[idx], status: 'PRESENT' };
      } else {
        next.push({ id: `qa-${Date.now()}-${s.id}`, studentId: s.id, date: today, status: 'PRESENT', classId: selectedClass || '' });
      }
    });
    setRecords(next);
    toast.success(`Đã đánh diện tất cả lớp ${selectedClass}`);
  };

  const resetModal = () => {
    setSelectedClass(mockSchedules[0]?.class || null);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) { onClose(); setTimeout(resetModal, 300); } }}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-xl outline-none ring-0">
        <DialogHeader className="px-4 py-2 border-b border-gray-50 bg-white">
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3 bg-gold-400 rounded-full" />
              <DialogTitle className="text-[12px] font-bold text-gray-900 tracking-tight uppercase">
                Điểm danh hằng ngày
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[9px] font-black text-gray-400">
              <CalendarCheck className="w-2.5 h-2.5 text-gold-500" />
              {today.split('-').reverse().join('/')}
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[450px] overflow-hidden">
          {/* LEFT PANEL - CLASS LIST */}
          <div className="w-[200px] border-r border-gray-50 bg-gray-50/20 flex flex-col">
            <div className="p-2 border-b border-gray-50 bg-white/50">
              <span className="text-[12px] font-black text-gray-400 pl-1">Lớp giảng dạy</span>
            </div>
            <ScrollArea className="flex-1 p-1">
              <div className="space-y-0.5">
                {classes.map((cls) => {
                  const studentCount = mockStudents.filter(s => s.class === cls.class).length;
                  const isActive = selectedClass === cls.class;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.class)}
                      className={cn(
                        "w-full flex flex-col p-2 rounded transition-all text-left border border-transparent",
                        isActive 
                          ? "bg-white border-gold-100 shadow-sm ring-1 ring-gold-50" 
                          : "hover:bg-gray-100/50 grayscale hover:grayscale-0"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[11px] font-bold",
                          isActive ? "text-gold-700" : "text-gray-600"
                        )}>Lớp {cls.class}</span>
                        <span className="text-[8px] font-black text-gray-300">{studentCount}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium tabular-nums">{cls.time.split(' - ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT PANEL - STUDENT LIST */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedClass ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-gray-900">Học sinh lớp {selectedClass}</span>
                    <button 
                      onClick={handleMarkAll}
                      className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 decoration-emerald-200 underline underline-offset-2 ml-4"
                    >
                      TẤT CẢ CÓ MẶT
                    </button>
                  </div>
                  <div className="relative w-32">
                    <Search className="absolute left-1.5 top-1.5 w-2.5 h-2.5 text-gray-300 pointer-events-none" />
                    <input 
                      placeholder="Tìm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-6 pl-5 pr-2 bg-gray-50/50 border border-transparent rounded-sm text-[10px] outline-none focus:bg-white focus:border-gold-200 transition-all font-medium"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1 p-1">
                  <div className="grid grid-cols-2 gap-0.5">
                    {filteredStudents.map((s) => {
                      const record = records.find(r => r.studentId === s.id && r.date === today);
                      return (
                        <div key={s.id} className="flex items-center justify-between p-1.5 hover:bg-gray-50/40 rounded border border-transparent transition-all">
                          <div className="flex items-center gap-1.5 flex-grow min-w-0">
                            <div className={cn(
                              "w-0.5 h-5 shrink-0 rounded-full",
                              record?.status === 'PRESENT' ? "bg-emerald-500" : record?.status === 'ABSENT' ? "bg-rose-500" : "bg-gray-200 shadow-inner"
                            )} />
                            <div className="truncate">
                              <p className="text-[10px] font-bold text-gray-700 truncate">{s.name}</p>
                              <p className="text-[8px] text-gray-400 font-mono tracking-tighter uppercase">{s.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0 ml-1">
                            <button
                              onClick={() => handleStatusChange(s.id, 'PRESENT')}
                              className={cn(
                                "px-1.5 h-4.5 rounded-sm text-[8px] font-bold transition-all border",
                                record?.status === 'PRESENT' 
                                  ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" 
                                  : "bg-white text-gray-300 border-gray-100 hover:text-emerald-600"
                              )}
                            >
                              MẶT
                            </button>
                            <button
                              onClick={() => handleStatusChange(s.id, 'ABSENT')}
                              className={cn(
                                "px-1.5 h-4.5 rounded-sm text-[8px] font-bold transition-all border",
                                record?.status === 'ABSENT' 
                                  ? "bg-rose-500 text-white border-rose-600 shadow-sm" 
                                  : "bg-white text-gray-300 border-gray-100 hover:text-rose-600"
                              )}
                            >
                              VẮNG
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="p-2 border-t border-gray-50 bg-gray-50/10 flex justify-end">
                   <Button 
                    className="bg-gray-900 border-none hover:bg-black text-white px-6 h-7 text-[10px] font-bold rounded shadow-sm"
                    onClick={onClose}
                  >
                    HOÀN TẤT ĐIỂM DANH
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-20">
                <Users className="w-8 h-8" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Chọn lớp để điểm danh</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

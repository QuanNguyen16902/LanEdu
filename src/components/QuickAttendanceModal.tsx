import React, { useState, useMemo } from 'react';
import { 
  Search,
  Check,
  X,
  UserCircle,
  CheckCircle2
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
import { mockStudents, mockSchedules, AttendanceRecord, mockAttendance } from '@/services/mockData';

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const classMapping: Record<string, string> = {
  '6 Moon': '6a1',
  '6 Star': '6a2',
  '6 Galaxy': '6a3',
  '7 Sun': '7a1',
  '7 Venus': '7a2'
};

export function QuickAttendanceModal({ isOpen, onClose }: QuickAttendanceModalProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(mockSchedules[0]?.class || null);
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const classes = useMemo(() => mockSchedules, []);
  
  const students = useMemo(() => {
    if (!selectedClass) return [];
    const classId = classMapping[selectedClass] || selectedClass;
    return mockStudents.filter(s => s.class === classId || s.class === selectedClass);
  }, [selectedClass]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    const classId = selectedClass ? (classMapping[selectedClass] || selectedClass) : '';
    const classRecords = records.filter(r => (r.classId === classId || r.classId === selectedClass) && r.date === today);
    const present = classRecords.filter(r => r.status === 'PRESENT').length;
    const absent = classRecords.filter(r => r.status === 'ABSENT').length;
    return { present, absent, total: students.length };
  }, [records, selectedClass, students, today]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    const classId = selectedClass ? (classMapping[selectedClass] || selectedClass) : '';
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
        classId: classId
      }];
    });
  };

  const handleMarkAll = () => {
    if (!selectedClass) return;
    const classId = classMapping[selectedClass] || selectedClass;
    const next = [...records];
    students.forEach(s => {
      const idx = next.findIndex(r => r.studentId === s.id && r.date === today);
      if (idx >= 0) {
        next[idx] = { ...next[idx], status: 'PRESENT' };
      } else {
        next.push({ id: `qa-${Date.now()}-${s.id}`, studentId: s.id, date: today, status: 'PRESENT', classId: classId });
      }
    });
    setRecords(next);
  };

  const resetModal = () => {
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) { onClose(); setTimeout(resetModal, 300); } }}>
      <DialogContent className="max-w-[780px] p-0 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm font-sans">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex flex-row items-center justify-between mt-0">
          <DialogTitle className="text-[16px] font-medium text-gray-900 tracking-normal m-0">Điểm danh nhanh</DialogTitle>
          <button 
             onClick={onClose}
             className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div className="flex h-[520px]">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-gray-200 bg-gray-50/30 flex flex-col">
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 mb-2 px-2">Danh sách lớp</p>
              <ScrollArea className="h-[430px]">
                <div className="space-y-1">
                  {classes.map((cls) => {
                    const isActive = selectedClass === cls.class;
                    const classId = classMapping[cls.class] || cls.class;
                    const classStudents = mockStudents.filter(s => s.class === classId || s.class === cls.class);
                    const isCompleted = classStudents.length > 0 && classStudents.every(s => 
                       records.some(r => r.studentId === s.id && r.date === today)
                    );
                    
                    return (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.class)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors text-left",
                          isActive 
                            ? "bg-teal-50 text-teal-800 font-medium" 
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <span className="truncate">Lớp {cls.class}</span>
                        {isCompleted && <CheckCircle2 className={cn("w-4 h-4 shrink-0", isActive ? "text-teal-600" : "text-teal-500/70")} />}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-5 pb-4 border-b border-gray-100 flex items-end justify-between">
              <div>
                <h2 className="text-[18px] font-medium text-gray-900 mb-1">Lớp {selectedClass}</h2>
                <div className="flex gap-4 text-xs font-normal text-gray-500 mt-2">
                  <span>Sĩ số: {stats.total}</span>
                  <span>Có mặt: <b className="text-teal-700 font-medium">{stats.present}</b></span>
                  <span>Vắng: <b className="text-gray-700 font-medium">{stats.absent}</b></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-3 w-[180px] bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-gray-400"
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-8 px-3 text-[13px] bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-normal shadow-sm"
                  onClick={handleMarkAll}
                >
                  <Check className="w-4 h-4 mr-1.5 text-teal-600" />
                  Có mặt tất cả
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-5">
              <div className="space-y-0 text-sm">
                {filteredStudents.map((student) => {
                  const record = records.find(r => r.studentId === student.id && r.date === today);
                  const status = record?.status;

                  return (
                    <div key={student.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-1 -mx-1">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200/50">
                           <UserCircle className="w-5 h-5 opacity-50" />
                         </div>
                         <div>
                           <div className="font-medium text-gray-900">{student.name}</div>
                           <div className="text-xs text-gray-500">{student.id}</div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          className={cn(
                            "px-3 h-7 text-xs font-medium rounded border transition-colors",
                            status === 'PRESENT' 
                              ? "bg-teal-50 border-teal-200 text-teal-700" 
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          )}
                        >
                          Có mặt
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'LATE')}
                          className={cn(
                            "px-3 h-7 text-xs font-medium rounded border transition-colors",
                            status === 'LATE' 
                              ? "bg-amber-50 border-amber-200 text-amber-700" 
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          )}
                        >
                          Đến muộn
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          className={cn(
                            "px-3 h-7 text-xs font-medium rounded border transition-colors",
                            status === 'ABSENT' 
                              ? "bg-gray-100 border-gray-300 text-gray-800" 
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          )}
                        >
                          Vắng mặt
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    Không tìm thấy học sinh.
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
               <span className="text-xs text-gray-500 mr-auto">Hệ thống sẽ tự động lưu sau mỗi thao tác.</span>
               <Button 
                 variant="outline" 
                 className="h-8 px-4 text-[13px] font-normal border-gray-200"
                 onClick={onClose}
               >
                 Đóng
               </Button>
               <Button 
                 className="h-8 px-5 bg-teal-600 hover:bg-teal-700 text-white text-[13px] font-medium shadow-sm border-0"
                 onClick={onClose}
               >
                 Hoàn tất
               </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

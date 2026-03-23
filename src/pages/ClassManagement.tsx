import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Folder,
  ChevronRight,
  Download,
  MoreHorizontal,
  Receipt,
  UserCheck,
  Eye,
  MoreVertical,
  Filter,
  RefreshCw,
  Edit2,
  Calendar,
  CheckCircle,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { PaymentSlipModal } from '@/components/PaymentSlipModal';
import { Student, mockAttendance, mockStudents } from '@/services/mockData';
import { ManagementSidebar } from '@/components/ManagementSidebar';

// CLASSES_TREE is kept here as it's UI specific for the sidebar
const CLASSES_TREE = [
  {
    id: 'k6',
    name: 'Khối 6',
    children: [
      { id: '6a1', name: '6 Moon' },
      { id: '6a2', name: '6 Star' },
      { id: '6a3', name: '6 Galaxy' },
    ]
  },
  {
    id: 'k7',
    name: 'Khối 7',
    children: [
      { id: '7a1', name: '7 Sun' },
      { id: '7a2', name: '7 Venus' },
    ]
  }
];

export default function ClassManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState('danh-sach-lop');
  const [selectedClass, setSelectedClass] = useState<string | null>(searchParams.get('class') || '7a1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForSlip, setSelectedStudentForSlip] = useState<Student | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [editingStudentIds, setEditingStudentIds] = useState<Set<string>>(new Set());

  // Tabs Union State
  const [activeTab, setActiveTab] = useState<'list' | 'attendance'>(() => {
    return (sessionStorage.getItem('classManagementTab') as 'list' | 'attendance') || 'list';
  });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState(mockAttendance);

  React.useEffect(() => {
    sessionStorage.setItem('classManagementTab', activeTab);
  }, [activeTab]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesClass = !selectedClass || s.class.toLowerCase() === selectedClass.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [selectedClass, searchQuery, students]);

  const handleStatusChange = (studentId: string, status: any) => {
    setRecords(prev => {
      const existingIndex = prev.findIndex(r => r.studentId === studentId && r.date === attendanceDate);
      if (existingIndex >= 0) {
        const newRecords = [...prev];
        newRecords[existingIndex] = { ...newRecords[existingIndex], status };
        return newRecords;
      }
      return [...prev, {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        date: attendanceDate,
        status,
        classId: selectedClass || ''
      }];
    });
  };

  const markAllPresent = () => {
    const newRecords = [...records];
    filteredStudents.forEach(student => {
      const existingIndex = newRecords.findIndex(r => r.studentId === student.id && r.date === attendanceDate);
      if (existingIndex >= 0) {
        newRecords[existingIndex] = { ...newRecords[existingIndex], status: 'PRESENT' };
      } else {
        newRecords.push({
          id: `att-${Date.now()}-${student.id}`,
          studentId: student.id,
          date: attendanceDate,
          status: 'PRESENT',
          classId: selectedClass || ''
        });
      }
    });
    setRecords(newRecords);
    toast.success("Đã đánh dấu tất cả có mặt");
  };

  const currentStats = useMemo(() => {
    const dayRecords = records.filter(r => r.date === attendanceDate && (!selectedClass || r.classId === selectedClass));
    return {
      present: dayRecords.filter(r => r.status === 'PRESENT').length,
      late: dayRecords.filter(r => r.status === 'LATE').length,
      absent: dayRecords.filter(r => r.status === 'ABSENT').length,
      total: filteredStudents.length
    };
  }, [records, attendanceDate, selectedClass, filteredStudents]);

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === filteredStudents.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredStudents.map(s => s.id)));
  };

   // Helper to count sessions
  const getSessionsCount = (studentId: string, monthPrefix?: string) => {
    return records.filter(a => 
      a.studentId === studentId && 
      a.status === 'PRESENT' && 
      (!monthPrefix || a.date.startsWith(monthPrefix))
    ).length;
  };

  const [isAttendanceDetailsOpen, setIsAttendanceDetailsOpen] = useState(false);
  const [viewingAttendanceStudent, setViewingAttendanceStudent] = useState<any>(null);

  const handleCreatePaymentSlip = (student: any) => {
    const mappedStudent: Student = {
      ...student,
      id: student.id,
      name: student.name,
      email: `${student.id}@school.com`,
      class: student.class,
      attendance: 100,
      score: 10,
      pricePerSession: student.pricePerSession,
      sessionsAttended: getSessionsCount(student.id, '2026-03') // Dynamic for March
    };
    setSelectedStudentForSlip(mappedStudent);
    setIsPaymentModalOpen(true);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, pricePerSession: newPrice } : s));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F8FAFC]">
      <ManagementSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-100">
          <Button size="sm" className="w-full h-8 bg-[#E6B800] hover:bg-gold-600 font-medium text-xs text-white rounded-md gap-2 shadow-sm border-none">
            <Plus className="w-3.5 h-3.5" />
            Tạo lớp mới
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2 space-y-0.5">
            {CLASSES_TREE.map((group) => (
              <Collapsible key={group.id} defaultOpen tabIndex={-1}>
                <CollapsibleTrigger className="flex items-center gap-1.5 w-full px-3 py-1.5 text-[12px] font-medium text-gray-800 hover:bg-gray-50 transition-all group outline-none">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform group-data-[state=open]:rotate-90" />
                  <Folder className="w-4 h-4 text-gray-400" />
                  {group.name}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5">
                  {group.children.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                      className={cn(
                        "flex items-center gap-2 w-full pl-9 pr-3 py-1.5 text-[12px] font-normal transition-all border-l-2 outline-none",
                        selectedClass === cls.id
                          ? "text-gold-700 border-gold-500 bg-gold-50/50"
                          : "text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50"
                      )}
                    >
                      {cls.name}
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden py-2">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              Lớp {selectedClass}
            </h1>
            <div className="flex items-center gap-4 mt-1">
               <button 
                onClick={() => setActiveTab('list')}
                className={cn(
                  "text-[12px] font-bold pb-1.5 border-b-2 transition-all",
                  activeTab === 'list' ? "text-gold-600 border-gold-500" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
               >
                 Danh sách học sinh
               </button>
               <button 
                onClick={() => setActiveTab('attendance')}
                className={cn(
                  "text-[12px] font-bold pb-1.5 border-b-2 transition-all",
                  activeTab === 'attendance' ? "text-gold-600 border-gold-500" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
               >
                 Điểm danh hàng ngày
               </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-gray-400 font-medium mr-2">
              {activeTab === 'list' ? `Tổng số: ${filteredStudents.length}` : `Sĩ số: ${filteredStudents.length}`}
            </p>
            <Button variant="outline" size="sm" className="h-6 px-3 text-[11px] font-medium border-gray-200 bg-white gap-2 shadow-none transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" className="h-6 px-3 text-[11px] font-medium border-gray-200 bg-white gap-2 shadow-none transition-all">
              <Filter className="w-3.5 h-3.5" />
              Bộ lọc
            </Button>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <div className="relative">
               <Button
                size="sm"
                className="h-6 px-4 bg-[#1E40AF] hover:bg-blue-900 text-white font-medium text-xs rounded-md shadow-sm border-none gap-2 transition-all"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
              >
                Thao tác
                <ChevronRight className={cn("w-3 h-3 transition-transform", isActionsOpen ? "rotate-[270deg]" : "rotate-90")} />
              </Button>

              {isActionsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsActionsOpen(false)} />
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-30 py-1 overflow-hidden">
                    <button
                      className="w-full text-left px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        if (selectedRows.size === 0) {
                          toast.warning('Vui lòng chọn học sinh để tạo học phí');
                          return;
                        }
                        const firstSelectedId = Array.from(selectedRows)[0];
                        const student = students.find(s => s.id === firstSelectedId) || filteredStudents[0];
                        if (student) handleCreatePaymentSlip(student);
                        setIsActionsOpen(false);
                      }}
                    >
                      <Receipt className="w-3.5 h-3.5 text-gray-400" />
                      Tạo học phí
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-50"
                      onClick={() => {
                        if (selectedRows.size === 0) {
                          toast.warning('Vui lòng chọn học sinh để sửa');
                          return;
                        }
                        const newEditing = new Set(editingStudentIds);
                        selectedRows.forEach(id => newEditing.add(id));
                        setEditingStudentIds(newEditing);
                        setIsActionsOpen(false);
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                      Sửa
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="relative ml-2">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-48 text-[12px] bg-gray-50 border-gray-200 focus:bg-white rounded-md transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {activeTab === 'attendance' && (
          <div className="px-4 py-2 bg-gold-50/30 border-b border-gray-200 flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[11px] font-medium text-gray-600">Có mặt: <b className="text-emerald-700">{currentStats.present}</b></span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                 <span className="text-[11px] font-medium text-gray-600">Đi muộn: <b className="text-amber-700">{currentStats.late}</b></span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                 <span className="text-[11px] font-medium text-gray-600">Vắng mặt: <b className="text-rose-700">{currentStats.absent}</b></span>
               </div>
               <div className="h-3 w-px bg-gray-200" />
               <span className="text-[11px] text-gray-400">Tỷ lệ chuyên cần: <b className="text-gray-900">{currentStats.total > 0 ? Math.round((currentStats.present / currentStats.total) * 100) : 0}%</b></span>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="date" 
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="text-[11px] font-bold border-none focus:ring-0 p-0 h-auto outline-none bg-transparent text-gray-700"
                  />
               </div>
               <Button 
                size="sm" 
                onClick={markAllPresent}
                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-4 rounded-md gap-2 border-none shadow-sm"
               >
                 <CheckCircle className="w-3.5 h-3.5" />
                 Có mặt tất cả
               </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table className="border-collapse table-fixed w-full">
              <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-gray-300">
                <TableRow className="h-10 hover:bg-transparent transition-none border-b border-gray-200">
                  <TableHead className="w-8 px-2 border-r border-gray-200">
                    <Checkbox checked={selectedRows.size === filteredStudents.length} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead className="w-10 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">TT</TableHead>
                  <TableHead className="w-28 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Trạng thái</TableHead>
                  <TableHead className="w-28 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Mã học sinh</TableHead>
                  <TableHead className="w-44 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Họ tên</TableHead>
                  {activeTab === 'attendance' ? (
                     <>
                        <TableHead className="w-[300px] text-center text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Điểm danh</TableHead>
                        <TableHead className="text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Ghi chú</TableHead>
                        <TableHead className="w-28 text-center text-[12px] font-medium text-gray-500 px-3">Giờ điểm danh</TableHead>
                     </>
                  ) : (
                     <>
                        <TableHead className="w-28 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Ngày sinh</TableHead>
                        <TableHead className="w-24 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200">Giới tính</TableHead>
                        <TableHead className="w-16 text-[12px] font-medium text-gray-500 px-3 border-r border-gray-200 text-center">Buổi (M)</TableHead>
                        <TableHead className="w-32 text-right text-[12px] font-medium text-gray-500 px-3">Học phí / buổi</TableHead>
                     </>
                  )}
                </TableRow>
                <TableRow className="h-8 bg-white border-b border-gray-200">
                  <TableCell className="border-r border-gray-200"></TableCell>
                  <TableCell className="border-r border-gray-200"></TableCell>
                  <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  <TableCell className={activeTab === 'attendance' ? "px-2" : "px-2 border-r border-gray-200"}><Search className="w-3 h-3 text-gray-300" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, idx) => (
                  <TableRow key={student.id} className="h-9 hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                    <TableCell className="px-2 border-r border-gray-200">
                      <Checkbox checked={selectedRows.has(student.id)} onCheckedChange={() => toggleRow(student.id)} />
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                    <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.status}</TableCell>
                    <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{student.id}</TableCell>
                    <TableCell className="text-[11px] font-semibold text-gray-900 px-3 border-r border-gray-200">{student.name}</TableCell>
                    
                    {activeTab === 'attendance' ? (
                       <>
                          <TableCell className="px-2 border-r border-gray-200">
                             {(() => {
                                const record = records.find(r => r.studentId === student.id && r.date === attendanceDate);
                                return (
                                   <div className="flex items-center justify-center gap-1">
                                      <button
                                         onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                         className={cn(
                                            "flex-1 py-1 px-1 text-[9px] font-bold rounded transition-all border",
                                            record?.status === 'PRESENT'
                                               ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                                               : "bg-white text-gray-400 border-gray-100 hover:bg-emerald-50 hover:text-emerald-600"
                                         )}
                                      >
                                         CÓ MẶT
                                      </button>
                                      <button
                                         onClick={() => handleStatusChange(student.id, 'LATE')}
                                         className={cn(
                                            "flex-1 py-1 px-1 text-[9px] font-bold rounded transition-all border",
                                            record?.status === 'LATE'
                                               ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                                               : "bg-white text-gray-400 border-gray-100 hover:bg-amber-50 hover:text-amber-600"
                                         )}
                                      >
                                         MUỘN
                                      </button>
                                      <button
                                         onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                         className={cn(
                                            "flex-1 py-1 px-1 text-[9px] font-bold rounded transition-all border",
                                            record?.status === 'ABSENT'
                                               ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                                               : "bg-white text-gray-400 border-gray-100 hover:bg-rose-50 hover:text-rose-600"
                                         )}
                                      >
                                         VẮNG
                                      </button>
                                   </div>
                                );
                             })()}
                          </TableCell>
                          <TableCell className="px-3 border-r border-gray-200">
                             <input 
                              placeholder="Lý do vắng..." 
                              className="text-[11px] bg-transparent border-none outline-none w-full text-gray-500 placeholder:text-gray-200 italic"
                            />
                          </TableCell>
                          <TableCell className="text-center text-[10px] text-gray-400 tabular-nums">
                             {records.some(r => r.studentId === student.id && r.date === attendanceDate) ? "16:40:12" : "--:--:--"}
                          </TableCell>
                       </>
                    ) : (
                       <>
                          <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.dob}</TableCell>
                          <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.gender}</TableCell>
                          <TableCell className="text-[11px] text-gray-900 font-semibold px-3 border-r border-gray-200 text-center">
                             <button
                               onClick={() => {
                                 setViewingAttendanceStudent(student);
                                 setIsAttendanceDetailsOpen(true);
                               }}
                               className="hover:text-gold-600 hover:underline transition-all"
                             >
                               {getSessionsCount(student.id, '2026-03')}
                             </button>
                          </TableCell>
                          <TableCell className="text-[11px] text-gray-900 font-medium px-2 text-right tabular-nums">
                            <div className="flex items-center gap-1 justify-end h-7">
                              {editingStudentIds.has(student.id) ? (
                                <Input
                                  type="number"
                                  value={student.pricePerSession}
                                  onChange={(e) => handlePriceChange(student.id, Number(e.target.value))}
                                  autoFocus
                                  className="h-full w-20 text-[11px] font-semibold bg-white border-gray-200 focus:border-[#E6B800] transition-all p-1"
                                />
                              ) : (
                                <span>
                                  {student.pricePerSession?.toLocaleString('vi-VN')}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 ml-1">đ</span>
                            </div>
                          </TableCell>
                       </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      <PaymentSlipModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={selectedStudentForSlip}
      />

      <AttendanceDetailsModal
        isOpen={isAttendanceDetailsOpen}
        onClose={() => setIsAttendanceDetailsOpen(false)}
        student={viewingAttendanceStudent}
      />
    </div>
  );
}

function AttendanceDetailsModal({ isOpen, onClose, student }: any) {
  if (!student) return null;

  // Use March 2026 for demo consistency
  const currentMonth = "2026-03";
  const records = mockAttendance.filter(a => a.studentId === student.id && a.date.startsWith(currentMonth));
  
  const stats = {
    present: records.filter(r => r.status === 'PRESENT').length,
    late: records.filter(r => r.status === 'LATE').length,
    absent: records.filter(r => r.status === 'ABSENT').length,
    total: records.length
  };

  // Simple calendar generation for 03/2026
  const daysInMonth = 31;
  const firstDay = new Date(2026, 2, 1).getDay(); // Sunday=0
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
                <p className="text-[11px] opacity-90 mt-1 font-medium italic">Học sinh: {student.name} • {student.id}</p>
             </div>
             <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
                Tháng 03/2026
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Có mặt</p>
                <p className="text-xl font-black">{stats.present}</p>
             </div>
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Đi muộn</p>
                <p className="text-xl font-black">{stats.late}</p>
             </div>
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-[9px] uppercase tracking-wider font-bold opacity-80">Tỷ lệ</p>
                <p className="text-xl font-black">{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</p>
             </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
             <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">Lịch chuyên cần</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[9px] font-bold text-gray-400">Đủ</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-amber-500" />
                   <span className="text-[9px] font-bold text-gray-400">Muộn</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 rounded-full bg-rose-500" />
                   <span className="text-[9px] font-bold text-gray-400">Vắng</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-1">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map(day => {
              const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
              const record = records.find(r => r.date === dateStr);
              return (
                <div 
                  key={day} 
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] font-bold transition-all relative",
                    record?.status === 'PRESENT' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    record?.status === 'LATE' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    record?.status === 'ABSENT' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                    "bg-gray-50 text-gray-400"
                  )}
                >
                  {day}
                  {record && (
                    <span className={cn(
                      "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white",
                      record.status === 'PRESENT' ? "bg-emerald-500" :
                      record.status === 'LATE' ? "bg-amber-500" : "bg-rose-500"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
             <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-900 uppercase">
                Nhật ký gần đây
             </div>
             <ScrollArea className="h-32">
                <div className="space-y-2 pr-4">
                   {records.slice().reverse().map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 border border-gray-50">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-800">{new Date(r.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                            <span className="text-[9px] text-gray-400">Giờ vào: 17:30</span>
                         </div>
                         <Badge 
                            variant="neutral" 
                            className={cn(
                               "text-[9px] px-2 h-4 border-none font-bold uppercase",
                               r.status === 'PRESENT' ? "bg-emerald-100 text-emerald-700" :
                               r.status === 'LATE' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                            )}>
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

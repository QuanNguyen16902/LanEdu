import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Folder,
  ChevronRight,
  RefreshCw,
  Calendar,
  CheckCircle,
  GripVertical,
  Trash2,
  MoreVertical,
  Printer,
  UserPlus,
  FileDown,
  ChevronDown,
  Receipt,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Filter,
  X,
  UserCheck,
  Users,
  Clock,
  Edit2
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
import { ClassStudentsTab } from './class-management/ClassStudentsTab';
import { ClassAttendanceTab } from './class-management/ClassAttendanceTab';
import { ClassTuitionTab, TuitionDetailPanel } from './class-management/ClassTuitionTab';
import { AttendanceDetailsModal } from './class-management/AttendanceDetailsModal';
import { EditStudentModal } from './class-management/EditStudentModal';
import { StudentDetailPanel } from './class-management/StudentDetailPanel';
import { AddClassModal } from '@/components/AddClassModal';
import { AddStudentModal } from '@/components/AddStudentModal';
import { classService, Class } from '@/services/classService';
import { studentService } from '@/services/studentService';
import { attendanceService } from '@/services/attendanceService';
import { teacherService } from '@/services/teacherService';
import { Teacher } from '@/types/teacher';

// (Removed hardcoded CLASSES_TREE)

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  month: string;
  amount: number;
  method: string;
  note: string;
  createdAt: string;
}

const METHOD_LABELS: Record<string, string> = {
  cash: 'Tiền mặt',
  tpbank: 'TPBank',
  techcom: 'Techcombank',
  bidv: 'BIDV',
  mbbank: 'MB Bank',
  agribank: 'Agribank',
  vietcom: 'Vietcombank',
  vnpay: 'VNPay',
};

const INITIAL_PAYMENT_RECORDS: PaymentRecord[] = [
  { id: 'PAY-001', studentId: 'ED0119310177', studentName: 'Bùi Anujin Thúy An', class: '7a1', month: '03/2026', amount: 1600000, method: 'tpbank', note: '', createdAt: '15/03/2026' },
  { id: 'PAY-002', studentId: 'ED0119310031', studentName: 'Trần Quý Phương An', class: '7a1', month: '03/2026', amount: 1600000, method: 'cash', note: 'Phụ huynh nộp trực tiếp', createdAt: '18/03/2026' },
];

type ActiveTab = 'list' | 'attendance' | 'payments';

export default function ClassManagementPage() {
  const [searchParams] = useSearchParams();
  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(searchParams.get('class'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Modal states
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceViewType, setAttendanceViewType] = useState<'daily' | 'monthly'>('daily');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [records, setRecords] = useState<any[]>([]); // Initialize with empty but will be fetched

  // Data Fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedClasses, fetchedStudents, fetchedAttendance, fetchedTeachers] = await Promise.all([
        classService.getClasses(),
        studentService.getStudents(selectedClass || undefined),
        attendanceViewType === 'daily' 
          ? attendanceService.getRecords(attendanceDate, selectedClass || undefined)
          : attendanceService.getRecords(undefined, selectedClass || undefined, currentMonth),
        teacherService.getTeachers()
      ]);
      setClasses(fetchedClasses);
      setStudents(fetchedStudents);
      setRecords(fetchedAttendance);
      setTeachers(fetchedTeachers);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, attendanceDate, attendanceViewType, currentMonth]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [editingStudentIds] = useState<Set<string>>(new Set());

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (sessionStorage.getItem('classManagementTab') as ActiveTab) || 'attendance';
  });

  React.useEffect(() => {
    sessionStorage.setItem('classManagementTab', activeTab);
  }, [activeTab]);

  // Detail Panel
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-31');
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(INITIAL_PAYMENT_RECORDS);
  const [paidStudentIds, setPaidStudentIds] = useState<Set<string>>(
    new Set(INITIAL_PAYMENT_RECORDS.map(r => r.studentId))
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);

  // Detail Panel
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  const openDetailPanel = (student: Student) => {
    setSelectedStudentForDetail(student);
    setIsDetailPanelOpen(true);
  };

  React.useEffect(() => {
    if (!selectedMonth) return;
    const [year, month] = selectedMonth.split('-').map(Number);
    // Correctly get 1st and last day of the month
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // Formatting as YYYY-MM-DD for <input type="date">
    const format = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    setFromDate(format(firstDay));
    setToDate(format(lastDay));
  }, [selectedMonth]);

  // Selection action dropdown
  const [isActionOpen, setIsActionOpen] = useState(false);

  const [isAttendanceDetailsOpen, setIsAttendanceDetailsOpen] = useState(false);
  const [viewingAttendanceStudent, setViewingAttendanceStudent] = useState<any>(null);

  // Edit student state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const openAttendanceDetails = (student: Student) => {
    setViewingAttendanceStudent(student);
    setIsAttendanceDetailsOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter(s => {
      const matchesClass = s.class.toLowerCase() === selectedClass.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [selectedClass, searchQuery, students]);

  const filteredPaymentRecords = useMemo(() => {
    if (!selectedClass) return [];
    return paymentRecords.filter(r => 
      r.class.toLowerCase() === selectedClass.toLowerCase() && 
      r.month === (selectedMonth.split('-').reverse().join('/'))
    );
  }, [paymentRecords, selectedClass, selectedMonth]);

  const groupedClasses = useMemo(() => {
    const search = classSearchQuery.toLowerCase();
    const filtered = classes.filter(cls => cls.name.toLowerCase().includes(search));
    
    const groups: Record<string, Class[]> = {};
    
    filtered.forEach(cls => {
      const g = cls.grade || 'unclassified';
      if (!groups[g]) groups[g] = [];
      groups[g].push(cls);
    });

    const getGradeOrder = (g: string) => {
      if (g === 'preschool') return -1;
      if (g === 'university') return 100;
      if (g === 'retail') return 101;
      if (g === 'unclassified') return 102;
      const num = parseInt(g);
      return isNaN(num) ? 99 : num;
    };

    return Object.entries(groups).sort(([a], [b]) => getGradeOrder(a) - getGradeOrder(b));
  }, [classes, classSearchQuery]);

  const getGradeLabel = (g: string) => {
    if (g === 'preschool') return 'Khối Mầm non';
    if (g === 'university') return 'Khối Đại học';
    if (g === 'retail') return 'Lớp Lẻ ngoài';
    if (g === 'unclassified') return 'Chưa phân loại';
    return `Khối ${g}`;
  };

  const currentStats = useMemo(() => {
    const day = records.filter(r => r.date === attendanceDate && (!selectedClass || r.classId === selectedClass));
    return {
      present: day.filter(r => r.status === 'PRESENT').length,
      late: day.filter(r => r.status === 'LATE').length,
      absent: day.filter(r => r.status === 'ABSENT').length,
      total: filteredStudents.length,
    };
  }, [records, attendanceDate, selectedClass, filteredStudents]);

  const selectedClassData = useMemo(() => {
    return classes.find(c => c.id === selectedClass);
  }, [classes, selectedClass]);

  const teacherName = useMemo(() => {
    if (!selectedClassData?.teacherId) return null;
    return teachers.find(t => t.id === selectedClassData.teacherId)?.name;
  }, [selectedClassData, teachers]);

  const taName = useMemo(() => {
    if (!selectedClassData?.taId) return null;
    return teachers.find(t => t.id === selectedClassData.taId)?.name;
  }, [selectedClassData, teachers]);
  // ── Handlers ──────────────────────────────────────────────
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  const handleStatusChange = (studentId: string, status: string) => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === attendanceDate);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], status: status as any };
        return next;
      }
      return [...prev, { id: `att-${studentId}-${attendanceDate}`, studentId, date: attendanceDate, status: status as any, classId: selectedClass || '' }];
    });
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === attendanceDate);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], note };
        return next;
      }
      return [...prev, { id: `att-${studentId}-${attendanceDate}`, studentId, date: attendanceDate, status: 'PRESENT', note, classId: selectedClass || '' }];
    });
  };

  const saveAttendance = async () => {
    if (!selectedClass) {
      toast.error('Vui lòng chọn lớp');
      return;
    }
    
    setIsSavingAttendance(true);
    try {
      // Only save records for the current selected class and date
      const dataToSave = records.filter(r => r.date === attendanceDate && r.classId === selectedClass);
      await attendanceService.bulkUpdate(dataToSave as any);
      toast.success(`Đã lưu điểm danh lớp ${selectedClass} ngày ${attendanceDate}`);
      fetchData(); // Refresh to confirm
    } catch (error: any) {
      toast.error('Lỗi khi lưu điểm danh: ' + error.message);
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const markAllPresent = () => {
    const next = [...records];
    filteredStudents.forEach(s => {
      const idx = next.findIndex(r => r.studentId === s.id && r.date === attendanceDate);
      if (idx >= 0) {
        next[idx] = { ...next[idx], status: 'PRESENT' };
      } else {
        next.push({ id: `att-${Date.now()}-${s.id}`, studentId: s.id, date: attendanceDate, status: 'PRESENT', classId: selectedClass || '' });
      }
    });
    setRecords(next);
    toast.success('Đã đánh dấu tất cả có mặt');
  };

  const getSessionsCount = useCallback((studentId: string) => {
    return records.filter(a => 
      a.studentId === studentId && 
      (a.status === 'PRESENT' || a.status === 'LATE') && 
      a.date >= fromDate && 
      a.date <= toDate
    ).length;
  }, [records, fromDate, toDate]);

  const getTotalUnpaidSessions = useCallback((studentId: string) => {
    return records.filter(a => 
      a.studentId === studentId && 
      (a.status === 'PRESENT' || a.status === 'LATE') && 
      !a.isPaid
    ).length;
  }, [records]);

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === filteredStudents.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredStudents.map(s => s.id)));
  };

  const handleDeleteClass = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp ${name}? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await classService.deleteClass(id);
      setClasses(prev => prev.filter(c => c.id !== id));
      if (selectedClass === id) setSelectedClass(null);
      toast.success(`Đã xóa lớp ${name}`);
    } catch (error: any) {
      toast.error(`Lỗi khi xóa lớp: ${error.message}`);
    }
  };

  const handleEditClass = (cls: Class) => {
    setEditingClass(cls);
    setIsAddClassModalOpen(true);
  };

  const openPaymentModal = (student: Student) => {
    const unpaidRecords = records.filter(a => a.studentId === student.id && (a.status === 'PRESENT' || a.status === 'LATE') && !a.isPaid);
    setSelectedStudentForPayment({
      ...student,
      email: `${student.id}@school.com`,
      attendance: 100,
      score: 10,
      sessionsAttended: unpaidRecords.length,
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSave = (data: { amount: number; method: string; note: string }) => {
    if (!selectedStudentForPayment) return;
    const formattedMonth = selectedMonth.split('-').reverse().join('/');
    
    // Create payment record
    const rec: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      studentId: selectedStudentForPayment.id,
      studentName: selectedStudentForPayment.name,
      class: selectedStudentForPayment.class,
      month: formattedMonth,
      amount: data.amount,
      method: data.method,
      note: data.note,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    
    // Mark sessions as paid (Mock - mark all current unpaid as paid for this student)
    setRecords(prev => prev.map(r => 
      r.studentId === selectedStudentForPayment.id && (r.status === 'PRESENT' || r.status === 'LATE') 
        ? { ...r, isPaid: true } 
        : r
    ));

    setPaymentRecords(prev => [rec, ...prev]);
    toast.success(`Đã thu học phí cho ${selectedStudentForPayment.name}!`);
  };

  const handleDeletePaymentRecord = (id: string) => {
    setPaymentRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      // Recompute paidStudentIds from remaining records
      setPaidStudentIds(new Set(updated.map(r => r.studentId)));
      return updated;
    });
    toast.success('Đã xóa phiếu thu');
  };

  const paymentStats = useMemo(() => {
    const cls = students.filter(s => !selectedClass || s.class === selectedClass);
    const paid = cls.filter(s => paidStudentIds.has(s.id)).length;
    const totalAmount = filteredPaymentRecords.reduce((sum, r) => sum + r.amount, 0);
    return { total: cls.length, paid, pending: cls.length - paid, totalAmount };
  }, [students, selectedClass, paidStudentIds, filteredPaymentRecords]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#EFF2F5]">
      {/* Class tree sidebar */}
      <div className="w-[180px] bg-[#FDFDFD] border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-100">
          <Button 
            onClick={() => setIsAddClassModalOpen(true)}
            size="sm" 
            className="w-full h-8 bg-[#E6B800] hover:bg-gold-600 font-medium text-xs text-white rounded-md gap-2 shadow-sm border-none"
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo lớp mới
          </Button>
          <div className="mt-3 relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm lớp..."
              value={classSearchQuery}
              onChange={(e) => setClassSearchQuery(e.target.value)}
              className="w-full h-7 pl-8 pr-2 text-[11px] bg-gray-100/50 border-none rounded-md focus:ring-1 focus:ring-gold-200 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2 space-y-1">
            {groupedClasses.length === 0 ? (
              <div className="px-4 py-8 text-center text-[10px] text-gray-400 italic">Chưa có lớp học</div>
            ) : (
              <div className="px-2 space-y-1">
                {groupedClasses.map(([grade, clsList]) => (
                  <Collapsible key={grade} defaultOpen className="space-y-0.5">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full px-2 py-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-800 transition-colors group">
                        <div className="flex items-center gap-2">
                           <Folder className="w-3.5 h-3.5 text-gray-400/70" />
                           {getGradeLabel(grade)}
                        </div>
                        <ChevronRight className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-90 text-gray-300" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-0.5 pl-2 border-l border-gray-100 ml-3.5 mt-0.5">
                        {clsList.map(cls => (
                          <div key={cls.id} className="relative group/item">
                            <button
                              onClick={() => setSelectedClass(cls.id)}
                              className={cn(
                                'flex items-center justify-between w-full px-3 py-2 text-[12px] font-normal transition-all rounded-md outline-none',
                                selectedClass === cls.id
                                  ? 'text-gold-700 bg-gold-50/70 font-semibold'
                                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                              )}
                            >
                              <span className="truncate pr-6">{cls.name}</span>
                            </button>
                            
                            {/* Class Actions */}
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClass(cls);
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClass(cls.id, cls.name);
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main content area with Right Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden py-0">

        {/* Header with main title */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-gray-50/50">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-800 leading-tight">
              Danh sách học sinh - {selectedClassData?.name || ''}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[11px] text-gray-500 font-normal">Tổng: {selectedClass ? filteredStudents.length : 0}</p>
              {teacherName && (
                <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
                   <UserCheck className="w-3 h-3 text-gold-600" />
                   <span className="text-[11px] text-gray-600 font-medium">GV: {teacherName}</span>
                </div>
              )}
              {taName && (
                <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
                   <Users className="w-3 h-3 text-slate-400" />
                   <span className="text-[11px] text-slate-500 font-medium">Trợ giảng: {taName}</span>
                </div>
              )}
              {selectedClassData?.schedule && (
                <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
                   <Clock className="w-3 h-3 text-emerald-600" />
                   <span className="text-[11px] text-emerald-700 font-semibold">{selectedClassData.schedule}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  fetchData();
                  toast.success('Dữ liệu đã được cập nhật');
                }}
                className="h-8 px-3 text-[11px] font-semibold border-gray-200 bg-white gap-2 shadow-none rounded-md text-gray-600"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-semibold border-gray-200 bg-white gap-2 shadow-none rounded-md text-gray-600">
                <Filter className="w-3.5 h-3.5" />
                Bộ lọc
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </Button>
            </div>
            
            <Collapsible open={isActionOpen} onOpenChange={setIsActionOpen} className="relative">
              <CollapsibleTrigger asChild>
                <Button size="sm" className="h-8 px-4 text-[11px] font-semibold bg-[#1E40AF] hover:bg-blue-800 text-white gap-2 shadow-sm rounded-md border-none">
                  Thao tác
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-[100] overflow-hidden py-1">
                {[
                  { icon: UserPlus, label: 'Thêm học sinh', color: 'text-emerald-600', onClick: () => setIsAddStudentModalOpen(true) },
                  { icon: FileDown, label: 'Xuất CSV', color: 'text-blue-600' },
                  { icon: Printer, label: 'In danh sách', color: 'text-gray-600' },
                  { icon: Trash2, label: 'Xóa mục chọn', color: 'text-rose-600' }
                ].map((action: any, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        setIsActionOpen(false);
                        if(action.onClick) action.onClick();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[12px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <action.icon className={cn("w-4 h-4", action.color)} />
                    {action.label}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-44 text-[12px] bg-white border-gray-200 focus:bg-white rounded-md transition-all shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Tab Selection (Subheader) */}
        <div className="h-11 border-b border-gray-100 flex items-center px-6 shrink-0 bg-white">
          <div className="flex items-center gap-6">
            {([
              ['list', 'Danh sách học sinh'],
              ['attendance', 'Điểm danh hàng ngày'],
              ['payments', 'Học phí'],
            ] as [ActiveTab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'text-[12px] font-semibold h-full border-b-2 transition-all flex items-center',
                  activeTab === tab
                    ? 'text-gold-600 border-gold-500'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                )}
              >
                {label}
                {tab === 'payments' && filteredPaymentRecords.length > 0 && selectedClass && (
                  <span className="ml-1.5 bg-gold-100 text-gold-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {filteredPaymentRecords.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[50] flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
          )}

          {/* ── TAB: DANH SÁCH HỌC SINH ─────────────────────────────────── */}
          {activeTab === 'list' && (
            <ClassStudentsTab
              selectedClass={selectedClass}
              filteredStudents={filteredStudents}
              searchQuery={searchQuery}
              selectedRows={selectedRows}
              toggleRow={toggleRow}
              toggleAll={toggleAll}
              onOpenDetails={openAttendanceDetails}
              onEdit={openEditModal}
              schedule={selectedClassData?.schedule}
            />
          )}

          {/* ── TAB: ĐIỂM DANH ──────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <ClassAttendanceTab
              attendanceDate={attendanceDate}
              setAttendanceDate={setAttendanceDate}
              viewType={attendanceViewType}
              setViewType={setAttendanceViewType}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              currentStats={currentStats}
              filteredStudents={filteredStudents}
              records={records}
              handleStatusChange={handleStatusChange}
              handleNoteChange={handleNoteChange}
              onMarkAllPresent={markAllPresent}
              onOpenDetails={openAttendanceDetails} 
              onSave={saveAttendance}
              isSaving={isSavingAttendance}          
            />
          )}

          {/* ── TAB: HỌC PHÍ ────────────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <ClassTuitionTab
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              paymentStats={paymentStats}
              filteredStudents={filteredStudents}
              getTotalUnpaidSessions={getTotalUnpaidSessions}
              getSessionsCount={getSessionsCount}
              records={records}
              openPaymentModal={openPaymentModal}
              openDetailPanel={openDetailPanel}
            />
          )}
        </div>

        </div>

        {/* Right Info Panel */}
        <StudentDetailPanel
          isOpen={isDetailPanelOpen}
          student={selectedStudentForDetail}
          records={records}
          getTotalUnpaidSessions={getTotalUnpaidSessions}
          onOpenPaymentModal={openPaymentModal}
          onClose={() => setIsDetailPanelOpen(false)}
        />
      </div>

      {/* Restored Modals */}
      <PaymentSlipModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={selectedStudentForPayment}
        onSave={handlePaymentSave}
      />
      <AttendanceDetailsModal
        isOpen={isAttendanceDetailsOpen}
        onClose={() => setIsAttendanceDetailsOpen(false)}
        student={viewingAttendanceStudent}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={editingStudent}
        onSave={handleEditSave}
      />
      
      {/* New Functionality Modals */}
      <AddClassModal 
        isOpen={isAddClassModalOpen}
        onClose={() => {
          setIsAddClassModalOpen(false);
          setEditingClass(null);
        }}
        editingClass={editingClass}
        onSave={(updatedOrNewClass) => {
          if (editingClass) {
            setClasses(prev => prev.map(c => c.id === updatedOrNewClass.id ? updatedOrNewClass : c));
          } else {
            setClasses(prev => [...prev, updatedOrNewClass]);
            setSelectedClass(updatedOrNewClass.id);
          }
        }}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        classId={selectedClass}
        onSave={(newStudent) => {
          setStudents(prev => [...prev, newStudent]);
        }}
      />
    </div>
  );
}

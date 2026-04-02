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
  X
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
import { ClassStudentsTab } from './class-management/ClassStudentsTab';
import { ClassAttendanceTab } from './class-management/ClassAttendanceTab';
import { ClassTuitionTab, TuitionDetailPanel } from './class-management/ClassTuitionTab';
import { AttendanceDetailsModal } from './class-management/AttendanceDetailsModal';
import { EditStudentModal } from './class-management/EditStudentModal';
import { StudentDetailPanel } from './class-management/StudentDetailPanel';

const CLASSES_TREE = [
  {
    id: 'k6',
    name: 'Khối 6',
    children: [
      { id: '6a1', name: '6 Moon' },
      { id: '6a2', name: '6 Star' },
      { id: '6a3', name: '6 Galaxy' },
    ],
  },
  {
    id: 'k7',
    name: 'Khối 7',
    children: [
      { id: '7a1', name: '7 Sun' },
      { id: '7a2', name: '7 Venus' },
    ],
  },
];

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
  const [activeMenu, setActiveMenu] = useState('danh-sach-lop');
  const [selectedClass, setSelectedClass] = useState<string | null>(searchParams.get('class'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [editingStudentIds] = useState<Set<string>>(new Set());

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (sessionStorage.getItem('classManagementTab') as ActiveTab) || 'attendance';
  });

  React.useEffect(() => {
    sessionStorage.setItem('classManagementTab', activeTab);
  }, [activeTab]);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState(mockAttendance);

  // Payment state
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

  const currentStats = useMemo(() => {
    const day = records.filter(r => r.date === attendanceDate && (!selectedClass || r.classId === selectedClass));
    return {
      present: day.filter(r => r.status === 'PRESENT').length,
      late: day.filter(r => r.status === 'LATE').length,
      absent: day.filter(r => r.status === 'ABSENT').length,
      total: filteredStudents.length,
    };
  }, [records, attendanceDate, selectedClass, filteredStudents]);
  // ── Handlers ──────────────────────────────────────────────
  const handleStatusChange = (studentId: string, status: string) => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.date === attendanceDate);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], status: status as any };
        return next;
      }
      return [...prev, { id: `att-${Date.now()}-${studentId}`, studentId, date: attendanceDate, status: status as any, classId: selectedClass || '' }];
    });
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
      a.status === 'PRESENT' && 
      a.date >= fromDate && 
      a.date <= toDate
    ).length;
  }, [records, fromDate, toDate]);

  const getTotalUnpaidSessions = useCallback((studentId: string) => {
    return records.filter(a => 
      a.studentId === studentId && 
      a.status === 'PRESENT' && 
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

  const openPaymentModal = (student: Student) => {
    const unpaidRecords = records.filter(a => a.studentId === student.id && a.status === 'PRESENT' && !a.isPaid);
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
      r.studentId === selectedStudentForPayment.id && r.status === 'PRESENT' 
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
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F8FAFC]">
      <ManagementSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Class tree sidebar */}
      <div className="w-[150px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-100">
          <Button size="sm" className="w-full h-8 bg-[#E6B800] hover:bg-gold-600 font-medium text-xs text-white rounded-md gap-2 shadow-sm border-none">
            <Plus className="w-3.5 h-3.5" />
            Tạo lớp mới
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2 space-y-0.5">
            {CLASSES_TREE.map(group => (
              <Collapsible key={group.id} defaultOpen tabIndex={-1}>
                <CollapsibleTrigger className="flex items-center gap-1.5 w-full px-3 py-1.5 text-[12px] font-medium text-gray-800 hover:bg-gray-50 transition-all group outline-none">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform group-data-[state=open]:rotate-90" />
                  <Folder className="w-4 h-4 text-gray-400" />
                  {group.name}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5">
                  {group.children.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(cls.id)}
                      className={cn(
                        'flex items-center gap-2 w-full pl-9 pr-3 py-1.5 text-[12px] font-normal transition-all border-l-2 outline-none',
                        selectedClass === cls.id
                          ? 'text-gold-700 border-gold-500 bg-gold-50/50'
                          : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
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

      {/* Main content area with Right Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-white m-2 mr-2 rounded-sm border border-gray-200 shadow-sm overflow-hidden py-0">

        {/* Header with tabs */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">
              Danh sách học sinh - {selectedClass || ''}
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Tổng số: {selectedClass ? filteredStudents.length : 0}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-semibold border-gray-200 bg-white gap-2 shadow-none rounded-md text-gray-600">
                <RefreshCw className="w-3.5 h-3.5" />
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
                <Button size="sm" className="h-8 px-4 text-[11px] font-bold bg-[#1E40AF] hover:bg-blue-800 text-white gap-2 shadow-sm rounded-md border-none">
                  Thao tác
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-[100] overflow-hidden py-1">
                {[
                  { icon: UserPlus, label: 'Thêm học sinh', color: 'text-emerald-600' },
                  { icon: FileDown, label: 'Xuất CSV', color: 'text-blue-600' },
                  { icon: Printer, label: 'In danh sách', color: 'text-gray-600' },
                  { icon: Trash2, label: 'Xóa mục chọn', color: 'text-rose-600' }
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => setIsActionOpen(false)}
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
        <div className="h-10 border-b border-gray-100 flex items-center px-4 shrink-0 bg-white">
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
                  'text-[12px] font-bold h-full border-b-2 transition-all flex items-center',
                  activeTab === tab
                    ? 'text-gold-600 border-gold-500'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                )}
              >
                {label}
                {tab === 'payments' && filteredPaymentRecords.length > 0 && selectedClass && (
                  <span className="ml-1.5 bg-gold-100 text-gold-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {filteredPaymentRecords.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

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
          />
        )}

        {/* ── TAB: ĐIỂM DANH ──────────────────────────────────────────── */}
        {activeTab === 'attendance' && (
          <ClassAttendanceTab
            attendanceDate={attendanceDate}
            setAttendanceDate={setAttendanceDate}
            currentStats={currentStats}
            filteredStudents={filteredStudents}
            records={records}
            handleStatusChange={handleStatusChange}
            markAllPresent={markAllPresent}
            selectedClass={selectedClass}
            onOpenDetails={openAttendanceDetails}
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
    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockStudents, mockAttendance } from '@/services/mockData';
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  RefreshCw,
  Search,
  Download,
  GripVertical,
  Filter
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ManagementSidebar } from '@/components/ManagementSidebar';
import { ScrollArea } from '@/components/ui/ScrollArea';

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

export default function AttendancePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const initialClass = searchParams.get('class') || '7a1';
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'mark' | 'report'>(() => {
    return (sessionStorage.getItem('attendanceTab') as 'mark' | 'report') || 'mark';
  });
  const [records, setRecords] = useState(mockAttendance);
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    sessionStorage.setItem('attendanceTab', activeTab);
  }, [activeTab]);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(s => {
      const matchesClass = s.class === selectedClass;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [selectedClass, searchQuery]);

  const handleStatusChange = (studentId: string, status: any) => {
    setRecords(prev => {
      const existingIndex = prev.findIndex(r => r.studentId === studentId && r.date === selectedDate);
      if (existingIndex >= 0) {
        const newRecords = [...prev];
        newRecords[existingIndex] = { ...newRecords[existingIndex], status };
        return newRecords;
      }
      return [...prev, {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        date: selectedDate,
        status,
        classId: selectedClass
      }];
    });
  };

  const markAllPresent = () => {
    const newRecords = [...records];
    filteredStudents.forEach(student => {
      const existingIndex = newRecords.findIndex(r => r.studentId === student.id && r.date === selectedDate);
      if (existingIndex >= 0) {
        newRecords[existingIndex] = { ...newRecords[existingIndex], status: 'PRESENT' };
      } else {
        newRecords.push({
          id: `att-${Date.now()}-${student.id}`,
          studentId: student.id,
          date: selectedDate,
          status: 'PRESENT',
          classId: selectedClass
        });
      }
    });
    setRecords(newRecords);
  };

  const reportData = useMemo(() => {
    const groups = new Map<string, any>();
    records.forEach(record => {
      const key = `${record.date}_${record.classId}`;
      if (!groups.has(key)) {
        groups.set(key, {
          date: record.date,
          classId: record.classId,
          total: mockStudents.filter(s => s.class === record.classId).length,
          present: 0,
          late: 0,
          unexcused: 0
        });
      }
      const data = groups.get(key);
      if (record.status === 'PRESENT') data.present++;
      else if (record.status === 'LATE') data.late++;
      else if (record.status === 'UNEXCUSED' || record.status === 'ABSENT') data.unexcused++;
    });
    return Array.from(groups.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [records]);

  const currentStats = useMemo(() => {
    const dayRecords = records.filter(r => r.date === selectedDate && r.classId === selectedClass);
    return {
      present: dayRecords.filter(r => r.status === 'PRESENT').length,
      late: dayRecords.filter(r => r.status === 'LATE').length,
      absent: dayRecords.filter(r => r.status === 'ABSENT').length,
      total: filteredStudents.length
    };
  }, [records, selectedDate, selectedClass, filteredStudents]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F8FAFC]">
      <ManagementSidebar activeMenu="diem-danh" onMenuChange={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden py-2">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              Điểm danh & Báo cáo
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <button 
                onClick={() => setActiveTab('mark')}
                className={cn(
                  "text-[12px] font-bold pb-1.5 border-b-2 transition-all",
                  activeTab === 'mark' ? "text-gold-600 border-gold-500" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                Ghi nhận điểm danh
              </button>
              <button 
                onClick={() => setActiveTab('report')}
                className={cn(
                  "text-[12px] font-bold pb-1.5 border-b-2 transition-all",
                  activeTab === 'report' ? "text-gold-600 border-gold-500" : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                Báo cáo chuyên cần
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-[11px] font-medium border-gray-200 bg-gray-50/50 gap-2 hover:bg-white transition-all shadow-none"
                onClick={() => setIsClassMenuOpen(!isClassMenuOpen)}
              >
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                Lớp: <span className="text-gold-700 font-bold">{selectedClass}</span>
              </Button>

              {isClassMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsClassMenuOpen(false)} />
                  <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 py-2 animate-in fade-in zoom-in duration-200">
                    {CLASSES_TREE.map(group => (
                      <div key={group.id} className="px-2 mb-2">
                        <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.name}</div>
                        {group.children.map(cls => (
                          <button
                            key={cls.id}
                            onClick={() => {
                              setSelectedClass(cls.id);
                              setIsClassMenuOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-1.5 text-[11px] rounded-md transition-all flex items-center justify-between",
                              selectedClass === cls.id 
                                ? "bg-gold-50 text-gold-700 font-bold" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {cls.name}
                            {selectedClass === cls.id && <CheckCircle className="w-3 h-3 text-gold-500" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-[11px] font-bold border-none bg-transparent focus:ring-0 p-0 h-4 outline-none w-24 text-gray-700" 
              />
            </div>

            <div className="h-4 w-px bg-gray-200 mx-1" />

            {activeTab === 'mark' && (
              <>
                <Button 
                  size="sm" 
                  onClick={markAllPresent}
                  className="h-8 bg-[#E6B800] hover:bg-gold-700 text-white text-[11px] font-medium px-4 rounded-md gap-2 border-none shadow-sm transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Có mặt tất cả
                </Button>
                <div className="relative ml-2">
                  <Search className="absolute left-3 top-2.5 h-3 w-3 text-gray-400" />
                  <Input 
                    placeholder="Tìm tên học sinh..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-48 pl-8 text-[11px] bg-gray-50 border-gray-200 focus:bg-white rounded-md transition-all shadow-none"
                  />
                </div>
              </>
            )}
            
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-none">
              <Download className="w-3.5 h-3.5 text-gray-400" />
            </Button>
          </div>
        </div>

        {activeTab === 'mark' && (
          <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-200 flex items-center gap-6">
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
        )}

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table className="border-collapse table-fixed w-full">
              <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-gray-300">
                <TableRow className="h-10 border-b border-gray-200">
                  {activeTab === 'mark' ? (
                    <>
                      <TableHead className="w-8 border-r border-gray-200"></TableHead>
                      <TableHead className="w-12 text-center text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">TT</TableHead>
                      <TableHead className="w-40 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Mã học sinh</TableHead>
                      <TableHead className="w-64 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Họ tên</TableHead>
                      <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Lớp</TableHead>
                      <TableHead className="w-[280px] text-center text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Điểm danh</TableHead>
                      <TableHead className="text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Ghi chú</TableHead>
                      <TableHead className="w-32 text-center text-[11px] font-medium text-gray-500 px-3">Giờ điểm</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="w-8 border-r border-gray-200"></TableHead>
                      <TableHead className="w-12 text-center text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">TT</TableHead>
                      <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Lớp</TableHead>
                      <TableHead className="w-40 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Ngày</TableHead>
                      <TableHead className="w-24 text-center text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Sĩ số</TableHead>
                      <TableHead className="w-28 text-center text-[11px] font-medium text-emerald-600 px-3 border-r border-gray-200">Có mặt</TableHead>
                      <TableHead className="w-28 text-center text-[11px] font-medium text-amber-600 px-3 border-r border-gray-200">Muộn</TableHead>
                      <TableHead className="text-center text-[11px] font-medium text-rose-600 px-3">Vắng</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTab === 'mark' ? (
                  filteredStudents.map((student, index) => {
                    const record = records.find(a => a.studentId === student.id && a.date === selectedDate);
                    return (
                      <TableRow key={student.id} className="h-9 hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                        <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity">
                           <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                        </TableCell>
                        <TableCell className="text-center text-[11px] text-gray-400 border-r border-gray-200">{index + 1}</TableCell>
                        <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{student.id.toUpperCase()}</TableCell>
                        <TableCell className="px-3 border-r border-gray-200">
                           <span className="text-[11px] font-semibold text-gray-900">{student.name}</span>
                        </TableCell>
                        <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.class}</TableCell>
                        <TableCell className="px-2 border-r border-gray-200">
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
                        </TableCell>
                        <TableCell className="px-3 border-r border-gray-200">
                           <input 
                            placeholder="Ghi chú..." 
                            className="text-[11px] bg-transparent border-none outline-none w-full text-gray-500 placeholder:text-gray-200 italic"
                          />
                        </TableCell>
                        <TableCell className="text-center text-[10px] text-gray-400 tabular-nums">
                           {record ? "18:00:32" : "--:--:--"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  reportData.map((row, idx) => (
                    <TableRow key={`${row.date}-${row.classId}`} className="h-10 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <TableCell className="border-r border-gray-200"></TableCell>
                      <TableCell className="text-center text-[11px] text-gray-400 border-r border-gray-200">{idx + 1}</TableCell>
                      <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{row.classId}</TableCell>
                      <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{formatDate(row.date)}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-gray-900 border-r border-gray-200">{row.total}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-emerald-600 border-r border-gray-200">{row.present}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-amber-600 border-r border-gray-200">{row.late}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-rose-600 px-3">{row.unexcused}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

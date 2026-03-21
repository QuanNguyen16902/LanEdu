import React from 'react';
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

export default function AttendancePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const initialClass = searchParams.get('class') || '10A1';
  const [selectedClass] = React.useState(initialClass);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = React.useState<'mark' | 'report'>('mark');

  const filteredStudents = mockStudents.filter(s => s.class === selectedClass);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT': return <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{t('attendance.present')}</span>;
      case 'ABSENT': return <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">{t('attendance.absent')}</span>;
      case 'LATE': return <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{t('attendance.late')}</span>;
      default: return <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">Chưa có</span>;
    }
  };

  const reportData = React.useMemo(() => {
    const groups = new Map<string, any>();
    mockAttendance.forEach(record => {
      const key = `${record.date}_${record.classId}`;
      if (!groups.has(key)) {
        groups.set(key, {
          date: record.date,
          classId: record.classId,
          present: 0,
          late: 0,
          excused: 0,
          unexcused: 0,
          total: mockStudents.filter(s => s.class === record.classId).length || 30
        });
      }
      const data = groups.get(key);
      if (record.status === 'PRESENT') data.present++;
      else if (record.status === 'LATE') data.late++;
      else if (record.status === 'EXCUSED') data.excused++;
      else if (record.status === 'UNEXCUSED' || record.status === 'ABSENT') data.unexcused++;
    });
    return Array.from(groups.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#F8FAFC] overflow-hidden">
      <ManagementSidebar activeMenu="diem-danh" onMenuChange={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">
                {activeTab === 'mark' ? 'Ghi sổ điểm danh' : 'Báo cáo điểm danh'}
              </h1>
              <p className="text-[11px] text-gray-400 font-medium">Lớp: {selectedClass} • {formatDate(selectedDate)}</p>
            </div>
            
            <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200 ml-4">
              <button 
                onClick={() => setActiveTab('mark')}
                className={cn(
                  "px-3 py-1 text-[11px] font-medium rounded transition-all",
                  activeTab === 'mark' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Ghi sổ
              </button>
              <button 
                onClick={() => setActiveTab('report')}
                className={cn(
                  "px-3 py-1 text-[11px] font-medium rounded transition-all",
                  activeTab === 'report' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Báo cáo
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-[11px] font-medium border-none focus:ring-0 p-0 h-auto outline-none bg-transparent text-gray-600"
              />
            </div>
            {activeTab === 'mark' && (
              <>
                <Button size="sm" className="h-8 bg-[#E6B800] hover:bg-gold-700 text-white text-[11px] font-medium px-4 rounded-md gap-2 border-none">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Điểm danh nhanh
                </Button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <Input 
                    placeholder="Search" 
                    className="h-8 w-40 pl-8 text-[11px] bg-gray-50 border-gray-200 focus:bg-white rounded-md"
                  />
                </div>
              </>
            )}
            {activeTab === 'report' && (
              <Button variant="outline" size="sm" className="h-8 px-4 gap-2 text-[11px] font-medium border-gray-200 text-gray-600 rounded-md">
                <Download className="w-3.5 h-3.5" />
                Xuất file
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table className="border-collapse table-fixed w-full">
              <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-gray-300">
                <TableRow className="h-10 border-b border-gray-200">
                  <TableHead className="w-8 border-r border-gray-200"></TableHead>
                  <TableHead className="w-12 text-center text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">TT</TableHead>
                  <TableHead className="w-40 text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">Mã học sinh</TableHead>
                  <TableHead className="w-64 text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">Họ tên</TableHead>
                  <TableHead className="w-32 text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">Tên lớp</TableHead>
                  <TableHead className="w-32 text-center text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">Trạng thái</TableHead>
                  <TableHead className="w-32 text-center text-[11px] font-medium text-gray-500  px-3 border-r border-gray-200">Giờ điểm danh</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-500  px-3">Ghi chú</TableHead>
                </TableRow>
                <TableRow className="h-6 bg-white border-b border-gray-200">
                   <TableCell className="border-r border-gray-200"></TableCell>
                   <TableCell className="border-r border-gray-200"></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTab === 'mark' ? (
                  filteredStudents.map((student, index) => {
                    const record = mockAttendance.find(a => a.studentId === student.id && a.date === selectedDate);
                    return (
                      <TableRow key={student.id} className=" hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                        <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity cursor-grab">
                           <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                        </TableCell>
                        <TableCell className="text-center text-[11px] font-mono text-gray-400 border-r border-gray-200">{index + 1}</TableCell>
                        <TableCell className="text-[11px] font-mono text-gray-900 px-3 border-r border-gray-200 font-medium">{student.id.toUpperCase()}</TableCell>
                        <TableCell className="px-3 border-r border-gray-200">
                           <span className="text-[11px] font-semibold text-gray-900">{student.name}</span>
                        </TableCell>
                        <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.class}</TableCell>
                        <TableCell className="text-center px-3 border-r border-gray-200">
                          {record ? getStatusBadge(record.status) : <Badge variant="neutral" className="text-[9px] px-2 bg-gray-50 text-gray-400 border border-gray-200">Chưa ký</Badge>}
                        </TableCell>
                        <TableCell className="text-center text-[11px] text-gray-400 italic border-r border-gray-200">
                           {record ? "18:00" : "--:--"}
                        </TableCell>
                        <TableCell className="px-3">
                           <input 
                            placeholder="..." 
                            className="text-[11px] bg-transparent border-none outline-none w-full text-gray-500 placeholder:text-gray-200"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  reportData.map((row, idx) => (
                    <TableRow key={`${row.date}-${row.classId}`} className="h-10 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <TableCell className="border-r border-gray-200"></TableCell>
                      <TableCell className="text-center text-[11px] text-gray-400 font-mono border-r border-gray-200">{idx + 1}</TableCell>
                      <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{row.classId}</TableCell>
                      <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{formatDate(row.date)}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-gray-900 border-r border-gray-200">{row.total}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-emerald-600 border-r border-gray-200">{row.present}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-amber-600 border-r border-gray-200">{row.late}</TableCell>
                      <TableCell className="text-center text-[11px] font-medium text-rose-600">{row.unexcused}</TableCell>
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

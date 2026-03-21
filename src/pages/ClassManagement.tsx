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
  GripVertical,
  Filter,
  RefreshCw
} from 'lucide-react';
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
import { PaymentSlipModal } from '@/components/PaymentSlipModal';
import { Student } from '@/services/mockData';
import { ManagementSidebar } from '@/components/ManagementSidebar';

// Mock Data
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

const STUDENTS_MOCK = [
  { id: 'ED0119310177', name: 'Bùi Anujin Thúy An', class: '7BA1', status: 'Đang theo học', dob: '18/10/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0121310006', name: 'Dương Lê An', class: '7BA1', status: 'Đang theo học', dob: '07/05/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0119310031', name: 'Trần Quý Phương An', class: '7BA1', status: 'Đang theo học', dob: '16/07/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0120310015', name: 'Phạm Nguyễn Vân Anh', class: '7BA1', status: 'Đang theo học', dob: '28/01/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0119310032', name: 'Nguyễn Trần Bảo Châu', class: '7BA1', status: 'Đang theo học', dob: '17/08/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0123310009', name: 'Trần Bảo Châu', class: '7BA1', status: 'Đang theo học', dob: '01/10/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0121310013', name: 'Lê Mai Chi', class: '7BA1', status: 'Đang theo học', dob: '04/12/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0119310060', name: 'Nguyễn Bích Diệp', class: '7BA1', status: 'Đang theo học', dob: '29/12/2013', gender: 'Nữ/Female', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0123310004', name: 'Đỗ Khánh Duy', class: '7BA1', status: 'Đang theo học', dob: '13/07/2013', gender: 'Nam/Male', advisor: 'Đặng Thị Thúy Hằng' },
  { id: 'ED0123310002', name: 'Nguyễn Hoàng Minh Đức', class: '7BA1', status: 'Đang theo học', dob: '18/02/2013', gender: 'Nam/Male', advisor: 'Đặng Thị Thúy Hằng' },
];

export default function ClassManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState('danh-sach-lop');
  const [selectedClass, setSelectedClass] = useState<string | null>(searchParams.get('class') || '7ba1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForSlip, setSelectedStudentForSlip] = useState<Student | null>(null);

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

  const handleCreatePaymentSlip = (student: any) => {
    const mappedStudent: Student = {
      id: student.id,
      name: student.name,
      email: `${student.id}@school.com`,
      class: student.class,
      attendance: 100,
      score: 10
    };
    setSelectedStudentForSlip(mappedStudent);
    setIsPaymentModalOpen(true);
  };

  const filteredStudents = useMemo(() => {
    return STUDENTS_MOCK.filter(s => {
      const matchesClass = !selectedClass || s.class.toLowerCase() === selectedClass.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [selectedClass, searchQuery]);

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
                          ? "text-gray-900 border-[#E6B800] bg-gray-50" 
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

      <div className="flex-1 flex flex-col min-w-0 bg-white m-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              Danh sách học sinh - {selectedClass?.toUpperCase()}
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">Tổng số: {filteredStudents.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-medium border-gray-200 bg-white gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-medium border-gray-200 bg-white gap-2">
              <Filter className="w-3.5 h-3.5" />
              Bộ lọc
            </Button>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Button size="sm" className="h-6 px-4 bg-[#1E40AF] hover:bg-blue-900 text-white font-medium text-xs rounded-md shadow-sm border-none gap-2">
              Thao tác
              <ChevronRight className="w-3 h-3 rotate-90" />
            </Button>
            <div className="relative ml-2">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input 
                 placeholder="Search" 
                 className="pl-9 h-8 w-48 text-[12px] bg-gray-50 border-gray-200 focus:bg-white rounded-md transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Table className="border-collapse table-fixed w-full">
              <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-gray-300">
                <TableRow className="h-10 hover:bg-transparent transition-none border-b border-gray-200">
                  <TableHead className="w-8 border-r border-gray-200"></TableHead>
                  <TableHead className="w-10 px-2 border-r border-gray-200">
                    <Checkbox checked={selectedRows.size === filteredStudents.length} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead className="w-12 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">TT</TableHead>
                  <TableHead className="w-32 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">Trạng thái</TableHead>
                  <TableHead className="w-32 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">Mã học sinh</TableHead>
                  <TableHead className="w-48 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">Họ tên</TableHead>
                  <TableHead className="w-32 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">Ngày sinh</TableHead>
                  <TableHead className="w-28 text-[12px] font-medium text-gray-500  px-3 border-r border-gray-200">Giới tính</TableHead>
                  <TableHead className="text-[12px] font-medium text-gray-500  px-3">GVCN/ Advisor</TableHead>
                </TableRow>
                <TableRow className="h-8 bg-white border-b border-gray-200">
                   <TableCell className="border-r border-gray-200"></TableCell>
                   <TableCell className="border-r border-gray-200"></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                   <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, idx) => (
                  <TableRow key={student.id} className=" hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                    <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity cursor-grab">
                       <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                    </TableCell>
                    <TableCell className="px-2 border-r border-gray-200">
                      <Checkbox checked={selectedRows.has(student.id)} onCheckedChange={() => toggleRow(student.id)} />
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500 px-3 border-r border-gray-200">{idx + 1}</TableCell>
                    <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.status}</TableCell>
                    <TableCell className="text-[11px] font-medium text-gray-900 px-3 border-r border-gray-200">{student.id}</TableCell>
                    <TableCell className="text-[11px] font-semibold text-gray-900 px-3 border-r border-gray-200">{student.name}</TableCell>
                    <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.dob}</TableCell>
                    <TableCell className="text-[11px] text-gray-600 px-3 border-r border-gray-200">{student.gender}</TableCell>
                    <TableCell className="text-[11px] text-gray-600 px-3 truncate">{student.advisor}</TableCell>
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
    </div>
  );
}

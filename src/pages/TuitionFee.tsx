import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Plus,
  GripVertical,
  ChevronRight,
  TrendingUp,
  CreditCard,
  History,
  AlertCircle,
  Library,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Printer,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
import { ManagementSidebar } from '@/components/ManagementSidebar';

const PAYMENTS_MOCK = [
  { id: 'PAY-001', studentId: 'ED0119310177', name: 'Bùi Anujin Thúy An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '15/03/2024' },
  { id: 'PAY-002', studentId: 'ED0121310006', name: 'Dương Lê An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PENDING', date: '-' },
  { id: 'PAY-003', studentId: 'ED0119310031', name: 'Trần Quý Phương An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '18/03/2024' },
  { id: 'PAY-004', studentId: 'ED0120310015', name: 'Phạm Nguyễn Vân Anh', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PENDING', date: '-' },
  { id: 'PAY-005', studentId: 'ED0119310032', name: 'Nguyễn Trần Bảo Châu', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '20/03/2024' },
  { id: 'PAY-006', studentId: 'ED0123310009', name: 'Trần Bảo Châu', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '20/03/2024' },
];

const MOCK_MONTHLY_DETAILS = [
  { 
    id: 1,
    month: '03/2024', 
    total: 1500000, 
    status: 'PAID',
    classes: [
      { date: '04/03/2024', amount: 375000, note: 'Đã học' },
      { date: '11/03/2024', amount: 375000, note: 'Đã học' },
      { date: '18/03/2024', amount: 375000, note: 'Đã học' },
      { date: '25/03/2024', amount: 375000, note: 'Sắp tới' },
    ]
  },
  { 
    id: 2,
    month: '02/2024', 
    total: 1500000, 
    status: 'PAID',
    classes: [
      { date: '02/02/2024', amount: 375000, note: 'Đã học' },
      { date: '09/02/2024', amount: 375000, note: 'Đã học' },
      { date: '16/02/2024', amount: 375000, note: 'Nghỉ Tết' },
      { date: '23/02/2024', amount: 375000, note: 'Đã học' },
    ]
  },
  { 
    id: 3,
    month: '01/2024', 
    total: 1500000, 
    status: 'PAID',
    classes: [
      { date: '05/01/2024', amount: 375000, note: 'Đã học' },
      { date: '12/01/2024', amount: 375000, note: 'Đã học' },
      { date: '19/01/2024', amount: 375000, note: 'Đã học' },
      { date: '26/01/2024', amount: 375000, note: 'Đã học' },
    ]
  }
];

export default function TuitionFeePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const filteredPayments = useMemo(() => {
    return PAYMENTS_MOCK.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleShowHistory = (student: any) => {
    setSelectedStudent(student);
    setIsHistoryOpen(true);
  };

  const stats = {
    total: 1500000 * 6,
    paid: 1500000 * 4,
    pending: 1500000 * 2,
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F8FAFC]">
      <ManagementSidebar activeMenu="hoc-phi" onMenuChange={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 m-3 space-y-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Tổng doanh thu dự kiến</p>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">{stats.total.toLocaleString()}đ</h3>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Đã thu</p>
              <h3 className="text-xl font-semibold text-emerald-600 mt-1">{stats.paid.toLocaleString()}đ</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Chưa thu</p>
              <h3 className="text-xl font-semibold text-[#E6B800] mt-1">{stats.pending.toLocaleString()}đ</h3>
            </div>
            <div className="p-2.5 bg-gold-50/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#E6B800]" />
            </div>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">Quản lý học phí</h1>
              <p className="text-[11px] text-gray-400 font-medium tracking-tight">Tháng 03/2024 • Tổng {filteredPayments.length} bản ghi</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] font-medium border-gray-200 bg-white gap-2">
                <History className="w-3.5 h-3.5" />
                Lịch sử
              </Button>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              <Button size="sm" className="h-8 px-4 bg-[#E6B800] hover:bg-gold-600 text-white font-medium text-xs rounded-md shadow-sm border-none gap-2">
                <Plus className="w-3.5 h-3.5" />
                Tạo hóa đơn
              </Button>
              <div className="relative ml-2">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Tìm kiếm học sinh..." 
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
                    <TableHead className="w-12 text-center text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">TT</TableHead>
                    <TableHead className="w-32 text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Mã học sinh</TableHead>
                    <TableHead className="w-48 text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Họ tên</TableHead>
                    <TableHead className="w-24 text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Lớp</TableHead>
                    <TableHead className="w-32 text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Tháng</TableHead>
                    <TableHead className="w-32 text-right text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Số tiền</TableHead>
                    <TableHead className="w-32 text-center text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Trạng thái</TableHead>
                    <TableHead className="w-32 text-[11px] font-medium text-gray-500 uppercase px-3 border-r border-gray-200">Ngày thu</TableHead>
                    <TableHead className="w-24 text-center text-[11px] font-medium text-gray-500 uppercase px-3">Thao tác</TableHead>
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
                   <TableCell className="px-2"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((pay, idx) => (
                    <TableRow 
                      key={pay.id} 
                      className={cn(
                        "h-10 hover:bg-gold-50/20 transition-all border-b border-gray-200 group",
                        selectedStudent?.id === pay.id && "bg-gold-50/50"
                      )}
                    >
                      <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity">
                         <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                      </TableCell>
                      <TableCell className="text-center text-[11px] font-mono text-gray-400 border-r border-gray-200">{idx + 1}</TableCell>
                      <TableCell className="text-[12px] font-medium text-gray-900 px-3 border-r border-gray-200">{pay.studentId}</TableCell>
                      <TableCell className="text-[12px] font-semibold text-gray-900 px-3 border-r border-gray-200">{pay.name}</TableCell>
                      <TableCell className="text-[12px] text-gray-600 px-3 border-r border-gray-200">{pay.class}</TableCell>
                      <TableCell className="text-[12px] text-gray-600 px-3 border-r border-gray-200">{pay.month}</TableCell>
                      <TableCell className="text-[12px] font-medium text-gray-900 text-right px-3 border-r border-gray-200">
                        {pay.amount.toLocaleString()}đ
                      </TableCell>
                      <TableCell className="text-center px-3 border-r border-gray-200">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium border",
                          pay.status === 'PAID' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-gold-50 text-[#E6B800] border-gold-100"
                        )}>
                          {pay.status === 'PAID' ? 'Đã thu' : 'Chưa thu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-500 px-3 truncate border-r border-gray-200">{pay.date}</TableCell>
                      <TableCell className="text-center px-1">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            onClick={() => handleShowHistory(pay)}
                            variant="ghost"
                            size="sm" 
                            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Lịch sử học phí"
                          >
                            <History className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm" 
                            className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Xác nhận đóng phí"
                          >
                            <Coins className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm" 
                            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            title="In biên lai"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Slide-over Side Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-1/4 min-w-[380px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col",
        isHistoryOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {selectedStudent && (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Chi tiết học phí</h3>
                  <p className="text-[11px] text-gray-500">MSSV: {selectedStudent.studentId}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100" 
                onClick={() => setIsHistoryOpen(false)}
              >
                ×
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5">
                {/* Header Info */}
                <div className="mb-6 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <p className="text-[17px] font-bold text-gray-900 mb-1">{selectedStudent.name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Lớp: {selectedStudent.class}</span>
                    <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Tháng: {selectedStudent.month}</span>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Lịch trình học phí</h4>
                  
                  {MOCK_MONTHLY_DETAILS.map((monthData) => (
                    <Collapsible key={monthData.id} defaultOpen={monthData.month === '03/2024'}>
                      <CollapsibleTrigger className="w-full group">
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg group-hover:border-blue-200 transition-all group-data-[state=open]:rounded-b-none group-data-[state=open]:border-blue-200 group-data-[state=open]:bg-blue-50/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-data-[state=open]:bg-blue-100">
                              <CalendarDays className="w-4 h-4 text-gray-400 group-data-[state=open]:text-blue-600" />
                            </div>
                            <div className="text-left">
                              <p className="text-[13px] font-bold text-gray-900">Tháng {monthData.month}</p>
                              <p className="text-[10px] text-gray-400">Tổng cộng: {monthData.total.toLocaleString()}đ</p>
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-x border-b border-gray-100 rounded-b-lg overflow-hidden">
                        <div className="bg-white">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Ngày học</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">Số tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthData.classes.map((cls, cIdx) => (
                                <tr key={cIdx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                  <td className="px-4 py-2.5">
                                    <div className="flex flex-col">
                                      <span className="text-[12px] font-medium text-gray-700">{cls.date}</span>
                                      <span className="text-[9px] text-gray-400 lowercase italic">{cls.note}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    <span className="text-[12px] font-bold text-gray-900">{cls.amount.toLocaleString()}đ</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-10 text-[12px] font-bold border-gray-200">
                  Tải hóa đơn
                </Button>
                <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12px]">
                  Đã thu phí
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Backdrop */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-50 transition-opacity" 
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}

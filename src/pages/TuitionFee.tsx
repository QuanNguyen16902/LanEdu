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
  AlertCircle
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
import { ManagementSidebar } from '@/components/ManagementSidebar';

const PAYMENTS_MOCK = [
  { id: 'PAY-001', studentId: 'ED0119310177', name: 'Bùi Anujin Thúy An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '15/03/2024' },
  { id: 'PAY-002', studentId: 'ED0121310006', name: 'Dương Lê An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PENDING', date: '-' },
  { id: 'PAY-003', studentId: 'ED0119310031', name: 'Trần Quý Phương An', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '18/03/2024' },
  { id: 'PAY-004', studentId: 'ED0120310015', name: 'Phạm Nguyễn Vân Anh', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PENDING', date: '-' },
  { id: 'PAY-005', studentId: 'ED0119310032', name: 'Nguyễn Trần Bảo Châu', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '20/03/2024' },
  { id: 'PAY-006', studentId: 'ED0123310009', name: 'Trần Bảo Châu', class: '7BA1', month: '03/2024', amount: 1500000, status: 'PAID', date: '20/03/2024' },
];

export default function TuitionFeePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPayments = useMemo(() => {
    return PAYMENTS_MOCK.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
                    <TableHead className="text-[11px] font-medium text-gray-500 uppercase px-3">Ngày thu</TableHead>
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
                   <TableCell className="px-2"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((pay, idx) => (
                    <TableRow key={pay.id} className="h-10 hover:bg-gray-50 transition-colors border-b border-gray-200 group">
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
                      <TableCell className="text-[12px] text-gray-500 px-3 truncate">{pay.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

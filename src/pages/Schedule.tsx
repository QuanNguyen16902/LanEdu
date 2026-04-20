import React, { useState } from 'react';
import { 
  CalendarDays, 
  List, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  GripVertical,
  Clock,
  MapPin
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

const SCHEDULE_MOCK = [
  { id: 'S-001', classId: '7BA1', subject: 'Toán học', teacher: 'Nguyễn Văn A', time: '08:00 - 09:30', date: '2024-03-25', day: 'Thứ 2', room: 'P.101' },
  { id: 'S-002', classId: '7BA1', subject: 'Ngữ văn', teacher: 'Trần Thị B', time: '10:00 - 11:30', date: '2024-03-25', day: 'Thứ 2', room: 'P.102' },
  { id: 'S-003', classId: '8A2', subject: 'Tiếng Anh', teacher: 'Lê Văn C', time: '08:00 - 09:30', date: '2024-03-26', day: 'Thứ 3', room: 'P.201' },
  { id: 'S-004', classId: '9B1', subject: 'Vật lý', teacher: 'Phạm Thị D', time: '14:00 - 15:30', date: '2024-03-26', day: 'Thứ 3', room: 'P.301' },
  { id: 'S-005', classId: '7BA1', subject: 'Hóa học', teacher: 'Hoàng Văn E', time: '08:00 - 09:30', date: '2024-03-27', day: 'Thứ 4', room: 'P.101' },
];

const WEEK_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const TIME_SLOTS = ['08:00', '10:00', '14:00', '16:00'];

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedWeek, setSelectedWeek] = useState('25/03 - 31/03');

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F8FAFC]">

      <div className="flex-1 flex flex-col min-w-0 m-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
        {/* Header toolbar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">Lịch dạy & học</h1>
              <p className="text-[11px] text-gray-400 font-medium tracking-tight">Tháng 03/2024 • {selectedWeek}</p>
            </div>
            
            <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200 ml-4">
              <button 
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded transition-all",
                  viewMode === 'calendar' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Lịch tháng
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded transition-all",
                  viewMode === 'list' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List className="w-3.5 h-3.5" />
                Dạng danh sách
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2 text-[11px] font-medium text-gray-600">Tuần này</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Button size="sm" className="h-8 px-4 bg-[#E6B800] hover:bg-gold-600 text-white font-medium text-xs rounded-md shadow-sm border-none gap-2">
              <Plus className="w-3.5 h-3.5" />
              Thêm lịch
            </Button>
            {viewMode === 'list' && (
              <div className="relative ml-2">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input 
                   placeholder="Tìm lớp, giáo viên..." 
                   className="pl-9 h-8 w-48 text-[12px] bg-gray-50 border-gray-200 focus:bg-white rounded-md transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {viewMode === 'calendar' ? (
            /* Calendar Grid View */
            <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50 shadow-inner">
              <div className="grid grid-cols-8 bg-gray-100 border-b border-gray-200">
                <div className="p-3 border-r border-gray-200 bg-gray-100/50"></div>
                {WEEK_DAYS.map(day => (
                  <div key={day} className="p-3 text-center border-r last:border-r-0 border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{day}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">2{WEEK_DAYS.indexOf(day) + 5}</p>
                  </div>
                ))}
              </div>
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-8 min-h-full">
                  {/* Time slots column */}
                  <div className="col-span-1 bg-gray-50/80 border-r border-gray-200">
                    {TIME_SLOTS.map(time => (
                      <div key={time} className="h-32 p-3 border-b border-gray-100 flex items-start justify-center">
                        <span className="text-[11px] font-semibold text-gray-400">{time}</span>
                      </div>
                    ))}
                  </div>
                  {/* Days columns */}
                  {WEEK_DAYS.map(day => (
                    <div key={day} className="col-span-1 border-r last:border-r-0 border-gray-200 relative">
                      {TIME_SLOTS.map(time => (
                        <div key={time} className="h-32 border-b border-gray-100"></div>
                      ))}
                      
                      {/* Floating Schedule Items - Mock placements */}
                      {SCHEDULE_MOCK.filter(s => s.day === day).map(item => (
                        <div 
                          key={item.id}
                          className={cn(
                             "absolute left-1 right-1 p-2 rounded-md border text-left cursor-pointer transition-all hover:shadow-md z-10",
                             "bg-white border-gold-200 border-l-4 border-l-[#E6B800]"
                          )}
                          style={{ 
                            top: `${TIME_SLOTS.indexOf(item.time.split(' ')[0]) * 128 + 8}px`,
                            height: '112px'
                          }}
                        >
                          <p className="text-[10px] font-semibold text-[#B38600] tracking-tighter">{item.classId}</p>
                          <p className="text-[11px] font-semibold text-gray-900 mt-1 truncate">{item.subject}</p>
                          <div className="space-y-1 mt-2">
                             <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                               <Clock className="w-3 h-3" />
                               {item.time}
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                               <MapPin className="w-3 h-3" />
                               {item.room}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* List Table View */
            <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <ScrollArea className="h-full">
                <Table className="border-collapse table-fixed w-full">
                  <TableHeader className="bg-[#F1F5F9] sticky top-0 z-10 border-b border-gray-300">
                    <TableRow className="h-10 hover:bg-transparent transition-none border-b border-gray-200">
                      <TableHead className="w-8 border-r border-gray-200"></TableHead>
                      <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Thứ / Ngày</TableHead>
                      <TableHead className="w-32 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Thời gian</TableHead>
                      <TableHead className="w-24 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Lớp</TableHead>
                      <TableHead className="w-48 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Môn học</TableHead>
                      <TableHead className="w-48 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Giáo viên</TableHead>
                      <TableHead className="w-24 text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Phòng</TableHead>
                      <TableHead className="text-[11px] font-medium text-gray-500 px-3 border-r border-gray-200">Ghi chú</TableHead>
                      <TableHead className="w-12 border-r border-gray-200"></TableHead>
                    </TableRow>
                    <TableRow className="h-8 bg-white border-b border-gray-200">
                      <TableCell className="border-r border-gray-200"></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell className="px-2 border-r border-gray-200"><Search className="w-3 h-3 text-gray-300" /></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SCHEDULE_MOCK.map((item, idx) => (
                      <TableRow key={item.id} className="h-10 hover:bg-gray-50 transition-colors border-b border-gray-200 group">
                        <TableCell className="text-center p-0 border-r border-gray-200 opacity-20 group-hover:opacity-100 transition-opacity">
                           <GripVertical className="w-4 h-4 mx-auto text-gray-400" />
                        </TableCell>
                        <TableCell className="text-[12px] font-medium text-gray-900 px-3 border-r border-gray-200">
                          {item.day} ({item.date.split('-')[2]})
                        </TableCell>
                        <TableCell className="text-[12px] text-gray-600 px-3 border-r border-gray-200">
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {item.time}
                           </div>
                        </TableCell>
                        <TableCell className="text-[12px] font-bold text-[#B38600] px-3 border-r border-gray-200">
                          {item.classId}
                        </TableCell>
                        <TableCell className="text-[12px] font-semibold text-gray-900 px-3 border-r border-gray-200">
                          {item.subject}
                        </TableCell>
                        <TableCell className="text-[12px] text-gray-600 px-3 border-r border-gray-200">
                           {item.teacher}
                        </TableCell>
                        <TableCell className="text-[12px] text-gray-600 px-3 border-r border-gray-200">
                           {item.room}
                        </TableCell>
                        <TableCell className="text-[12px] text-gray-400 px-3 italic border-r border-gray-200">
                           -
                        </TableCell>
                        <TableCell className="text-center border-r border-gray-200">
                           <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="w-3.5 h-3.5" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

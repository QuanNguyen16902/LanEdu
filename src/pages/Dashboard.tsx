import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  BookOpen, 
  ArrowUpRight,
  ArrowDownRight,
  ClipboardCheck,
  CircleDollarSign,
  Download,
  Calendar,
  Zap,
  CheckCircle2,
  TrendingUp,
  Target,
  Flame,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockStudents, mockSchedules } from '@/services/mockData';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/Dialog';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';

  const classStats = mockStudents.reduce((acc, student) => {
    const className = student.class;
    if (!acc.has(className)) {
      acc.set(className, { name: className, total: 0, count: 0 });
    }
    const stat = acc.get(className)!;
    stat.total += student.attendance;
    stat.count += 1;
    return acc;
  }, new Map<string, { name: string; total: number; count: number }>());

  const classAttendanceStats = Array.from(classStats.values()).map(stat => {
    const presentCount = Math.floor((stat.total / (stat.count * 100)) * stat.count);
    return {
      name: stat.name,
      average: Math.round(stat.total / stat.count),
      presentCount: presentCount > 0 ? presentCount : 0,
      studentCount: stat.count
    };
  });

  const stats = [
    { label: t('dashboard.total_students'), value: mockStudents.length, trend: '+5.2%', isPositive: true, icon: Users },
    { label: t('dashboard.total_classes'), value: classAttendanceStats.length.toString(), trend: '+2', isPositive: true, icon: BookOpen },
    { label: 'Chờ chấm bài', value: '8', trend: '-3', isPositive: true, icon: ClipboardCheck },
    { label: 'Doanh thu tháng', value: '185.5M', trend: '+12.5%', isPositive: true, icon: CircleDollarSign },
  ];

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const studentsInClass = mockStudents.filter(s => s.class === selectedClass);

  if (isStudent) {
    return (
      <div className="p-4 lg:p-6 space-y-6 w-full max-w-full mx-auto bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Chào mừng, {user?.name?.split(' ').pop()}! 👋
            </h1>
            <p className="text-xs text-gray-500 font-normal mt-1">
              Bạn đã hoàn thành <span className="font-medium text-gray-900">85%</span> mục tiêu tuần này.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              <Flame className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">7 Ngày liên tiếp</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              <Trophy className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Level 12</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Simple cards */}
           <Card className="border-gray-200 shadow-none bg-white rounded-md">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sắp tới</h3>
              <p className="text-xs text-gray-500 mb-4">Bạn có 2 bài tập cần nộp hôm nay.</p>
              <Button size="sm" className="w-full h-8 bg-gray-900 text-white text-xs rounded-md font-medium">Xem bài tập</Button>
            </CardContent>
          </Card>
          {/* ... similar cards ... */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 w-full max-w-full mx-auto bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-xs text-gray-500 font-normal">Dashboard quản trị LanEdu</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 px-3 rounded-md border-gray-200 bg-white font-medium text-xs gap-2">
          <Download className="w-3.5 h-3.5" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-gray-200 shadow-none bg-white rounded-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded",
                  stat.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                )}>
                  {stat.isPositive ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[11px] font-medium text-gray-500 tracking-wide">{stat.label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QUICK ATTENDANCE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-gold-500 rounded-full" />
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Cần điểm danh hôm nay</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSchedules.slice(1, 4).map((cls, idx) => (
            <Card key={cls.id} className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white rounded-xl overflow-hidden group hover:translate-y-[-2px] transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex">
                  <div className={cn(
                    "w-2 transition-all duration-300",
                    idx === 0 ? "bg-amber-500" : "bg-gold-400"
                  )} />
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-none">Lớp {cls.class}</h3>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium italic">{cls.subject}</p>
                      </div>
                      <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[9px] px-2 h-4">
                        CHƯA ĐIỂM DANH
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-bold text-gray-600">{cls.time.split(' - ')[0]}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => window.location.href = `/classes?class=${cls.class}&tab=attendance`}
                        className="h-7 px-4 text-[10px] font-black bg-[#E6B800] hover:bg-gold-600 text-white rounded-full border-none shadow-md shadow-gold-500/10 gap-1.5 group/btn transition-all"
                      >
                        ĐIỂM DANH NGAY
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-gray-200 shadow-none bg-white rounded-md overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-gray-100">
            <CardTitle className="text-sm font-medium text-gray-900">Lịch dạy hôm nay</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="h-9">
                    <TableHead className="text-[11px] font-medium text-gray-500 px-4 h-9">Thời gian</TableHead>
                    <TableHead className="text-[11px] font-medium text-gray-500 px-4 h-9">Lớp</TableHead>
                    <TableHead className="text-[11px] font-medium text-gray-500 px-4 h-9">Môn học</TableHead>
                    <TableHead className="text-[11px] font-medium text-gray-500 px-4 h-9 text-right pr-4">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSchedules.map((schedule, idx) => (
                    <TableRow key={schedule.id} className="h-11 border-gray-100 even:bg-gray-50/30">
                      <TableCell className="px-4 py-0 font-normal text-gray-900 text-xs">{schedule.time.split(' - ')[0]}</TableCell>
                      <TableCell className="px-4 py-0 font-medium text-gray-900 text-xs">{schedule.class}</TableCell>
                      <TableCell className="px-4 py-0 text-gray-500 text-xs">{schedule.subject}</TableCell>
                      <TableCell className="px-4 py-0 text-right pr-4">
                        <Badge variant="neutral" className="text-[9px] font-medium border-gray-200 bg-white text-gray-400">
                          {idx % 2 === 0 ? 'Hoàn thành' : 'Chờ'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="border-gray-200 shadow-none bg-white rounded-md">
            <CardHeader className="px-4 py-3 border-b border-gray-100">
               <CardTitle className="text-sm font-medium text-gray-900">Chi tiết theo lớp</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableBody>
                   {classAttendanceStats.map(stat => (
                     <TableRow key={stat.name} className="h-10 border-gray-100">
                       <TableCell className="px-4 py-0 text-xs font-medium text-gray-700">Lớp {stat.name}</TableCell>
                       <TableCell className="px-4 py-0 text-[10px] text-gray-400 text-right font-mono">{stat.average}%</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </CardContent>
           </Card>

           <Card className="bg-gray-900 text-white border-none rounded-md p-4">
             <h3 className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-gray-400" />
                Mẹo hay
             </h3>
             <p className="text-[11px] text-gray-400 leading-normal">Xem lại bài giảng ngay sau buổi học giúp nhớ lâu hơn 60%.</p>
           </Card>
        </div>
      </div>

      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="sm:max-w-[400px] border-gray-200 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Lớp {selectedClass}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-1 p-1">
              {studentsInClass.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-2 rounded-md border-b last:border-0 border-gray-50">
                  <span className="text-[11px] font-medium text-gray-700">{student.name}</span>
                  <Badge variant="neutral" className="text-[9px] font-medium bg-gray-50">{student.attendance}%</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

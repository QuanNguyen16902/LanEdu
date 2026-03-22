import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockAssignments } from '@/services/mockData';
import {
  Plus,
  FileText,
  Calendar,
  Paperclip,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Trophy,
  Link as LinkIcon,
  File
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ManagementSidebar } from '@/components/ManagementSidebar';

export default function AssignmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState('bai-tap');
  const isStudent = user?.role === 'STUDENT';

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          badge: <Badge variant="success" className="text-[10px] px-2 py-0.5 rounded-full font-bold">{t('assignments.submitted')}</Badge>,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          bg: 'bg-emerald-50',
          border: 'border-emerald-100'
        };
      case 'MISSING':
        return {
          badge: <Badge variant="danger" className="text-[10px] px-2 py-0.5 rounded-full font-bold">{t('assignments.missing')}</Badge>,
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          bg: 'bg-red-50',
          border: 'border-red-100'
        };
      case 'LATE':
        return {
          badge: <Badge variant="warning" className="text-[10px] px-2 py-0.5 rounded-full font-bold">{t('assignments.late')}</Badge>,
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bg: 'bg-amber-50',
          border: 'border-amber-100'
        };
      default:
        return {
          badge: <Badge variant="info" className="text-[10px] px-2 py-0.5 rounded-full font-bold">{t('assignments.pending')}</Badge>,
          icon: <FileText className="w-5 h-5 text-gold-500" />,
          bg: 'bg-gold-50',
          border: 'border-gold-100'
        };
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-gray-50/50">
      <ManagementSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Quản lý Bài tập</h1>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                {isStudent ? "Theo dõi tiến độ học tập và bài tập về nhà của bạn." : "Quản lý và giao bài tập cho học sinh trong các lớp học."}
              </p>
            </div>
            {user?.role === 'TEACHER' && (
              <Button size="sm" onClick={() => setIsCreating(true)} className="h-8 px-4 bg-[#E6B800] hover:bg-gold-600 text-white shadow-sm text-[11px] font-bold uppercase tracking-wide rounded-lg">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                {t('assignments.create_new')}
              </Button>
            )}
          </div>

          {/* Student Motivation Card */}
          {isStudent && (
            <Card className="bg-gradient-to-r from-gold-500 to-gold-600 border-none text-white overflow-hidden relative shadow-md">
              <div className="absolute right-0 top-0 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">Mục tiêu tuần này: 5 Bài tập</h3>
                  <p className="text-gold-50 text-sm mb-3">Bạn đã hoàn thành 3 bài. Còn 2 bài nữa thôi! 🌟</p>
                  <div className="w-full max-w-xs bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[60%]" />
                  </div>
                </div>
                <div className="hidden sm:flex w-16 h-16 bg-white/10 rounded-full items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Form (Teacher) */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="bg-gold-50/30 border-dashed border-gold-200 mb-6">
                  <CardHeader className="py-2.5 px-4 border-b border-gold-100/50">
                    <CardTitle className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">{t('assignments.create_new')}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-4 px-4">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider">Tên bài tập / Tiêu đề</label>
                          <Input placeholder="VD: IELTS Writing Task 1 - Line Graph..." className="h-8 text-[13px] border-gray-200 focus:border-gold-400 focus:ring-gold-400 rounded-lg shadow-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider">Hạn nộp bài</label>
                          <Input type="date" className="h-8 text-[13px] border-gray-200 focus:border-gold-400 focus:ring-gold-400 rounded-lg shadow-sm" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider">Khối lớp</label>
                          <select className="flex h-8 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-[13px] outline-none focus:ring-1 focus:ring-gold-400 transition-all shadow-sm">
                            <option value="">Chọn khối</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Khối {g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider">Mã lớp / Tên lớp</label>
                          <Input placeholder="VD: 10 Moon..." className="h-8 text-[13px] border-gray-200 focus:border-gold-400 focus:ring-gold-400 rounded-lg shadow-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider text-blue-600">File PDF Đính kèm</label>
                          <div className="relative">
                            <File className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                            <Input placeholder="Dán link PDF tài liệu..." className="h-8 pl-8.5 text-[11px] border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg shadow-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase mb-1 block tracking-wider text-emerald-600">Link tham khảo</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
                            <Input placeholder="Dán link website/video..." className="h-8 pl-8.5 text-[11px] border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-lg shadow-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase block tracking-wider">Hướng dẫn chi tiết</label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gold-400 outline-none transition-all shadow-sm placeholder:text-gray-400"
                          placeholder="Nhập nội dung hướng dẫn hoặc yêu cầu cụ thể cho học sinh..."
                        />
                      </div>
                      <div className="flex justify-end gap-2.5 pt-1">
                        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-100 px-4">Bỏ qua</Button>
                        <Button size="sm" className="bg-[#E6B800] hover:bg-gold-600 text-white h-8 text-[11px] font-bold uppercase tracking-wide px-6 rounded-lg shadow-sm">Giao bài tập ngay</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assignments List */}
          <div className="grid grid-cols-1 gap-3.5">
            {mockAssignments.map((assignment, index) => {
              const config = getStatusConfig(assignment.status);
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:border-gold-300 hover:shadow-md transition-all cursor-pointer bg-white border-gray-100">
                    <CardContent className="p-3.5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5 flex-1">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105 shrink-0",
                            config.bg,
                            config.border
                          )}>
                            {config.icon}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-[15px] font-bold text-gray-900 leading-tight group-hover:text-gold-600 transition-colors truncate">
                                {assignment.title}
                              </h3>
                              {config.badge}
                              <div className="flex gap-1 items-center">
                                {assignment.grade && (
                                  <Badge className="bg-gray-100 text-gray-600 border-none text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter italic">K{assignment.grade}</Badge>
                                )}
                                {assignment.classId && (
                                  <Badge className="bg-gold-50 text-gold-700 border-none text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter italic">{assignment.classId}</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-[12px] text-gray-500 line-clamp-1 leading-normal">{assignment.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                                {t('assignments.due_date')}: <span className="text-gray-700">{formatDate(assignment.dueDate)}</span>
                              </div>
                              
                              {(assignment.pdfUrl || assignment.externalUrl) && (
                                <div className="flex items-center gap-3 border-l border-gray-200 pl-4 h-3.5">
                                  {assignment.pdfUrl && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-bold hover:text-blue-700 transition-colors uppercase tracking-tight">
                                      <File className="w-3 h-3" />
                                      Tài liệu PDF
                                    </div>
                                  )}
                                  {assignment.externalUrl && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold hover:text-emerald-700 transition-colors uppercase tracking-tight">
                                      <LinkIcon className="w-3 h-3" />
                                      Liên kết
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 shrink-0">
                          {isStudent && assignment.status === 'PENDING' && (
                            <Button size="sm" className="bg-[#E6B800] hover:bg-gold-600 text-white h-8 text-[11px] font-bold px-4 rounded-lg flex items-center gap-2 shadow-sm uppercase tracking-wide">
                              <Send className="w-3 h-3" />
                              Nộp bài ngay
                            </Button>
                          )}
                          {user?.role === 'TEACHER' && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold border-gold-200 text-gold-600 hover:bg-gold-50 uppercase tracking-wider px-3">Chỉnh sửa</Button>
                              <Button variant="danger" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider px-3">Xóa</Button>
                            </div>
                          )}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-gold-500 group-hover:bg-gold-50 transition-all border border-transparent group-hover:border-gold-100">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

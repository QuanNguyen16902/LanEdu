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
  Trophy
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AssignmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = React.useState(false);
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
    <div className="p-6">
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('common.assignments')}</h1>
          <p className="text-sm text-gray-500">
            {isStudent ? "Keep up the great work! You're making progress every day. 🚀" : t('assignments.create_new')}
          </p>
        </div>
        {user?.role === 'TEACHER' && (
          <Button size="sm" onClick={() => setIsCreating(true)} className="h-9 px-4 bg-gold-500 hover:bg-gold-600 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            {t('assignments.create_new')}
          </Button>
        )}
      </div>

      {/* Student Motivation Card */}
      {isStudent && (
        <Card className="bg-gradient-to-r from-gold-500 to-gold-600 border-none text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Weekly Goal: 5 Assignments</h3>
              <p className="text-gold-50 text-sm mb-3">You've completed 3 so far. Just 2 more to go! 🌟</p>
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
              <CardHeader className="py-3">
                <CardTitle className="text-xs uppercase tracking-wider text-gold-700">{t('assignments.create_new')}</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={t('assignments.title')} placeholder="Enter assignment title" className="h-9 focus:border-gold-400 focus:ring-gold-400" />
                    <Input label={t('assignments.due_date')} type="date" className="h-9 focus:border-gold-400 focus:ring-gold-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">{t('assignments.description')}</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all"
                      placeholder="Enter instructions..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>{t('common.cancel')}</Button>
                    <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white">{t('common.save')}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-4">
        {mockAssignments.map((assignment, index) => {
          const config = getStatusConfig(assignment.status);
          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:border-gold-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110",
                        config.bg,
                        config.border
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-gold-600 transition-colors">
                            {assignment.title}
                          </h3>
                          {config.badge}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-gold-500" />
                            {t('assignments.due_date')}: <span className="text-gray-600">{formatDate(assignment.dueDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Paperclip className="w-3.5 h-3.5 text-gold-500" />
                            2 {t('assignments.attachments')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      {isStudent && assignment.status === 'PENDING' && (
                        <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-white shadow-sm group/btn">
                          <Send className="w-3.5 h-3.5 mr-2 group-hover/btn:trangray-x-1 group-hover/btn:-trangray-y-1 transition-transform" />
                          {t('assignments.submit')}
                        </Button>
                      )}
                      {user?.role === 'TEACHER' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gold-200 text-gold-600 hover:bg-gold-50">{t('common.edit')}</Button>
                          <Button size="sm" variant="danger">{t('common.delete')}</Button>
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-gold-500 group-hover:bg-gold-50 transition-all">
                        <ChevronRight className="w-5 h-5" />
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

  );
}

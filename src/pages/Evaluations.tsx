import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockStudents, mockEvaluations } from '@/services/mockData';
import { Star, MessageSquare, History, Award, Sparkles, TrendingUp, Quote } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function EvaluationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = React.useState<string | null>(null);
  const isStudent = user?.role === 'STUDENT';

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-100';
    if (score >= 5) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  if (isStudent) {
    const myEvaluations = mockEvaluations.filter(e => e.studentId === '1');
    const latestEvaluation = myEvaluations[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('common.evaluations')}</h1>
            <p className="text-sm text-gray-500">Your progress and feedback from teachers. 🌟</p>
          </div>
        </div>

        {latestEvaluation && (
          <Card className="bg-gradient-to-br from-gold-50 to-white border-gold-100 overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10">
              <Sparkles className="w-48 h-48 text-gold-600" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-gold-200 flex items-center justify-center shadow-sm">
                    <span className="text-3xl font-bold text-gold-600">{latestEvaluation.score}</span>
                  </div>
                  <Badge variant="info" className="rounded-full px-3 font-bold">Latest Score</Badge>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      Great job, {user?.name}! <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </h3>
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gold-100 relative">
                      <Quote className="absolute -left-2 -top-2 w-6 h-6 text-gold-200" />
                      <p className="text-gray-700 italic leading-relaxed">
                        "{latestEvaluation.comment}"
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" 
                          className="w-6 h-6 rounded-full border border-gold-200"
                          alt="Teacher"
                        />
                        <span className="text-xs font-bold text-gray-500">— Your Teacher</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-gold-500" />
            Feedback History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myEvaluations.map((evaluation, index) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-gold-200 transition-all group">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "px-3 py-1 rounded-full border text-sm font-bold flex items-center gap-1.5",
                        getScoreBg(evaluation.score),
                        getScoreColor(evaluation.score)
                      )}>
                        <Award className="w-4 h-4" />
                        {evaluation.score}/10
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{formatDate(evaluation.date)}</span>
                    </div>
                    <div className="flex gap-3">
                      <MessageSquare className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {evaluation.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('common.evaluations')}</h1>
          <p className="text-xs text-gray-500">{t('evaluations.give_feedback')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="py-2">
            <CardTitle className="text-xs uppercase tracking-wider">{t('common.students')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {mockStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={cn(
                    "w-full px-3 py-2 flex items-center gap-2.5 hover:bg-gold-50 transition-colors text-left",
                    selectedStudent === student.id && "bg-gold-500 text-white"
                  )}
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} 
                    alt={student.name} 
                    className="w-7 h-7 rounded-full border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-semibold truncate", selectedStudent === student.id ? "text-white" : "text-gray-900")}>
                      {student.name}
                    </p>
                    <p className={cn("text-[10px] truncate", selectedStudent === student.id ? "text-gold-100" : "text-gray-500")}>
                      {student.class}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-bold", selectedStudent === student.id ? "text-white" : getScoreColor(student.score))}>
                      {student.score}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {selectedStudent ? (
            <>
              {user?.role === 'TEACHER' && (
                <Card className="bg-gold-50/30 border-dashed border-gold-200">
                  <CardHeader className="py-2">
                    <CardTitle className="text-xs uppercase tracking-wider text-gold-700">{t('evaluations.give_feedback')}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <form className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input label={t('evaluations.score')} type="number" step="0.1" min="0" max="10" placeholder="0.0 - 10.0" className="h-8 text-xs focus:border-gold-400 focus:ring-gold-400" />
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-700">{t('evaluations.grading_system')}</label>
                          <select className="flex h-8 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all">
                            <option>0 - 10</option>
                            <option>A - F</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">{t('evaluations.comment')}</label>
                        <textarea 
                          className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 outline-none transition-all"
                          placeholder="Enter your feedback..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm" className="h-7 text-[10px]">{t('common.save')}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="py-2 flex flex-row items-center gap-2">
                  <History className="w-4 h-4 text-gray-400" />
                  <CardTitle>{t('evaluations.history')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {mockEvaluations.filter(e => e.studentId === selectedStudent).map((evaluation) => (
                      <div key={evaluation.id} className="px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-gray-900">{evaluation.score}/10</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">{formatDate(evaluation.date)}</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                          <div className="flex gap-1.5 mb-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('evaluations.comment')}</span>
                          </div>
                          <p className="text-xs text-gray-600 italic leading-relaxed">"{evaluation.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-white rounded-md border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-gray-200" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No Student Selected</h3>
              <p className="text-xs text-gray-400 max-w-[200px] mt-1">Select a student from the list to view their evaluation history and give feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

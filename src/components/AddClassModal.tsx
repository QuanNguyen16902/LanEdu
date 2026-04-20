import React, { useState, useEffect } from 'react';
import { Layout, User, MapPin, X, GraduationCap, UserCheck, Users, ChevronDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog';
import { toast } from 'sonner';
import { classService, Class } from '@/services/classService';
import { teacherService } from '@/services/teacherService';
import { Teacher } from '@/types/teacher';
import { cn } from '@/lib/utils';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newClass: any) => void;
  editingClass?: Class | null;
}

export function AddClassModal({ isOpen, onClose, onSave, editingClass = null }: AddClassModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    taId: '',
    room: '',
    grade: '',
    schedule: '',
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error('Lỗi khi tải giáo viên:', error);
      }
    };
    if (isOpen) {
      fetchTeachers();
      if (editingClass) {
        setFormData({
          name: editingClass.name,
          teacherId: editingClass.teacherId,
          taId: editingClass.taId || '',
          room: editingClass.room || '',
          grade: editingClass.grade || '',
          schedule: editingClass.schedule || '',
        });
        
        // Parse schedule "T2, T5: 18:00 - 20:00"
        if (editingClass.schedule) {
          const [daysPart, timePart] = editingClass.schedule.split(': ');
          if (daysPart) setSelectedDays(daysPart.split(', '));
          if (timePart) {
            const [start, end] = timePart.split(' - ');
            if (start) setStartTime(start);
            if (end) setEndTime(end);
          }
        } else {
          setSelectedDays([]);
        }
      } else {
        setFormData({ name: '', teacherId: '', taId: '', room: '', grade: '', schedule: '' });
        setSelectedDays([]);
        setStartTime('18:00');
        setEndTime('20:00');
      }
    }
  }, [isOpen, editingClass]);

  const leadTeachers = teachers.filter(t => t.type === 'LEAD');
  const assistantTeachers = teachers.filter(t => t.type === 'TA');

  const toggleDay = (day: string) => {
    const dayOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    setSelectedDays(prev => {
      const next = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
      return next.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên lớp');
      return;
    }
    if (!formData.grade) {
      toast.error('Vui lòng chọn khối học');
      return;
    }
    if (!formData.teacherId) {
      toast.error('Vui lòng chọn giáo viên đứng lớp');
      return;
    }

    const finalSchedule = selectedDays.length > 0 
      ? `${selectedDays.join(', ')}: ${startTime} - ${endTime}`
      : '';

    setIsSubmitting(true);
    try {
      if (editingClass) {
        const updated = await classService.updateClass(editingClass.id, { ...formData, schedule: finalSchedule });
        onSave(updated);
        toast.success(`Đã cập nhật lớp ${formData.name}`);
      } else {
        const newClass = await classService.createClass({ ...formData, schedule: finalSchedule });
        onSave(newClass);
        toast.success(`Đã tạo lớp ${formData.name} thành công`);
      }
      onClose();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-lg">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 leading-tight">
              {editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
            </h2>
            <p className="text-[12px] text-gray-500 mt-1 font-normal">
              {editingClass ? 'Cập nhật thông tin lớp học hiện có' : 'Cấu hình thông tin và phân loại khối lớp'}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-gray-700">Tên lớp học <span className="text-rose-500">*</span></label>
            <div className="relative group">
              <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#E6B800] transition-colors" />
              <Input 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: 7 Sun, 6 Moon, IELTS Foundation..."
                className="pl-10 h-11 text-[13px] bg-white border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg shadow-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-gray-700">Phân loại khối <span className="text-rose-500">*</span></label>
              <div className="relative group">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#E6B800] transition-colors z-10" />
                <select 
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full pl-10 pr-8 h-10 text-[13px] bg-white border border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg shadow-none outline-none transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="" disabled>Chọn...</option>
                  <option value="preschool">Mầm non</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                    <option key={g} value={g.toString()}>Lớp {g}</option>
                  ))}
                  <option value="university">Đại học</option>
                  <option value="retail">Lẻ ngoài</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-medium text-gray-700">Khung giờ học <span className="text-rose-500">*</span></label>
              
              {/* Days selection */}
              <div className="flex flex-wrap gap-1.5">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "w-8 h-8 rounded-full text-[10px] font-bold border transition-all",
                      selectedDays.includes(day)
                        ? "bg-[#E6B800] border-[#E6B800] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-400 hover:border-[#E6B800]"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time selection */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#E6B800] transition-colors" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full pl-8 pr-2 h-9 text-[12px] bg-white border border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg outline-none transition-all"
                  />
                </div>
                <span className="text-gray-300 text-[12px]">→</span>
                <div className="relative flex-1 group">
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 h-9 text-[12px] bg-white border border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-50">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-gray-700">Giáo viên đứng lớp <span className="text-rose-500">*</span></label>
              <div className="relative group">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#E6B800] transition-colors z-10" />
                <select 
                  value={formData.teacherId}
                  onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full pl-10 pr-8 h-11 text-[13px] bg-white border border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg shadow-none outline-none transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="" disabled>Chọn giáo viên chính...</option>
                  {leadTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-gray-700">Trợ giảng (không bắt buộc)</label>
              <div className="relative group">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#E6B800] transition-colors z-10" />
                <select 
                  value={formData.taId}
                  onChange={e => setFormData({ ...formData, taId: e.target.value })}
                  className="w-full pl-10 pr-8 h-11 text-[13px] bg-white border border-gray-200 focus:border-[#E6B800] focus:ring-1 focus:ring-[#E6B800] rounded-lg shadow-none outline-none transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">Không có trợ giảng</option>
                  {assistantTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-gray-50">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-6 text-[12px] font-semibold bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg shadow-none"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-8 text-[12px] font-semibold bg-[#E6B800] hover:bg-[#C9A227] text-white rounded-lg shadow-md shadow-[#E6B800]/20 border-none transition-all active:scale-95"
            >
              {isSubmitting ? 'Đang xử lý...' : editingClass ? 'Lưu thay đổi' : 'Tạo lớp ngay'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

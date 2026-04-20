import React, { useState, useEffect } from 'react';
import { User, Calendar, CreditCard, ChevronDown, CheckCircle2, X, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog';
import { Student } from '@/services/mockData';
import { studentService } from '@/services/studentService';
import { toast } from 'sonner';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string | null;
  onSave: (newStudent: Student) => void;
}

export function AddStudentModal({ isOpen, onClose, classId, onSave }: AddStudentModalProps) {
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    dob: '',
    gender: 'Nam/Male',
    status: 'Đang theo học',
    pricePerSession: 200000,
    class: classId || '',
    attendance: 100,
    score: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classId) {
      setFormData(prev => ({ ...prev, class: classId }));
    }
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên học sinh');
      return;
    }

    setIsSubmitting(true);
    try {
      // Logic for adding student
      const newStudent = await studentService.createStudent(formData);
      onSave(newStudent as Student);
      setFormData({
        name: '',
        dob: '',
        gender: 'Nam/Male',
        status: 'Đang theo học',
        pricePerSession: 200000,
        class: classId || '',
        attendance: 100,
        score: 0,
      });
      onClose();
      toast.success(`Đã thêm học sinh ${formData.name} vào lớp ${classId}`);
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-[18px] font-medium text-gray-900 leading-tight">Thêm học sinh mới</h2>
            <p className="text-[13px] text-gray-500 mt-1">Ghi danh vào lớp: <span className="font-bold text-teal-700">{classId}</span></p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Họ và tên học sinh</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập đầy đủ họ tên..."
                className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-md shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Ngày sinh</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input 
                  type="date"
                  value={formData.dob || ''} 
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-md shadow-sm transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Giới tính</label>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <select 
                  className="w-full h-10 pl-3 pr-8 text-[14px] bg-white border border-gray-200 rounded-md focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none appearance-none shadow-sm transition-all text-gray-900"
                  value={formData.gender || ''}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam/Male">Nam/Male</option>
                  <option value="Nữ/Female">Nữ/Female</option>
                  <option value="Khác/Other">Khác/Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Giá mỗi buổi học</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                type="number"
                value={formData.pricePerSession || ''} 
                onChange={e => setFormData({ ...formData, pricePerSession: Number(e.target.value) })}
                className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-md shadow-sm transition-all"
              />
              <span className="absolute right-3 top-2.5 text-[11px] text-gray-400 font-semibold">VNĐ</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Trạng thái theo học</label>
            <div className="relative">
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <select 
                className="w-full h-10 pl-3 pr-8 text-[14px] bg-white border border-gray-200 rounded-md focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none appearance-none shadow-sm transition-all text-gray-900"
                value={formData.status || ''}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Đang theo học">Đang theo học</option>
                <option value="Nghỉ học">Nghỉ học</option>
                <option value="Bảo lưu">Bảo lưu</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 mt-2">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 text-[14px] font-medium bg-transparent border-gray-200 text-gray-900 hover:bg-gray-50 rounded-md shadow-none"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 text-[14px] font-medium bg-[#1F2937] hover:bg-black text-white rounded-md shadow-none border-none"
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm học sinh'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

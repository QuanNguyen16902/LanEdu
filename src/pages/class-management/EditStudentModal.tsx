import React, { useState, useEffect } from 'react';
import { User, Calendar, CreditCard, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog';
import { Student } from '@/services/mockData';
import { toast } from 'sonner';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
}

export function EditStudentModal({ isOpen, onClose, student, onSave }: EditStudentModalProps) {
  const [formData, setFormData] = useState<Partial<Student>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        pricePerSession: student.pricePerSession ?? 180000,
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student && formData.name) {
      onSave({ ...student, ...formData } as Student);
      onClose();
      toast.success(`Đã cập nhật thông tin cho ${formData.name}`);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-[18px] font-medium text-gray-900 leading-tight">Sửa thông tin học viên</h2>
            <p className="text-[13px] text-gray-500 mt-1">Mã HS: {student.id}</p>
          </div>
         
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập họ và tên..."
                className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] rounded-md shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Ngày sinh</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                type="date"
                value={formData.dob || ''} 
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] rounded-md shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Giới tính</label>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <select 
                  className="w-full h-10 pl-3 pr-8 text-[14px] bg-white border border-gray-200 rounded-md focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none appearance-none shadow-sm transition-all text-gray-900"
                  value={formData.gender || ''}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Trạng thái</label>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <select 
                  className="w-full h-10 pl-3 pr-8 text-[14px] bg-white border border-gray-200 rounded-md focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] outline-none appearance-none shadow-sm transition-all text-gray-900"
                  value={formData.status || ''}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Học viên chính thức">Chính thức</option>
                  <option value="Học viên tiềm năng">Tiềm năng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-700">Học phí / buổi</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input 
                type="number"
                value={formData.pricePerSession || ''} 
                onChange={e => setFormData({ ...formData, pricePerSession: Number(e.target.value) })}
                placeholder="200000"
                className="pl-9 h-10 text-[14px] bg-white border-gray-200 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] rounded-md shadow-sm transition-all font-medium"
              />
              <span className="absolute right-3 top-2.5 text-[13px] text-gray-500 font-medium">VNĐ</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-gray-100/0">
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
              className="h-10 px-5 text-[14px] font-medium bg-[#C9A227] hover:bg-[#A8841F] text-white rounded-md shadow-none border-none"
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

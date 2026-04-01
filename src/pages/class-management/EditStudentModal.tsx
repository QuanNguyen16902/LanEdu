import React, { useState, useEffect } from 'react';
import { User, Calendar, CreditCard, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="max-w-[500px] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <DialogHeader className="p-6 bg-gradient-to-br from-gold-500 to-amber-600 text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
              <User className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Chỉnh sửa thông tin học sinh</DialogTitle>
              <p className="text-[11px] opacity-80 mt-0.5 uppercase tracking-wider font-medium">Mã học sinh: {student.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-tight">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                <Input 
                  value={formData.name || ''} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ và tên học sinh..."
                  className="pl-10 h-10 text-[13px] border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-tight">Ngày sinh</label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                <Input 
                  type="date"
                  value={formData.dob || ''} 
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="pl-10 h-10 text-[13px] border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-tight">Giới tính</label>
              <div className="relative group">
                <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-gray-400 pointer-events-none" />
                <select 
                  className="w-full h-10 pl-3 pr-8 text-[13px] rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none transition-all cursor-pointer"
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
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-tight">Trạng thái</label>
              <div className="relative group">
                <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-gray-400 pointer-events-none" />
                <select 
                  className="w-full h-10 pl-3 pr-8 text-[13px] rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none transition-all cursor-pointer"
                  value={formData.status || ''}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Học viên chính thức">Học viên chính thức</option>
                  <option value="Học viên tiềm năng">Học viên tiềm năng</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-tight">Học phí/buổi</label>
              <div className="relative group">
                <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                <Input 
                  type="number"
                  value={formData.pricePerSession || ''} 
                  onChange={e => setFormData({ ...formData, pricePerSession: Number(e.target.value) })}
                  placeholder="200000"
                  className="pl-10 h-10 text-[13px] border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 rounded-xl transition-all font-mono font-bold"
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-300">đ</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 text-[12px] font-bold border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all shadow-none"
            >
              HỦY BỎ
            </Button>
            <Button 
              type="submit"
              className="flex-[1.5] h-11 text-[12px] font-bold bg-[#1E40AF] hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20 rounded-xl gap-2 group transition-all"
            >
              <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              LƯU THAY ĐỔI
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

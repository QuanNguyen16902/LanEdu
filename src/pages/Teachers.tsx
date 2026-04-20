import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  X,
  UserCheck,
  UserX,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Teacher } from '@/types/teacher';
import { teacherService } from '@/services/teacherService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';

export default function TeachersPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'LEAD' | 'TA'>('ALL');

  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    type: 'LEAD',
    email: '',
    phone: '',
    status: 'ACTIVE'
  });

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getTeachers();
      setTeachers(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giáo viên');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên giáo viên');
      return;
    }

    try {
      if (editingTeacher) {
        await teacherService.updateTeacher(editingTeacher.id, formData);
        toast.success('Đã cập nhật thông tin giáo viên');
      } else {
        await teacherService.createTeacher(formData);
        toast.success('Đã thêm giáo viên mới');
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      setFormData({ name: '', type: 'LEAD', email: '', phone: '', status: 'ACTIVE' });
      fetchTeachers();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await teacherService.deleteTeacher(id);
        toast.success('Đã xóa giáo viên');
        fetchTeachers();
      } catch (error: any) {
        toast.error('Lỗi khi xóa: ' + error.message);
      }
    }
  };

  const filteredTeachers = useMemo(() => {
    if (filterType === 'ALL') return teachers;
    return teachers.filter(t => t.type === filterType);
  }, [teachers, filterType]);

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Họ và tên',
      sortable: true,
      render: (value, teacher) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold",
            teacher.type === 'LEAD' ? "bg-gold-100 text-gold-700" : "bg-slate-100 text-slate-700"
          )}>
            {value.split(' ').pop()?.charAt(0) || 'T'}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-900 leading-tight">{value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{teacher.type === 'LEAD' ? 'Giáo viên chính' : 'Trợ giảng'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Vai trò',
      sortable: true,
      render: (value) => (
        <Badge 
          className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-medium border-none shadow-none",
            value === 'LEAD' ? "bg-gold-50 text-gold-700" : "bg-slate-100 text-slate-600"
          )}
        >
          {value === 'LEAD' ? 'Chính' : 'Trợ giảng'}
        </Badge>
      )
    },
    {
      key: 'email',
      header: 'Liên hệ',
      render: (value, teacher) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Mail className="w-3 h-3 text-slate-400" />
            {value}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Phone className="w-3 h-3 text-slate-400" />
            {teacher.phone}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", value === 'ACTIVE' ? "bg-emerald-500" : "bg-slate-300")} />
          <span className="text-[12px] text-slate-600">{value === 'ACTIVE' ? 'Đang làm việc' : 'Nghỉ'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (_, teacher) => canManage && (
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEdit(teacher)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-gold-600 hover:bg-gold-50"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDelete(teacher.id)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { label: 'Tất cả', value: 'ALL' },
          { label: 'Giáo viên chính', value: 'LEAD' },
          { label: 'Trợ giảng', value: 'TA' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value as any)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 relative",
              filterType === tab.value 
                ? "text-gold-600 border-gold-500" 
                : "text-slate-500 border-transparent hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <DataTable 
          title="Quản lý giáo viên"
          columns={columns} 
          data={filteredTeachers} 
          pageSize={10}
          actions={
            canManage && (
              <Button 
                onClick={() => {
                  setEditingTeacher(null);
                  setFormData({ name: '', type: 'LEAD', email: '', phone: '', status: 'ACTIVE' });
                  setIsModalOpen(true);
                }}
                className="h-10 px-5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg gap-2 shadow-lg shadow-gold-500/20 border-none font-semibold text-[13px] transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Thêm nhân sự
              </Button>
            )
          }
        />
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-white rounded-xl shadow-xl border-none">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-semibold text-slate-900">
                {editingTeacher ? 'Cập nhật thông tin' : 'Thêm giáo viên mới'}
              </DialogTitle>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Nhập đầy đủ thông tin nhân sự cần quản lý</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-slate-700">Họ và tên</label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn An..."
                className="h-10 text-[13px] border-slate-200 focus:ring-gold-500 focus:border-gold-500 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-700">Vai trò</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full h-10 px-3 text-[13px] border border-slate-200 rounded-lg focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="LEAD">Giáo viên chính</option>
                  <option value="TA">Trợ giảng</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-700">Trạng thái</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 text-[13px] border border-slate-200 rounded-lg focus:ring-gold-500 focus:border-gold-500 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="ACTIVE">Đang làm việc</option>
                  <option value="INACTIVE">Nghỉ việc</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-slate-700">Email liên hệ</label>
              <Input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="teacher@school.com..."
                className="h-10 text-[13px] border-slate-200 focus:ring-gold-500 focus:border-gold-500 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-slate-700">Số điện thoại</label>
              <Input 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="09xxx..."
                className="h-10 text-[13px] border-slate-200 focus:ring-gold-500 focus:border-gold-500 rounded-lg"
              />
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-10 text-[13px] font-medium border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 h-10 text-[13px] font-semibold bg-gold-500 hover:bg-gold-600 text-white border-none rounded-lg shadow-md shadow-gold-500/20 transition-all active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  editingTeacher ? 'Cập nhật' : 'Thêm mới'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

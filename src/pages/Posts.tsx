import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Plus,
  FileText,
  BookOpen,
  Calendar,
  User,
  ExternalLink,
  BookOpenText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Bí quyết học từ vựng hiệu quả qua hình ảnh',
    category: 'Phương pháp học',
    author: 'Cô Lan',
    date: '2026-03-20',
    description: 'Chia sẻ những phương pháp ghi nhớ từ vựng tiếng Anh nhanh chóng và lâu quên dành cho học sinh tiểu học thông qua sơ đồ tư duy và hình ảnh sinh động.',
    tags: ['Vocabulary', 'Tips', 'Beginner'],
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Tổng hợp cấu trúc ngữ pháp thì Hiện tại đơn',
    category: 'Ngữ pháp',
    author: 'Cô Lan',
    date: '2026-03-18',
    description: 'Hệ thống lại toàn bộ kiến thức về thì hiện tại đơn kèm bài tập vận dụng căn bản giúp con tự tin trong mọi bài kiểm tra.',
    tags: ['Grammar', 'Present Simple'],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Bật mí 5 kho báu Youtube giúp bé "tắm" tiếng Anh mỗi ngày',
    category: 'Tài liệu tham khảo',
    author: 'Cô Lan',
    date: '2026-03-15',
    description: 'Giới thiệu các kênh Youtube có nội dung sinh động, phát âm chuẩn giúp các con luyện nghe tại nhà một cách tự nhiên và đầy hứng khởi.',
    tags: ['Listening', 'Resources'],
    imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=800'
  }
];

export default function PostsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2.5 leading-tight ">
            <BookOpenText className="w-6 h-6 text-[#E6B800]" />
            Bài Đăng
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Tài liệu tham khảo và kiến thức bổ trợ từ giáo viên</p>
        </div>
        {isTeacher && (
          <Button className="bg-[#E6B800] hover:bg-gold-600 text-white shadow-sm h-8 text-[11px] font-bold uppercase tracking-wide px-4 rounded-lg">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tạo bài đăng mới
          </Button>
        )}
      </div>

      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-2.5 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bài đăng..."
            className="pl-8.5 bg-gray-50/50 border-gray-100 h-8 text-[13px] rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-gray-200 text-gray-600 w-full md:w-auto h-8 text-[11px] font-semibold px-4 rounded-lg bg-white">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
          Lọc theo chủ đề
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative flex flex-col">
            {/* Post Image */}
            <div className="aspect-[16/10] w-full overflow-hidden relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <Badge variant="info" className="bg-white/90 backdrop-blur-sm text-blue-600 border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                  {post.category}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2.5">
                <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-300" />
                  {post.date}
                </div>
              </div>

              <h3 className="text-[14px] font-bold text-gray-900 mb-2 group-hover:text-[#E6B800] transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-gray-500 text-[12px] leading-relaxed mb-4 line-clamp-2">
                {post.description}
              </p>

              <div className="flex items-center gap-1.5 mb-4 flex-wrap mt-auto">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center border border-gold-100/50">
                    <User className="w-3.5 h-3.5 text-gold-600" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">{post.author}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-[#E6B800] font-bold text-[11px] hover:bg-gold-50 p-0 h-auto gap-1">
                  XEM CHI TIẾT
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

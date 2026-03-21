import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Library, 
  Receipt, 
  CalendarDays, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';

interface ManagementSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function ManagementSidebar({ activeMenu, onMenuChange }: ManagementSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname;
  const isClassActive = currentPath === '/classes' && (activeMenu === 'danh-sach-lop' || !activeMenu);
  const isAttendanceActive = currentPath === '/attendance' || activeMenu === 'diem-danh';

  return (
    <div className="w-[190px] bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
      <div className="py-4">
        <h2 className="text-[10px] font-bold mb-2 px-4 uppercase tracking-widest text-gray-800">Hệ thống</h2>
        <nav className="space-y-0">
          <Collapsible defaultOpen={(isClassActive || isAttendanceActive)}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 text-[13px] font-medium text-gray-800 hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-2.5">
                <Library className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                Lớp học
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform group-data-[state=open]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-0.5 mt-0.5">
               <button 
                onClick={() => {
                  onMenuChange('danh-sach-lop');
                  navigate('/classes');
                }}
                className={cn(
                  "w-full text-left pl-11 pr-4 py-1.5 text-[13px] font-medium transition-all border-l-2",
                  isClassActive 
                    ? "text-gray-900 bg-gray-50 border-[#E6B800]" 
                    : "text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-50/50"
                )}
              >
                Danh sách
              </button>
              <button 
                onClick={() => {
                  onMenuChange('diem-danh');
                  navigate('/attendance');
                }}
                className={cn(
                  "w-full text-left pl-11 pr-4 py-1.5 text-[13px] font-medium transition-all border-l-2",
                  isAttendanceActive 
                    ? "text-gray-900 bg-gray-50 border-[#E6B800]" 
                    : "text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-50/50"
                )}
              >
                Điểm danh
              </button>
            </CollapsibleContent>
          </Collapsible>

          <button 
            onClick={() => {
                onMenuChange('hoc-sinh');
                navigate('/classes?view=hoc-sinh');
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-all border-l-2",
              activeMenu === 'hoc-sinh' 
                ? "text-gray-900 bg-gray-50 border-[#E6B800]" 
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50"
            )}
          >
            <Users className={cn("w-4 h-4", activeMenu === 'hoc-sinh' ? "text-gray-900" : "text-gray-400")} />
            Học sinh
          </button>
          
          <button 
             onClick={() => {
                onMenuChange('hoc-phi');
                navigate('/payments');
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-all border-l-2",
              activeMenu === 'hoc-phi' || currentPath === '/payments'
                ? "text-gray-900 bg-gray-50 border-[#E6B800]" 
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50"
            )}
          >
            <Receipt className={cn("w-4 h-4", (activeMenu === 'hoc-phi' || currentPath === '/payments') ? "text-gray-900" : "text-gray-400")} />
            Học phí
          </button>
          
          <button 
             onClick={() => {
                onMenuChange('lich-hoc');
                navigate('/schedule');
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-all border-l-2",
              activeMenu === 'lich-hoc' || currentPath === '/schedule'
                ? "text-gray-900 bg-gray-50 border-[#E6B800]" 
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50"
            )}
          >
            <CalendarDays className={cn("w-4 h-4", (activeMenu === 'lich-hoc' || currentPath === '/schedule') ? "text-gray-900" : "text-gray-400")} />
            Lịch học
          </button>
        </nav>
      </div>
    </div>
  );
}

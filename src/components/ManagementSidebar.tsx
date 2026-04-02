import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Library,
  Receipt,
  CalendarDays,
  ChevronRight,
  FileText
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

interface NavItemProps {
  to: string;
  icon?: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isSubItem?: boolean;
}

function NavItem({ to, icon: Icon, label, isActive, onClick, isSubItem }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        "w-full flex items-center transition-all border-l-2",
        isSubItem 
          ? "pl-11 pr-4 py-1.5 text-[13px] font-medium" 
          : "px-4 py-2 text-[13px] font-medium gap-2.5",
        isActive
          ? "text-gold-700 bg-gold-50/50 border-gold-500"
          : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50"
      )}
    >
      {Icon && (
        <Icon 
          className={cn(
            "w-4 h-4", 
            isActive ? "text-gold-600" : "text-gray-400"
          )} 
        />
      )}
      <span>{label}</span>
    </NavLink>
  );
}

export function ManagementSidebar({ activeMenu, onMenuChange }: ManagementSidebarProps) {
  const location = useLocation();

  const currentPath = location.pathname;
  const isClassActive = currentPath === '/classes' && (activeMenu === 'danh-sach-lop' || !activeMenu);
  const isAttendanceActive = currentPath === '/attendance' || activeMenu === 'diem-danh';

  return (
    <div className="w-[150px] bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
      <div className="py-4">
        <h2 className="text-[10px] font-bold mb-2 px-4 tracking-widest text-gray-800">Quản lý</h2>
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
              <NavItem
                to="/classes"
                label="Danh sách"
                isActive={isClassActive}
                isSubItem
                onClick={() => onMenuChange('danh-sach-lop')}
              />
              <NavItem
                to="/attendance"
                label="Điểm danh"
                isActive={isAttendanceActive}
                isSubItem
                onClick={() => onMenuChange('diem-danh')}
              />
            </CollapsibleContent>
          </Collapsible>

          <NavItem
            to="/payments"
            icon={Receipt}
            label="Doanh thu"
            isActive={activeMenu === 'hoc-phi' || currentPath === '/payments'}
            onClick={() => onMenuChange('hoc-phi')}
          />

          <NavItem
            to="/schedule"
            icon={CalendarDays}
            label="Lịch học"
            isActive={activeMenu === 'lich-hoc' || currentPath === '/schedule'}
            onClick={() => onMenuChange('lich-hoc')}
          />

        </nav>
      </div>
    </div>
  );
}

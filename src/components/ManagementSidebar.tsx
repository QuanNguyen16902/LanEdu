import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Library,
  Receipt,
  CalendarDays,
  ChevronRight,
  FileText,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';

interface NavItemProps {
  to: string;
  icon?: React.ElementType;
  label: string;
  isSubItem?: boolean;
}

function NavItem({ to, icon: Icon, label, isSubItem }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={cn(
        "w-full flex items-center transition-all border-l-2",
        isSubItem 
          ? "pl-11 pr-4 py-2 text-[13px] font-medium" 
          : "px-4 py-2.5 text-[13px] font-medium gap-2.5",
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

export function ManagementSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Derive which categories should be open based on paths
  const isClassArea = currentPath === '/classes' || currentPath === '/attendance';

  return (
    <div className="w-[180px] bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
      <div className="py-2">
        <nav className="space-y-0">
          <Collapsible defaultOpen={isClassArea}>
            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 transition-all group">
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
                isSubItem
              />
              <NavItem
                to="/attendance"
                label="Điểm danh"
                isSubItem
              />
            </CollapsibleContent>
          </Collapsible>

          <NavItem
            to="/payments"
            icon={Receipt}
            label="Doanh thu"
          />

          <NavItem
            to="/schedule"
            icon={CalendarDays}
            label="Lịch học"
          />

          <NavItem
            to="/teachers"
            icon={Users}
            label="Giáo viên"
          />

        </nav>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LogOut,
  Menu,
  X,
  LayoutGrid,
  Home,
  BookOpenText
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { Badge } from './ui/Badge';

export function Topbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { icon: Home, label: 'Trang chủ', path: '/', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { icon: LayoutGrid, label: 'Quản lý học sinh', path: '/classes', roles: ['ADMIN', 'TEACHER'] },
    { icon: BookOpenText, label: 'Học thuật', path: '/assignments', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm shadow-gray-200/50">
      <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10 shrink-0">
          <Logo size="md" />
          
          <nav className="hidden lg:flex items-center gap-1">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 relative group",
                  isActive 
                    ? "text-gold-600 bg-gold-50/50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <div className={cn(
                      "absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                    )} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200 mr-2">
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[12px] font-bold text-gray-900">{user?.name}</span>
                <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'TEACHER' ? 'info' : 'success'} className="px-1.5 py-0 h-4 text-[9px] font-medium border-none">
                   {user?.role}
                </Badge>
             </div>
             <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                title={t('common.logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="p-4 space-y-1">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-gold-50 text-gold-700" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

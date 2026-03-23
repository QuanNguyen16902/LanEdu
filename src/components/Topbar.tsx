import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Menu,
  X,
  LayoutGrid,
  Home,
  BookOpenText,
  User,
  ChevronDown,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { Badge } from './ui/Badge';

export function Topbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const currentDate = new Date().toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const menuItems = [
    { icon: Home, label: 'Trang chủ', path: '/', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { icon: LayoutGrid, label: 'Quản lý học sinh', path: '/classes', roles: ['ADMIN', 'TEACHER'] },
    { icon: BookOpenText, label: 'Bài Đăng', path: '/assignments', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const isActiveRoute = (path: string, current: string) => {
    if (path === '/') return current === '/' || current === '/dashboard';
    if (path === '/classes') return ['/classes', '/attendance', '/payments', '/schedule', '/management/assignments'].some(p => current.startsWith(p));
    return current.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm shadow-gray-200/50">
      <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10 shrink-0">
          <Logo size="md" />

          <nav className="hidden lg:flex items-center gap-1">
            {filteredItems.map((item) => {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={() => cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 relative group",
                    isActiveRoute(item.path, location.pathname)
                      ? "text-gold-700 bg-gold-50/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActiveRoute(item.path, location.pathname) ? "text-gold-600" : "text-gray-400 group-hover:text-gold-600"
                  )} />
                  {item.label}
                  <div className={cn(
                    "absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full transition-transform duration-300",
                    isActiveRoute(item.path, location.pathname) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  )} />
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-500">
            <CalendarDays className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-[11px] font-bold tracking-tight">
              {currentDate}
            </span>
          </div>

          <div className="hidden sm:flex items-center pr-1 border-r border-gray-100">
            <LanguageSwitcher />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={cn(
                "flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full transition-all duration-200 bg-gray-50",
                isUserMenuOpen ? "bg-gold-50 shadow-sm" : "hover:bg-gray-100"
              )}
            >
              <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", isUserMenuOpen ? "rotate-180" : "")} />
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-[13px] font-bold text-gray-900 leading-none">{user?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'TEACHER' ? 'info' : 'success'} className="px-1.5 py-0 h-4 text-[9px] font-bold border-none">
                         {user?.role}
                       </Badge>
                       <span className="text-[10px] text-gray-400 font-medium">Online</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors text-left"
                      onClick={() => { setIsUserMenuOpen(false); }}
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-left text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
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
            {filteredItems.map((item) => {
              const active = isActiveRoute(item.path, location.pathname);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={() => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-gold-50 text-gold-700" : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", active ? "text-gold-600" : "text-gray-400")} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

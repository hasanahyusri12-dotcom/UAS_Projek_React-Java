import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  PlusCircle,
  Bell,
  MessageSquare,
  User,
  ShieldCheck,
  Package,
  ArrowRightLeft,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand: Goes to /items if logged in, otherwise / */}
          <Link
            to={isAuthenticated ? '/items' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#E08500] flex items-center justify-center text-white shadow-md shadow-[#2B4E86]/20 group-hover:scale-105 transition-transform duration-200">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Bagi<span className="text-[#E08500]">Pakai</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#FEF0DA] text-[#C47000] uppercase tracking-wider border border-[#FAC780]">
                  Gratis
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                Berbagi Nyata & Berkelanjutan
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Dynamic based on Auth state) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/95 p-1.5 rounded-full border-2 border-[#CFE4FD] shadow-xs">
            {/* Beranda: ONLY shown when NOT logged in */}
            {!isAuthenticated && (
              <Link
                to="/"
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-[#2B4E86] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#2B4E86] hover:bg-[#F0F5FD]'
                }`}
              >
                Beranda
              </Link>
            )}

            <Link
              to="/items"
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                location.pathname === '/items'
                  ? 'bg-[#2B4E86] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#2B4E86] hover:bg-[#F0F5FD]'
              }`}
            >
              Jelajah Barang
            </Link>

            {/* If Logged In, show Dashboard Saya & Serah Terima (NO Beranda) */}
            {isAuthenticated && (
              <>
                <Link
                  to="/my-items"
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                    location.pathname === '/my-items'
                      ? 'bg-[#2B4E86] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#2B4E86] hover:bg-[#F0F5FD]'
                  }`}
                >
                  Dashboard Saya
                </Link>

                <Link
                  to="/transactions"
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                    location.pathname.startsWith('/transactions')
                      ? 'bg-[#2B4E86] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#2B4E86] hover:bg-[#F0F5FD]'
                  }`}
                >
                  Serah Terima
                </Link>
              </>
            )}

            {/* If Admin, show Panel Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/admin'
                    ? 'bg-[#E08500] text-white shadow-xs'
                    : 'text-[#C47000] hover:bg-[#FEF0DA]'
                }`}
              >
                ⭐ Panel Admin
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Bagi Barang Button */}
                <Link
                  to="/post-item"
                  className="flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E08500]/25 hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#FAC780]/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Bagi Barang</span>
                </Link>

                {/* Chat Icon */}
                <Link
                  to="/messages"
                  title="Pesan / Chat"
                  className={`p-2.5 rounded-2xl border-2 transition-colors ${
                    location.pathname.startsWith('/messages')
                      ? 'bg-[#E8F2FE] border-[#A5CBFD] text-[#2B4E86]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-[#F0F5FD] hover:text-[#2B4E86] hover:border-[#CFE4FD]'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  title="Notifikasi"
                  className={`p-2.5 rounded-2xl border-2 transition-colors relative ${
                    location.pathname === '/notifications'
                      ? 'bg-[#E8F2FE] border-[#A5CBFD] text-[#2B4E86]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-[#F0F5FD] hover:text-[#2B4E86] hover:border-[#CFE4FD]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-[#2B4E86] hover:bg-[#F0F5FD]/50 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2B4E86] to-[#E08500] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 max-w-[100px] truncate">
                      @{user?.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border-2 border-[#CFE4FD] py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#F0F5FD] to-transparent">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Masuk sebagai</p>
                        <p className="text-sm font-extrabold text-slate-900 truncate mt-0.5">
                          {user?.fullName || `@${user?.username}`}
                        </p>
                        <div className="mt-1.5">
                          <Badge variant={isAdmin ? 'amber' : 'sage'} size="sm">
                            {isAdmin ? '⭐ Admin Komunitas' : '🌱 Warga BagiPakai'}
                          </Badge>
                        </div>
                      </div>

                      <div className="py-1.5">
                        <Link
                          to="/my-items"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-[#F0F5FD] hover:text-[#2B4E86] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#2B4E86]" />
                          <span>Dashboard Saya</span>
                        </Link>
                        <Link
                          to="/transactions"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-[#F0F5FD] hover:text-[#2B4E86] transition-colors"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-[#2B4E86]" />
                          <span>Riwayat Serah Terima</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Profil Saya</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-[#C47000] hover:bg-[#FEF0DA] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#E08500]" />
                            <span>Panel Admin</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1.5 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* GUEST BUTTONS */
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#2B4E86] hover:bg-[#F0F5FD] transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E08500]/25 hover:shadow-lg transition-all"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/post-item"
                className="p-2 rounded-xl bg-[#E08500] text-white shadow-xs"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {/* Beranda: ONLY when NOT logged in */}
            {!isAuthenticated && (
              <Link
                to="/"
                className={`block px-4 py-2.5 rounded-2xl text-sm font-bold ${
                  location.pathname === '/' ? 'bg-[#E8F2FE] text-[#2B4E86]' : 'text-slate-700'
                }`}
              >
                Beranda
              </Link>
            )}

            <Link
              to="/items"
              className={`block px-4 py-2.5 rounded-2xl text-sm font-bold ${
                location.pathname === '/items' ? 'bg-[#E8F2FE] text-[#2B4E86]' : 'text-slate-700'
              }`}
            >
              Jelajah Barang
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-items"
                  className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700"
                >
                  Dashboard Saya
                </Link>
                <Link
                  to="/transactions"
                  className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700"
                >
                  Serah Terima
                </Link>
                <Link
                  to="/messages"
                  className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700"
                >
                  Pesan / Chat
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700"
                >
                  <span>Notifikasi</span>
                  {unreadCount > 0 && (
                    <Badge variant="coral" size="sm">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-700"
                >
                  Profil Saya
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-[#C47000] bg-[#FEF0DA]"
                  >
                    ⭐ Panel Admin
                  </Link>
                )}
              </>
            ) : null}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-rose-600 bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="text-center py-2.5 rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-700 hover:bg-[#F0F5FD]"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2.5 rounded-2xl text-sm font-bold bg-[#E08500] hover:bg-[#C47000] text-white shadow-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

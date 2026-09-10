import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  PlusCircle,
  Bell,
  MessageSquare,
  User,
  ShieldCheck,
  ArrowRightLeft,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Home,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { confirm } = useConfirm();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi untuk menutup semua menu
  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

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

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Keluar dari Akun?',
      message: 'Apakah kamu yakin ingin keluar dari akun BagiPakai?',
      confirmText: 'Ya, Keluar',
      cancelText: 'Batal',
      variant: 'warning',
    });
    if (ok) {
      logout();
      closeMenus();
      navigate('/');
    }
  };

  const isNavActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-[#CFE4FD]/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link
            to={isAuthenticated ? '/items' : '/'}
            onClick={closeMenus}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#E08500] flex items-center justify-center text-white shadow-md shadow-[#2B4E86]/25 group-hover:scale-105 transition-transform duration-300">
              <HeartHandshake className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Bagi<span className="text-[#E08500]">Pakai</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF0DA] text-[#C47000] border border-[#FAC780] shadow-2xs">
                  GRATIS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold -mt-0.5 hidden sm:inline">
                Berbagi Nyata & Berkelanjutan 🌱
              </span>
            </div>
          </Link>

          {/* Desktop Nav Center Pill */}
          <nav className="hidden md:flex items-center gap-1.5 xl:gap-2 bg-[#F0F5FD]/90 p-1.5 rounded-full border-2 border-[#CFE4FD] shadow-xs">
            {!isAuthenticated && (
              <Link
                to="/"
                onClick={closeMenus}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                  isNavActive('/')
                    ? 'bg-[#2B4E86] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#2B4E86] hover:bg-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </Link>
            )}

            <Link
              to="/items"
              onClick={closeMenus}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                isNavActive('/items')
                  ? 'bg-[#2B4E86] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#2B4E86] hover:bg-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Jelajah Katalog</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-items"
                  onClick={closeMenus}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                    isNavActive('/my-items')
                      ? 'bg-[#2B4E86] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#2B4E86] hover:bg-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Saya</span>
                </Link>

                <Link
                  to="/transactions"
                  onClick={closeMenus}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                    isNavActive('/transactions')
                      ? 'bg-[#2B4E86] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#2B4E86] hover:bg-white'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Serah Terima</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenus}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                  isNavActive('/admin')
                    ? 'bg-[#E08500] text-white shadow-sm'
                    : 'text-[#C47000] hover:bg-[#FEF0DA]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            {isAuthenticated ? (
              <>
                {/* + Bagi Barang CTA Button */}
                <Link
                  to="/post-item"
                  onClick={closeMenus}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E08500] to-[#C47000] hover:from-[#C47000] hover:to-[#9C5402] text-white text-xs sm:text-sm font-black shadow-md shadow-[#E08500]/25 hover:scale-[1.03] active:scale-[0.98] transition-all border border-[#FAC780]/40"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Bagi Barang</span>
                </Link>

                {/* Messages Link */}
                <Link
                  to="/messages"
                  onClick={closeMenus}
                  title="Obrolan & Chat"
                  className={`p-2.5 rounded-2xl border-2 transition-all ${
                    isNavActive('/messages')
                      ? 'bg-[#E8F2FE] border-[#2B4E86] text-[#2B4E86] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-[#F0F5FD] hover:text-[#2B4E86] hover:border-[#CFE4FD]'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Link */}
                <Link
                  to="/notifications"
                  onClick={closeMenus}
                  title="Notifikasi"
                  className={`p-2.5 rounded-2xl border-2 transition-all relative ${
                    isNavActive('/notifications')
                      ? 'bg-[#E8F2FE] border-[#2B4E86] text-[#2B4E86] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-[#F0F5FD] hover:text-[#2B4E86] hover:border-[#CFE4FD]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white border-2 border-[#CFE4FD] hover:border-[#2B4E86] hover:bg-[#F0F5FD]/60 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2B4E86] to-[#E08500] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-800 max-w-[110px] truncate">
                      @{user?.username}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180 text-[#2B4E86]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Box */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-3xl shadow-2xl border-2 border-[#CFE4FD] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Brief Card */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#F0F5FD] to-[#F4F8FE]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Masuk sebagai
                        </p>
                        <p className="text-sm font-black text-slate-900 truncate mt-0.5">
                          {user?.fullName || `@${user?.username}`}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Badge variant={isAdmin ? 'amber' : 'sage'} size="sm">
                            {isAdmin ? '⭐ Admin Komunitas' : '🌱 Warga BagiPakai'}
                          </Badge>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1.5">
                        <Link
                          to="/my-items"
                          onClick={closeMenus}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-[#F0F5FD] hover:text-[#2B4E86] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#2B4E86]" />
                          <span>Dashboard Saya</span>
                        </Link>
                        <Link
                          to="/transactions"
                          onClick={closeMenus}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-[#F0F5FD] hover:text-[#2B4E86] transition-colors"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-[#2B4E86]" />
                          <span>Riwayat Serah Terima</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={closeMenus}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-[#F0F5FD] hover:text-[#2B4E86] transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Profil Akun</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={closeMenus}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-black text-[#C47000] hover:bg-[#FEF0DA] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#E08500]" />
                            <span>Panel Admin Moderasi</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
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
              /* Guest Actions */
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#2B4E86] hover:bg-[#F0F5FD] border border-transparent hover:border-[#CFE4FD] transition-all"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="px-5 py-2.5 rounded-2xl bg-[#E08500] hover:bg-[#C47000] text-white text-xs sm:text-sm font-black shadow-md shadow-[#E08500]/25 hover:shadow-lg transition-all"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  onClick={closeMenus}
                  className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-700"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/post-item"
                  onClick={closeMenus}
                  className="p-2 rounded-xl bg-[#E08500] text-white shadow-xs"
                  title="Bagi Barang"
                >
                  <PlusCircle className="w-5 h-5" />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-[#F0F5FD] transition-colors cursor-pointer border border-slate-200 bg-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#CFE4FD] bg-white/98 backdrop-blur-2xl px-5 pt-4 pb-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {isAuthenticated && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F5FD] to-[#E8F2FE] border border-[#CFE4FD] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2B4E86] to-[#E08500] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Masuk sebagai</p>
                  <p className="text-sm font-black text-slate-900">@{user?.username}</p>
                </div>
              </div>
              <Badge variant={isAdmin ? 'amber' : 'sage'} size="sm">
                {isAdmin ? 'Admin' : 'Warga'}
              </Badge>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/items"
              onClick={closeMenus}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                isNavActive('/items')
                  ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-5 h-5 text-[#2B4E86]" />
              <span>Jelajah Katalog</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-items"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                    isNavActive('/my-items')
                      ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-[#2B4E86]" />
                  <span>Dashboard Saya</span>
                </Link>

                <Link
                  to="/transactions"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                    isNavActive('/transactions')
                      ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ArrowRightLeft className="w-5 h-5 text-[#2B4E86]" />
                  <span>Riwayat Serah Terima</span>
                </Link>

                <Link
                  to="/messages"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                    isNavActive('/messages')
                      ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 text-[#2B4E86]" />
                  <span>Pesan & Obrolan</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                    isNavActive('/profile')
                      ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-5 h-5 text-slate-500" />
                  <span>Profil Saya</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-[#C47000] bg-[#FEF0DA] border border-[#FAC780]"
                  >
                    <ShieldCheck className="w-5 h-5 text-[#E08500]" />
                    <span>Panel Admin Komunitas</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/"
                onClick={closeMenus}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                  isNavActive('/')
                    ? 'bg-[#E8F2FE] text-[#2B4E86] font-black'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-5 h-5 text-[#2B4E86]" />
                <span>Beranda</span>
              </Link>
            )}
          </div>

          {/* Bottom Drawer Actions */}
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black text-rose-600 bg-rose-50 border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="text-center py-3 rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-700 hover:bg-[#F0F5FD]"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="text-center py-3 rounded-2xl text-sm font-black bg-[#E08500] hover:bg-[#C47000] text-white shadow-md shadow-[#E08500]/20"
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
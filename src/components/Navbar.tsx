'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <nav className="relative z-20 border-b border-blue-800/30 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25">
                <span className="text-white font-bold text-lg sm:text-xl">🏁</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-racing text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
                  KARTEANDO<span className="text-sky-400">.CL</span>
                </h1>
                <p className="text-blue-300 text-xs font-medium hidden sm:block">Racing Platform</p>
              </div>
            </div>

            {/* Navigation Links & Auth */}
            <div className="flex items-center space-x-2 sm:space-x-6 min-w-0">
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                <a href="/" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Live View
                </a>
                <a href="/squadron" className="text-electric-blue hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm font-racing">
                  🏁 Escuderías
                </a>
                <a href="/clases" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Clases
                </a>
                <a href="#" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Rankings
                </a>
                <a href="#" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Carreras
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-blue-300 hover:text-cyan-400 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Auth Section */}
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-300 font-medium text-sm hidden sm:inline">Cargando...</span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* User info */}
                  <div className="text-right hidden md:block">
                    <p className="text-cyan-400 font-medium text-sm">
                      {user.profile.alias || `${user.profile.firstName} ${user.profile.lastName}`}
                    </p>
                  </div>

                  {/* Dashboard button */}
                  <a
                    href="/dashboard"
                    className="px-2 sm:px-4 py-1.5 sm:py-2 text-cyan-400 hover:text-white transition-all border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/20 font-medium text-xs sm:text-sm"
                  >
                    <span className="sm:hidden">🏆</span>
                    <span className="hidden sm:inline">🏆 Dashboard</span>
                  </a>

                  {/* Admin button */}
                  {user.email === 'icabreraquezada@gmail.com' && (
                    <a
                      href="/admin"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 text-red-400 hover:text-white transition-all border border-red-400/30 rounded-lg hover:bg-red-400/10 hover:shadow-lg hover:shadow-red-400/20 font-medium text-xs sm:text-sm"
                    >
                      <span className="sm:hidden">👑</span>
                      <span className="hidden sm:inline">👑 Admin</span>
                    </a>
                  )}

                  {/* User avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full flex items-center justify-center border border-cyan-400/50">
                    <span className="text-cyan-400 font-bold text-xs">
                      {user.profile.firstName.charAt(0)}{user.profile.lastName.charAt(0)}
                    </span>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-300 hover:text-cyan-400 border border-blue-400/30 hover:border-cyan-400/50 rounded transition-all font-medium uppercase tracking-wider"
                  >
                    <span className="sm:hidden">✕</span>
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-cyan-400 hover:text-white border border-cyan-400/50 hover:border-cyan-400 rounded-lg transition-all hover:bg-cyan-400/10 font-medium uppercase tracking-wider"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-400/50 font-medium uppercase tracking-wider"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mt-4 pb-4 border-t border-blue-800/30 pt-4">
              <div className="flex flex-col space-y-3">
                <a href="/" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Live View
                </a>
                <a href="/squadron" className="text-electric-blue hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm font-racing">
                  🏁 Escuderías
                </a>
                <a href="/clases" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Clases
                </a>
                <a href="#" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Rankings
                </a>
                <a href="#" className="text-blue-300 hover:text-cyan-400 transition-colors font-medium uppercase tracking-wider text-sm">
                  Carreras
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}

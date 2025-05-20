"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header({ onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div>
            <Image src="/cstlogo.png" alt="CST Logo" width={70} height={70} className="img-border" />
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a href="/home" className="text-gray-700 hover:text-primary">Home</a>
            <a href="/about" className="text-gray-700 hover:text-primary">About</a>
            <a href="/service" className="text-gray-700 hover:text-primary">Services</a>
            <a href="/project" className="text-gray-700 hover:text-primary">Projects</a>
          </nav>
          {/* Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
          {user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary focus:outline-none"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <span>{user.username}</span>
                <svg className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="bg-primary text-white px-6 py-2 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer btn btn-primary hidden md:block"
              onClick={onLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-lg absolute w-full left-0 top-20 z-30 animate-fade-in-down">
          <div className="flex flex-col space-y-4 px-8 py-6">
            <a href="/" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="/about" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>About</a>
            <a href="/service" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="/project" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>Projects</a>
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2 border-t border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-gray-700">{user.username}</span>
                </div>
                <a href="/profile" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>Profile</a>
                <a href="/settings" className="text-gray-700 hover:text-primary" onClick={() => setMenuOpen(false)}>Settings</a>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700 text-left"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-primary text-white px-6 py-2 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer btn btn-primary"
                onClick={() => { setMenuOpen(false); onLoginClick && onLoginClick(); }}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
} 
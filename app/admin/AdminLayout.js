"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import cstLogo from "@/public/cstlogo.png";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children, activeTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const audioRef = useRef(new Audio('/notification.mp3'));
  const hasPlayedSound = useRef(false);
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
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/');
      }
    };
    checkAuth();

    // Listen for profile update events
    const handleProfileUpdate = () => {
      checkAuth();
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [router]);

  // Fetch notifications function
  const fetchNotifications = () => {
    fetch("/api/user/notifications", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const newNotifications = data.notifications || [];
        const unreadCount = newNotifications.filter(n => !n.read).length;
        
        // Play sound only once when page loads and there are unread notifications
        if (unreadCount > 0 && !hasPlayedSound.current) {
          audioRef.current.play().catch(err => console.log('Error playing sound:', err));
          hasPlayedSound.current = true;
        }
        
        setNotifications(newNotifications);
      })
      .catch(() => setNotifications([]));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifOpen) {
      fetchNotifications(); // Fetch when bell is opened
    }
  }, [notifOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleBellClick = () => {
    setNotifOpen(v => {
      if (!v) {
        // Only mark as read when opening
        fetch('/api/user/notifications', { method: 'PUT', credentials: 'include' })
          .then(() => fetchNotifications());
      }
      return !v;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-16 border-b">
          <Image src={cstLogo} alt="CST Logo" width={40} height={40} className="mr-2" />
          <span className="text-xl font-semibold">Admin Panel</span>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link href="/admin" className={`w-full flex items-center px-4 py-2 rounded-lg ${activeTab === "dashboard" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <i className="ri-dashboard-line mr-3 text-xl" />
              Dashboard
            </Link>
            <Link href="/admin/complaints" className={`w-full flex items-center px-4 py-2 rounded-lg ${activeTab === "complaints" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <i className="ri-customer-service-2-line mr-3 text-xl" />
              Complaints
            </Link>
            <Link href="/admin/users" className={`w-full flex items-center px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <i className="ri-user-line mr-3 text-xl" />
              Users
            </Link>
            <Link href="/admin/staff" className={`w-full flex items-center px-4 py-2 rounded-lg ${activeTab === "staff" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <i className="ri-team-line mr-3 text-xl" />
              Staff
            </Link>
            <Link href="/admin/settings" className={`w-full flex items-center px-4 py-2 rounded-lg ${activeTab === "settings" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <i className="ri-settings-4-line mr-3 text-xl" />
              Settings
            </Link>
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-menu-line text-2xl" />
            </button>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button className="text-gray-500 hover:text-gray-700 relative" onClick={handleBellClick}>
                  <i className="ri-notification-3-line text-xl" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">{notifications.filter(n => !n.read).length}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b font-semibold flex justify-between items-center">
                      <span>Notifications</span>
                      <span className="text-xs text-gray-500">{notifications.length > 3 ? 'Latest 3' : ''}</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500">No notifications</div>
                    ) : (
                      notifications.slice(0, 3).map((n, i) => (
                        <div key={i} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                          <div className="font-medium">{n.title || n.message || "Notification"}</div>
                          {n.createdAt && <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setProfileOpen(v => !v)}>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl || avatarPreview ? (
                      <img
                        src={avatarPreview || user?.imageUrl}
                        alt="Profile"
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    ) : (
                      <i className="ri-user-line text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.username || 'Admin'}</span>
                  <i className="ri-arrow-down-s-line text-gray-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
} 
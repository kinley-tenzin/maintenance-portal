"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [csvLoading, setCsvLoading] = useState("");
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setUser(data.user);
          setFormData(prev => ({
            ...prev,
            username: data.user.username,
            email: data.user.email
          }));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Failed to load profile');
      }
    };
    checkAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated successfully');
        setUser(prev => ({ ...prev, username: formData.username, email: formData.email }));
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        window.dispatchEvent(new Event('userProfileUpdated'));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");
    setSuccess("");
    
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
        setSuccess('Profile picture updated successfully');
      } else {
        setError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  async function handleExport(type) {
    setCsvLoading(type);
    try {
      const res = await fetch(`/api/export/${type}`);
      if (!res.ok) throw new Error("Failed to export " + type);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setCsvLoading("");
    }
  }

  return (
    <AdminLayout activeTab="settings">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-8">
        {/* Profile Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
              {user?.imageUrl || avatarPreview ? (
                <img
                  src={avatarPreview || user?.imageUrl}
                  alt="Profile"
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-500 mt-2">{success}</p>}
          </div>
          <form className="space-y-2 max-w-md" onSubmit={handleProfileUpdate}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password to change password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm New Password</label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-500 mt-2">{success}</p>}
            <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Update Profile</button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Notification Preferences</h2>
          <form className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailNotif" checked readOnly />
              <label htmlFor="emailNotif">Email notifications for new complaints</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="smsNotif" />
              <label htmlFor="smsNotif">SMS notifications for assignments</label>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded" type="button" disabled>Save Preferences</button>
          </form>
        </section>

        {/* System Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-2">System Preferences</h2>
          <form className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="maintenanceMode" />
              <label htmlFor="maintenanceMode">Enable Maintenance Mode</label>
            </div>
            <div>
              <label className="block text-sm font-medium">Theme</label>
              <select className="border rounded px-2 py-1 w-full" defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded" type="button" disabled>Save System Settings</button>
          </form>
        </section>

        {/* Export Data */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Export Data</h2>
          <div className="flex gap-4 flex-wrap items-center">
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => handleExport("complaints")}>{csvLoading === "complaints" ? "Exporting..." : "Export Complaints (CSV)"}</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => handleExport("users")}>{csvLoading === "users" ? "Exporting..." : "Export Users (CSV)"}</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => handleExport("staff")}>{csvLoading === "staff" ? "Exporting..." : "Export Staff (CSV)"}</button>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <div className="text-gray-600">
            <div>Maintenance Services Admin Panel</div>
            <div>Version: 1.0.0</div>
            <div>Developed by Kinley Tenzin</div>
            <div>Contact: 02230133.cst@rub.edu.bt</div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
} 
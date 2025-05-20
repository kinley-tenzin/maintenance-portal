"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import cstLogo from "@/public/cstlogo.png";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef();

  // Fetch complaints and stats
  async function fetchComplaints() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/complaints", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data.complaints || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
    intervalRef.current = setInterval(fetchComplaints, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Calculate stats
  const stats = {
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === "Open" || c.status === "pending").length,
    resolvedToday: complaints.filter(c => c.status === "Resolved" && new Date(c.date).toDateString() === new Date().toDateString()).length,
    avgResolutionTime: (() => {
      const resolved = complaints.filter(c => c.status === "Resolved" && c.createdAt && c.date);
      if (!resolved.length) return "-";
      const avgMs = resolved.reduce((sum, c) => sum + (new Date(c.date) - new Date(c.createdAt)), 0) / resolved.length;
      const days = avgMs / (1000 * 60 * 60 * 24);
      return days.toFixed(1) + " days";
    })(),
  };

  const recentComplaints = complaints.slice(0, 4);

  return (
    <AdminLayout activeTab="dashboard">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Complaints</p>
              <p className="text-2xl font-bold">{stats.totalComplaints}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <i className="ri-customer-service-2-line text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Complaints</p>
              <p className="text-2xl font-bold">{stats.openComplaints}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <i className="ri-time-line text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved Today</p>
              <p className="text-2xl font-bold">{stats.resolvedToday}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Resolution Time</p>
              <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="ri-timer-line text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Recent Complaints Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentComplaints.map((complaint) => (
                  <tr key={complaint._id || complaint.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.roomId || complaint.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.status === 'Open' || complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.date ? new Date(complaint.date).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-primary hover:text-blue-700 mr-3">
                        <i className="ri-eye-line" />
                      </button>
                      <button className="text-primary hover:text-blue-700">
                        <i className="ri-edit-line" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 
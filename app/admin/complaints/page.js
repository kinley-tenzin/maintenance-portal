"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

const statusColors = {
  Open: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

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

  async function fetchStaff() {
    try {
      const res = await fetch("/api/technicians", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaffList(data.technicians || []);
    } catch (err) {
      setStaffList([]);
    }
  }

  async function handleStatusChange(id, newStatus) {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchComplaints();
    } catch (err) {
      alert(err.message);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete complaint");
      await fetchComplaints();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAssign(id, staffId) {
    setAssigningId(id);
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ assignedTo: staffId }),
      });
      if (!res.ok) throw new Error("Failed to assign staff");
      await fetchComplaints();
    } catch (err) {
      alert(err.message);
    } finally {
      setAssigningId(null);
    }
  }

  return (
    <AdminLayout activeTab="complaints">
      <h1 className="text-2xl font-bold mb-4">Complaints Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Loading complaints...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : complaints.length === 0 ? (
          <div>No complaints found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((c) => (
                  <tr key={c._id || c.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{c.roomId || c.room || "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.block || "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{c.category || "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[c.status] || "bg-gray-100 text-gray-800"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={c.assignedTo || ""}
                        disabled={assigningId === (c._id || c.id)}
                        onChange={e => handleAssign(c._id || c.id, e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {staffList.map(staff => (
                          <option key={staff._id} value={staff._id}>{staff.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm flex items-center gap-2">
                      <button
                        className="text-primary hover:text-blue-700"
                        onClick={() => setSelectedComplaint(c)}
                        title="View details"
                      >
                        <i className="ri-eye-line" />
                      </button>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={c.status}
                        disabled={statusUpdating}
                        onChange={e => handleStatusChange(c._id || c.id, e.target.value)}
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(c._id || c.id)}
                        disabled={deletingId === (c._id || c.id)}
                        title="Delete complaint"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal for complaint details */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedComplaint(null)}
            >
              <i className="ri-close-line text-2xl" />
            </button>
            <div>
              <h2 className="text-xl font-bold mb-2">Complaint Details</h2>
              <div className="mb-2"><b>Room:</b> {selectedComplaint.roomId || selectedComplaint.room}</div>
              <div className="mb-2"><b>Block:</b> {selectedComplaint.block}</div>
              <div className="mb-2"><b>Category:</b> {selectedComplaint.category}</div>
              <div className="mb-2"><b>Status:</b> {selectedComplaint.status}</div>
              <div className="mb-2"><b>Assigned To:</b> {selectedComplaint.assignedTo ? staffList.find(s => s._id === selectedComplaint.assignedTo)?.name || selectedComplaint.assignedTo : "Unassigned"}</div>
              <div className="mb-2"><b>Date:</b> {selectedComplaint.date ? new Date(selectedComplaint.date).toLocaleString() : "-"}</div>
              <div className="mb-2"><b>Description:</b> {selectedComplaint.text || selectedComplaint.description}</div>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
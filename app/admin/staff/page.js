"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [addData, setAddData] = useState({ name: "", email: "", phone: "", specialization: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/technicians", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaff(data.technicians || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this technician?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/technicians/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete technician");
      await fetchStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAdd() {
    setAdding(true);
    try {
      const res = await fetch("/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addData),
      });
      if (!res.ok) throw new Error("Failed to add technician");
      setAddMode(false);
      setAddData({ name: "", email: "", phone: "", specialization: "" });
      await fetchStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <AdminLayout activeTab="staff">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      <div className="mb-4">
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => setAddMode(true)}>
          + Add Technician
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Loading staff...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : staff.length === 0 ? (
          <div>No technicians found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((s) => (
                  <tr key={s._id || s.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{s.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{s.phone}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{s.specialization}</td>
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <button className="text-primary hover:text-blue-700" onClick={() => setSelectedStaff(s)} title="View details">
                        <i className="ri-eye-line" />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(s._id || s.id)} disabled={deletingId === (s._id || s.id)} title="Delete">
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
      {/* Modal for add/view staff */}
      {(selectedStaff || addMode) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => { setSelectedStaff(null); setAddMode(false); }}
            >
              <i className="ri-close-line text-2xl" />
            </button>
            {addMode ? (
              <>
                <h2 className="text-xl font-bold mb-2">Add Technician</h2>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Name</label>
                  <input className="border rounded px-2 py-1 w-full" value={addData.name} onChange={e => setAddData({ ...addData, name: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input className="border rounded px-2 py-1 w-full" value={addData.email} onChange={e => setAddData({ ...addData, email: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Phone</label>
                  <input className="border rounded px-2 py-1 w-full" value={addData.phone} onChange={e => setAddData({ ...addData, phone: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Specialization</label>
                  <input className="border rounded px-2 py-1 w-full" value={addData.specialization} onChange={e => setAddData({ ...addData, specialization: e.target.value })} />
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded mt-2" onClick={handleAdd} disabled={adding}>{adding ? "Adding..." : "Add"}</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">Technician Details</h2>
                <div className="mb-2"><b>Name:</b> {selectedStaff.name}</div>
                <div className="mb-2"><b>Email:</b> {selectedStaff.email}</div>
                <div className="mb-2"><b>Phone:</b> {selectedStaff.phone}</div>
                <div className="mb-2"><b>Specialization:</b> {selectedStaff.specialization}</div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
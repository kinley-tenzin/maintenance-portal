"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout activeTab="users">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{u.username}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{u.role}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.active === false ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {u.active === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <button className="text-primary hover:text-blue-700" onClick={() => setSelectedUser(u)} title="View details">
                        <i className="ri-eye-line" />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(u._id || u.id)} disabled={deletingId === (u._id || u.id)} title="Delete">
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
      {/* Modal for view user */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedUser(null)}
            >
              <i className="ri-close-line text-2xl" />
            </button>
                <h2 className="text-xl font-bold mb-2">User Details</h2>
                <div className="mb-2"><b>Username:</b> {selectedUser.username}</div>
                <div className="mb-2"><b>Email:</b> {selectedUser.email}</div>
                <div className="mb-2"><b>Role:</b> {selectedUser.role}</div>
                <div className="mb-2"><b>Status:</b> {selectedUser.active === false ? "Inactive" : "Active"}</div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
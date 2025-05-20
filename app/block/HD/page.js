"use client";
import Image from "next/image";
import { useState } from "react";
import generateRooms from "../generateRooms";
import cstLogo from "@/public/cstlogo.png";
import Header from "../../components/Header";
import Link from "next/link";

export default function HDRoomMaintenance() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [rooms, setRooms] = useState(() => generateRooms("HD"));
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [category, setCategory] = useState("");
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup" | "forgot"
  const [signup, setSignup] = useState({ username: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [complaintMsg, setComplaintMsg] = useState("");
  const categories = [
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Cleaning",
    "Other",
  ];

  const openComplaintForm = (roomId) => {
    setSelectedRoomId(roomId);
    setComplaintText("");
    setComplaintOpen(true);
  };
  const closeComplaintForm = () => {
    setComplaintOpen(false);
    setSelectedRoomId(null);
    setComplaintText("");
    setCategory("");
  };
  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintText.trim() || !category) return;
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          block: 'HD',
          roomId: selectedRoom ? selectedRoom.name : selectedRoomId,
          category,
          text: complaintText.trim(),
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === selectedRoomId
              ? {
                  ...room,
                  hasComplaint: true,
                  complaints: [
                    ...room.complaints,
                    { text: complaintText.trim(), category, date: new Date().toISOString() },
                  ],
                }
              : room
          )
        );
        setComplaintMsg('Complaint submitted successfully!');
      } else {
        setComplaintMsg('Failed to submit complaint.');
      }
    } catch (err) {
      setComplaintMsg('An error occurred.');
    }
    setTimeout(() => {
      setComplaintMsg("");
      closeComplaintForm();
    }, 2000);
  };
  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${newsletter}`);
    setNewsletter("");
  };
  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    setSignup({ username: "", password: "" });
    setLoginOpen(false);
  };
  const handleForgot = (e) => {
    e.preventDefault();
    // TODO: Implement forgot password logic
    setForgotEmail("");
    setAuthTab("login");
  };
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <i className="ri-phone-line ri-lg mr-2" />
              <span>+975 17591181</span>
            </div>
            <div className="flex items-center">
              <i className="ri-mail-line ri-lg mr-2" />
              <span>kinleykaks@gmail.com</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/share/1MsD5si7HB/" className="hover:text-secondary"><i className="ri-facebook-line ri-lg" /></a>
            <a href="https://x.com/tenzykinley?t=NjDlCgqAP6rx2Ajxy-KwGg&s=09" className="hover:text-secondary"><i className="ri-twitter-line ri-lg" /></a>
            <a href="https://www.linkedin.com/in/kinley-tenzin-a4abb7320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="hover:text-secondary"><i className="ri-linkedin-line ri-lg" /></a>
            <a href="#" className="hover:text-secondary"><i className="ri-instagram-line ri-lg" /></a>
          </div>
        </div>
      </div>
      {/* Header */}
      <Header onLoginClick={() => setLoginOpen(true)} />
      <Link href="/service" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <i className="ri-arrow-left-line mr-2"></i>
        Back
      </Link>
      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                {authTab === "login" && "User Login"}
                {authTab === "signup" && "Sign Up"}
                {authTab === "forgot" && "Forgot Password"}
              </h5>
              <button onClick={() => { setLoginOpen(false); setAuthTab("login"); }} className="text-gray-500 hover:text-gray-700">
                <span aria-hidden>×</span>
              </button>
            </div>
            {authTab === "login" && (
              <form className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control w-full border rounded px-3 py-2" id="username" placeholder="Enter your username" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control w-full border rounded px-3 py-2" id="password" placeholder="Enter your password" required />
                </div>
                <div className="mb-3 flex items-center">
                  <input type="checkbox" className="form-check-input mr-2" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Login</button>
              </form>
            )}
            {authTab === "signup" && (
              <form onSubmit={handleSignup} className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="signup-email" className="form-label">Email</label>
                  <input type="email" className="form-control w-full border rounded px-3 py-2" id="signup-email" placeholder="Enter your email" required value={signup.email || ""} onChange={e => setSignup({ ...signup, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="signup-username" className="form-label">Username</label>
                  <input type="text" className="form-control w-full border rounded px-3 py-2" id="signup-username" placeholder="Enter your username" required value={signup.username} onChange={e => setSignup({ ...signup, username: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="signup-password" className="form-label">Password</label>
                  <input type="password" className="form-control w-full border rounded px-3 py-2" id="signup-password" placeholder="Enter your password" required value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
                  <input type="password" className="form-control w-full border rounded px-3 py-2" id="signup-confirm" placeholder="Confirm your password" required value={signup.confirm || ""} onChange={e => setSignup({ ...signup, confirm: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Sign Up</button>
              </form>
            )}
            {authTab === "forgot" && (
              <form onSubmit={handleForgot} className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="forgot-email" className="form-label">Email</label>
                  <input type="email" className="form-control w-full border rounded px-3 py-2" id="forgot-email" placeholder="Enter your email" required value={forgotEmail || ""} onChange={e => setForgotEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Reset Password</button>
                <button type="button" className="w-full mt-2 text-primary underline" onClick={() => setAuthTab('login')}>Back to Login</button>
              </form>
            )}
            <div className="flex justify-between px-6 pb-4">
              {authTab !== "login" && <button type="button" className="text-primary" onClick={() => setAuthTab("login")}>Login</button>}
              {authTab !== "signup" && <button type="button" className="text-primary" onClick={() => setAuthTab("signup")}>Sign Up</button>}
              {authTab !== "forgot" && <button type="button" className="text-primary" onClick={() => setAuthTab("forgot")}>Forgot Password?</button>}
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="relative flex-1">
        <div className="absolute inset-0 z-10">
          <Image src="/bg.jpg" alt="Background" fill className="object-cover opacity-95" priority />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">HD Room Maintenance</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="cursor-pointer transform transition-all duration-200 hover:scale-105"
                onClick={() => openComplaintForm(room.id)}
                id={`room-${room.id}`}
              >
                <div className={`aspect-square rounded-lg ${room.hasComplaint ? "bg-blue-700" : "bg-white"} shadow-sm border border-gray-200 flex items-center justify-center`}>
                  <i className={`ri-home-4-line text-4xl ${room.hasComplaint ? "text-yellow-300" : "text-gray-400"}`}></i>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className={`font-medium ${room.hasComplaint ? 'text-white' : 'text-gray-900'}`}>{room.name}</p>
                  {room.hasComplaint && (
                    <span className="text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded-full font-semibold">
                      {room.complaints.length} issue{room.complaints.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Complaint Form Modal */}
        {complaintOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative border border-gray-200 pointer-events-auto">
              <button
                onClick={closeComplaintForm}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                aria-label="Close complaint form"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">Submit Maintenance Request</h2>
              <p className="text-gray-600 mb-4">Room: <span className="font-bold">{selectedRoom ? selectedRoom.name : selectedRoomId}</span></p>
              <label className="block mb-2 font-medium text-gray-700" htmlFor="category">Category</label>
              <select
                id="category"
                className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea
                className="w-full h-32 border rounded-lg p-3 mb-4"
                placeholder="Describe the maintenance issue..."
                value={complaintText}
                onChange={e => setComplaintText(e.target.value)}
                autoFocus
              />
              {complaintMsg && (
                <div className={`mb-4 ${complaintMsg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border px-4 py-3 rounded`}>{complaintMsg}</div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={closeComplaintForm} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-button">Cancel</button>
                <button onClick={submitComplaint} className="px-4 py-2 text-white bg-primary rounded-button" disabled={!category || !complaintText.trim()}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image src={cstLogo} alt="CST Logo" width={110} height={110} className="img-border mb-4" />
              <p className="text-gray-400 mb-6">Your trusted partner for professional Maintenance services. Available 24/7 for all your electrical needs.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="ri-facebook-line ri-lg" /></a>
                <a href="https://x.com/tenzykinley?t=NjDlCgqAP6rx2Ajxy-KwGg&s=09" className="text-gray-400 hover:text-white"><i className="ri-twitter-line ri-lg" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="ri-linkedin-line ri-lg" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="ri-instagram-line ri-lg" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/service" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="/project" className="text-gray-400 hover:text-white">Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <i className="ri-map-pin-line ri-lg mr-3" />
                  <span className="text-gray-400">College of Science and Technology, Phuentsholing, chhukha, Bhutan</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-phone-line ri-lg mr-3" />
                  <span className="text-gray-400">+975 17591181</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line ri-lg mr-3" />
                  <span className="text-gray-400">kinleykaks@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and special offers.</p>
              <form className="space-y-4" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-button bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary"
                  value={newsletter}
                  onChange={e => setNewsletter(e.target.value)}
                  required
                />
                <button className="w-full bg-primary text-white px-6 py-2 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2025 KT. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
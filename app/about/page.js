"use client";
import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header";

// Add this mapping at the top of the file (after imports)
const hostelRooms = [
  ...Array.from({ length: 12 }, (_, i) => `1-${String(i + 1).padStart(2, '0')}`),
  ...Array.from({ length: 13 }, (_, i) => `2-${String(i + 1).padStart(2, '0')}`),
  ...Array.from({ length: 12 }, (_, i) => `3-${String(i + 1).padStart(2, '0')}`),
  ...Array.from({ length: 12 }, (_, i) => `4-${String(i + 1).padStart(2, '0')}`),
];
const blockRooms = {
  HA: hostelRooms,
  HB: hostelRooms,
  HC: hostelRooms,
  HD: hostelRooms,
  HE: hostelRooms,
  HF: hostelRooms,
  NK: hostelRooms,
  RKA: hostelRooms,
  RKB: hostelRooms,
  Class: [
    ...Array.from({ length: 10 }, (_, i) => `${100 + i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `${200 + i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `${300 + i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `${400 + i + 1}`),
  ],
};

const categories = [
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Cleaning",
  "Other",
];

export default function About() {
  // Modal state
  const [showLogin, setShowLogin] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup" | "forgot"
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  // Login form state
  const [login, setLogin] = useState({ username: "", password: "", remember: false });
  const [loginMsg, setLoginMsg] = useState("");
  // Signup form state
  const [signup, setSignup] = useState({ username: "", password: "", email: "", confirm: "" });
  const [signupMsg, setSignupMsg] = useState("");
  const [signupMsgType, setSignupMsgType] = useState("success");
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotMsgType, setForgotMsgType] = useState("success");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");

  // Newsletter submit
  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterMsg("Please enter your email address");
      setTimeout(() => setNewsletterMsg(""), 3000);
      return;
    }
    setNewsletterMsg("Subscribed successfully!");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterMsg(""), 3000);
  };

  // Login submit
  const handleLogin = (e) => {
    e.preventDefault();
    if (!login.username || !login.password) {
      setLoginMsg("Please fill in all fields");
      setTimeout(() => setLoginMsg(""), 3000);
      return;
    }
    setLoginMsg("Login successful!");
    setTimeout(() => setLoginMsg(""), 3000);
    setShowLogin(false);
    setLogin({ username: "", password: "", remember: false });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signup.email || !signup.username || !signup.password || !signup.confirm) {
      setSignupMsg("Please fill in all fields");
      setSignupMsgType("error");
      setTimeout(() => setSignupMsg(""), 3000);
      return;
    }
    if (signup.password !== signup.confirm) {
      setSignupMsg("Passwords do not match");
      setSignupMsgType("error");
      setTimeout(() => setSignupMsg(""), 3000);
      return;
    }
    setSignupMsg("Sign up successful!");
    setSignup({ username: "", password: "", email: "", confirm: "" });
    setShowLogin(false);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMsg("Please enter your email");
      setForgotMsgType("error");
      setTimeout(() => setForgotMsg(""), 3000);
      return;
    }
    setForgotMsg("Reset link sent!");
    setForgotEmail("");
    setTimeout(() => setForgotMsg(""), 3000);
    setAuthTab("login");
  };

  const handleServiceRequest = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    if (!category || !selectedBlock || !selectedRoom || !description.trim()) {
      setSubmitMsg("Please fill in all fields.");
      return;
    }
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          block: selectedBlock,
          roomId: selectedRoom,
          category,
          text: description.trim(),
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSubmitMsg('Complaint submitted successfully!');
        setCategory("");
        setSelectedBlock("");
        setSelectedRoom("");
        setDescription("");
      } else {
        const data = await res.json();
        setSubmitMsg(data.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      setSubmitMsg('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <i className="ri-phone-line ri-lg mr-2"></i>
              <span>+975 17591181</span>
            </div>
            <div className="flex items-center">
              <i className="ri-mail-line ri-lg mr-2"></i>
              <span>kinleykaks@gmail.com</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/share/16YdrdUQSX/" className="hover:text-secondary"><i className="ri-facebook-line ri-lg"></i></a>
            <a href="https://x.com/tenzykinley?t=NjDlCgqAP6rx2Ajxy-KwGg&s=09" className="hover:text-secondary"><i className="ri-twitter-line ri-lg"></i></a>
            <a href="https://www.linkedin.com/in/kinley-tenzin-a4abb7320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="hover:text-secondary"><i className="ri-linkedin-line ri-lg"></i></a>
            <a href="https://www.instagram.com/ifyk_ykmf?igsh=MW9jNTZxeno1dTlndg==" className="hover:text-secondary"><i className="ri-instagram-line ri-lg"></i></a>
          </div>
        </div>
      </div>
      {/* Header */}
      <Header onLoginClick={() => setShowLogin(true)} />
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                {authTab === "login" && "User Login"}
                {authTab === "signup" && "Sign Up"}
                {authTab === "forgot" && "Forgot Password"}
              </h5>
              <button onClick={() => { setShowLogin(false); setAuthTab("login"); }} className="text-gray-500 hover:text-gray-700">
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
      {/* Hero/About Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/40">
          <Image src="/work2.jpg" fill className="w-full h-full object-cover img-border" alt="Maintenance Services" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 animate-slide-in-left hero-h1-contrast">About Our Maintenance Services</h1>
            <p className="text-xl text-white mb-8 animate-slide-in-left-slow">Dedicated to maintaining excellence in educational infrastructure. Our team ensures optimal functionality of facilities for enhanced learning experiences.</p>
            <a href="/service" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-blue-700 transition-colors cursor-pointer inline-block">Request Service</a>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="service-card bg-white p-6 rounded shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-home-gear-line text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Room Maintenance</h3>
            <p className="text-gray-600">Comprehensive room maintenance including repairs, painting, and general upkeep of classroom and laboratory spaces.</p>
          </div>
          <div className="service-card bg-white p-6 rounded shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-flashlight-line text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Electrical Systems</h3>
            <p className="text-gray-600">Professional electrical maintenance and repairs for all campus facilities, ensuring safety and efficiency.</p>
          </div>
          <div className="service-card bg-white p-6 rounded shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="ri-water-flash-line text-primary text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Plumbing Services</h3>
            <p className="text-gray-600">Expert plumbing maintenance and emergency repairs for all water and drainage systems.</p>
          </div>
        </div>
      </div>
      {/* Process Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Process</h2>
          <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
            <div className="process-step relative flex-1 text-center px-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-file-list-3-line text-primary text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Request Submission</h3>
              <p className="text-gray-600">Submit your maintenance request through our online portal</p>
              <div className="process-line"></div>
            </div>
            <div className="process-step relative flex-1 text-center px-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-search-line text-primary text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Assessment</h3>
              <p className="text-gray-600">Our team evaluates the request and schedules service</p>
              <div className="process-line"></div>
            </div>
            <div className="process-step relative flex-1 text-center px-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-tools-line text-primary text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Service Execution</h3>
              <p className="text-gray-600">Professional maintenance work is carried out</p>
              <div className="process-line"></div>
            </div>
            <div className="process-step relative flex-1 text-center px-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-checkbox-circle-line text-primary text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Quality Check</h3>
              <p className="text-gray-600">Final inspection ensures work meets our standards</p>
            </div>
          </div>
        </div>
      </div>
      {/* Contact & Service Request Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Information</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Emergency Hotline</h3>
                <p className="text-gray-600">24/7 Emergency: +975 17591181</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Service Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2 text-gray-900">Location</h3>
                <p className="text-gray-600">Building NK, Room 404<br/>College of Science and Technology</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Service Request</h2>
            <form className="bg-white rounded-lg shadow-lg p-8" onSubmit={handleServiceRequest}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="block-select">
                  Block
                </label>
                <select
                  id="block-select"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                  value={selectedBlock}
                  onChange={e => {
                    setSelectedBlock(e.target.value);
                    setSelectedRoom("");
                  }}
                  required
                >
                  <option value="">Select a block</option>
                  {Object.keys(blockRooms).map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
              </div>
              {selectedBlock && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="room-select">
                    Room
                  </label>
                  <select
                    id="room-select"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                    value={selectedRoom}
                    onChange={e => setSelectedRoom(e.target.value)}
                    required
                  >
                    <option value="">Select a room</option>
                    {blockRooms[selectedBlock].map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea id="description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary" value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              {submitMsg && (
                <div className={`mb-4 ${submitMsg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border px-4 py-3 rounded`}>{submitMsg}</div>
              )}
              <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-button hover:bg-blue-700 transition-colors cursor-pointer">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Team Section */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src="/team1.jpg" width={400} height={192} className="w-full h-48 object-cover img-border" alt="Team member" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Karma Wangda</h3>
                <p className="text-primary mb-2">Maintenance Councilor</p>
                <p className="text-gray-600 text-sm">experience in maintenance management</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src="/team2.jpg" width={400} height={192} className="w-full h-48 object-cover img-border" alt="Team member" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Kinley Wangchuk</h3>
                <p className="text-primary mb-2">Lead manager</p>
                <p className="text-gray-600 text-sm">experienced in electrical systems</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src="/team3.jpg" width={400} height={192} className="w-full h-48 object-cover img-border" alt="Team member" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">sonam wangmo</h3>
                <p className="text-primary mb-2">Assistant </p>
                <p className="text-gray-600 text-sm">experienced and skilled technician</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src="/team4.jpg" width={400} height={192} className="w-full h-48 object-cover img-border" alt="Team member" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Dorji Gyeltshen</h3>
                <p className="text-primary mb-2">IT Infrastructure Manager</p>
                <p className="text-gray-600 text-sm">experienced in IT systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div>
                <Image src="/cstlogo.png" alt="CST Logo" width={110} height={110} className="img-border" />
              </div>
              <p className="text-gray-400 mb-6">Your trusted partner for professional Maintenance services. Available 24/7 for all your electrical needs.</p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/share/16YdrdUQSX/" className="text-gray-400 hover:text-white"><i className="ri-facebook-line ri-lg"></i></a>
                <a href="https://x.com/tenzykinley?t=NjDlCgqAP6rx2Ajxy-KwGg&s=09" className="text-gray-400 hover:text-white"><i className="ri-twitter-line ri-lg"></i></a>
                <a href="https://www.linkedin.com/in/kinley-tenzin-a4abb7320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-white"><i className="ri-linkedin-line ri-lg"></i></a>
                <a href="https://www.instagram.com/ifyk_ykmf?igsh=MW9jNTZxeno1dTlndg==" className="text-gray-400 hover:text-white"><i className="ri-instagram-line ri-lg"></i></a>
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
                  <i className="ri-map-pin-line ri-lg mr-3"></i>
                  <span className="text-gray-400">College of Science and Technology, Phuentsholing, chhukha, Bhutan</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-phone-line ri-lg mr-3"></i>
                  <span className="text-gray-400">+975 17591181</span>
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line ri-lg mr-3"></i>
                  <span className="text-gray-400">kinleykaks@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and special offers.</p>
              <form className="space-y-4" onSubmit={handleNewsletter}>
                <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-button bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
                <button className="w-full bg-primary text-white px-6 py-2 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer">
                  Subscribe Now
                </button>
              </form>
              {newsletterMsg && <div className="mt-4 text-center text-green-500">{newsletterMsg}</div>}
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
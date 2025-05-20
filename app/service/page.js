"use client";
import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header";

export default function Service() {
  // Modal state
  const [showLogin, setShowLogin] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup" | "forgot"
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  // Login form state
  const [login, setLogin] = useState({ username: "", password: "", remember: false });
  const [loginMsg, setLoginMsg] = useState("");
  const [signup, setSignup] = useState({ username: "", password: "", email: "", confirm: "" });
  const [signupMsg, setSignupMsg] = useState("");
  const [signupMsgType, setSignupMsgType] = useState("success");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotMsgType, setForgotMsgType] = useState("success");

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
    setSignupMsgType("success");
    setTimeout(() => setSignupMsg(""), 3000);
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
    setForgotMsg("Reset link sent");
    setForgotMsgType("success");
    setTimeout(() => setForgotMsg(""), 3000);
    setShowLogin(false);
  };

  // Hostel/classroom blocks data
  const blocks = [
    { name: "RKA", img: "/RKA.jpg", link: "/block/RKA" },
    { name: "RKB", img: "/RKB.jpg", link: "/block/RKB" },
    { name: "Block HA", img: "/HA.jpg", link: "/block/HA" },
    { name: "Block HB", img: "/HB.jpg", link: "/block/HB" },
    { name: "Block HC", img: "/HC.jpg", link: "/block/HC" },
    { name: "Block HD", img: "/HD.jpg", link: "/block/HD" },
    { name: "Block HE", img: "/HE.jpg", link: "/block/HE" },
    { name: "Block HF", img: "/HF.jpg", link: "/block/HF" },
    { name: "Block NK", img: "/NK.jpg", link: "/block/NK" },
    { name: "Academic buildings", img: "/class.jpg", link: "/block/Class" },
  ];

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
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/50">
          <Image src="/service.jpg" fill className="w-full h-full object-cover img-border" alt="Hero Image" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl border-white">
            <h1 className="text-5xl font-bold drop-shadow-lg animate-slide-in-left hero-h1-contrast">Hostels and classes maintenance</h1>
            <p className="text-2xl font-bold text-white drop-shadow-lg animate-slide-in-left-slow"> Available 24/7 for all your maintenance needs.</p>
          </div>
        </div>
      </section>
      {/* Hostel/Classroom Blocks Grid */}
      <div className="flex flex-wrap justify-center items-center gap-6 p-5 bg-white">
        {blocks.slice(0, 5).map((block, idx) => (
          <div key={block.name} className="img-box flex flex-col items-center" style={{ flexBasis: 300, height: 600 }}>
            <a href={block.link} className="w-full h-full flex flex-col items-center">
              <Image src={block.img} width={300} height={600} className="w-full h-full object-cover img-border" alt={block.name} style={{ backgroundImage: "var(--img)", flexBasis: 300, height: 600 }} />
            </a>
            <h3 className="font-bold mb-5 text-center text-lg text-gray-900" style={{ color: '#1a237e' }}>{block.name}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 p-5 bg-white">
        {blocks.slice(5).map((block, idx) => (
          <div key={block.name} className="img-box flex flex-col items-center" style={{ flexBasis: 300, height: 600 }}>
            <a href={block.link} className="w-full h-full flex flex-col items-center">
              <Image src={block.img} width={300} height={600} className="w-full h-full object-cover img-border" alt={block.name} style={{ backgroundImage: "var(--img)", flexBasis: 300, height: 600 }} />
            </a>
            <h3 className="font-bold mb-5 text-center text-lg text-gray-900" style={{ color: '#1a237e' }}>{block.name}</h3>
          </div>
        ))}
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
              <h4 className="text-xl font-bold mb-6 text-gray-900">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/service" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="/project" className="text-gray-400 hover:text-white">Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-gray-900">Contact Info</h4>
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
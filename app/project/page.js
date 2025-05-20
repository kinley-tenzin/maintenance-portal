"use client";
import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header";

export default function Project() {
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
    setForgotMsg("Reset link sent");
    setForgotEmail("");
    setTimeout(() => setForgotMsg(""), 3000);
    setAuthTab("login");
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
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/40">
          <Image src="/project.jpg" fill className="w-full h-full object-cover img-border" alt="Project Hero Image" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold animate-slide-in-left hero-h1-contrast">Our Completed Projects</h1>
            <p className="text-xl mb-8 animate-slide-in-left-slow">Explore our portfolio of successful maintenance projects and installations across various departments.</p>
          </div>
        </div>
      </section>
      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our comprehensive maintenance solutions implemented across campus facilities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/electric.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="Electrical Project" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Hostel Electrical Upgrade</h3>
                  <p className="mb-4">Complete rewiring of CST hostels</p>
                  <span className="bg-white text-primary px-4 py-1 rounded-full text-sm">Electrical</span>
                </div>
              </div>
            </div>
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/plumbing.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="Plumbing Project" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Campus Plumbing System</h3>
                  <p className="mb-4">Water supply system overhaul</p>
                  <span className="bg-white text-primary px-4 py-1 rounded-full text-sm">Plumbing</span>
                </div>
              </div>
            </div>
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/ac.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="AC Maintenance" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Classroom AC Maintenance</h3>
                  <p className="mb-4">Annual HVAC system servicing</p>
                  <span className="bg-white text-primary px-4 py-1 rounded-full text-sm">HVAC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Project Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Project Statistics</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our achievements in numbers</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">250+</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-gray-600">Expert Technicians</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>
      {/* Project Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Project Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We specialize in various types of maintenance projects</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="category-card p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-building-4-line ri-3x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Infrastructure Maintenance</h3>
              <p className="text-gray-600 text-center">Building structure maintenance and repairs</p>
            </div>
            <div className="category-card p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-cpu-line ri-3x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">System Upgrades</h3>
              <p className="text-gray-600 text-center">Modernization of existing systems</p>
            </div>
            <div className="category-card p-8 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-shield-check-line ri-3x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Safety Installations</h3>
              <p className="text-gray-600 text-center">Emergency systems and safety equipment</p>
            </div>
          </div>
        </div>
      </section>
      {/* Project Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Project Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our systematic approach to delivering quality projects</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="process-step">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-clipboard-line ri-2x"></i>
              </div>
              <h3 className="font-bold mb-2">Consultation</h3>
              <p className="text-gray-600">Understanding project requirements</p>
            </div>
            <div className="process-step">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-draft-line ri-2x"></i>
              </div>
              <h3 className="font-bold mb-2">Planning</h3>
              <p className="text-gray-600">Developing project strategy</p>
            </div>
            <div className="process-step">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-tools-line ri-2x"></i>
              </div>
              <h3 className="font-bold mb-2">Execution</h3>
              <p className="text-gray-600">Quality implementation</p>
            </div>
            <div className="process-step">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="ri-check-double-line ri-2x"></i>
              </div>
              <h3 className="font-bold mb-2">Delivery</h3>
              <p className="text-gray-600">Final handover</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-['Pacifico'] text-3xl text-white mb-6">
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
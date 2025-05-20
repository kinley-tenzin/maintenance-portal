"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        setShowLoginModal(false);
        setLoginData({ username: "", password: "" });
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowSignupModal(false);
        setShowLoginModal(true);
        setSignupData({ username: "", email: "", password: "" });
        setSuccess("Registration successful! Please login.");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred during signup");
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowNewsletterModal(false);
        setNewsletterEmail("");
        setSuccess("Successfully subscribed to newsletter!");
      } else {
        setError(data.message || "Subscription failed");
      }
    } catch (error) {
      setError("An error occurred during subscription");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowForgotModal(false);
        setForgotEmail("");
        setSuccess("Password reset instructions sent to your email!");
      } else {
        setError(data.message || "Password reset request failed");
      }
    } catch (error) {
      setError("An error occurred during password reset request");
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
      <Header onLoginClick={() => setShowLoginModal(true)} />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                Login
              </h5>
              <button onClick={() => { setShowLoginModal(false); setShowForgotModal(true); }} className="text-gray-500 hover:text-gray-700">
                <span aria-hidden>×</span>
              </button>
            </div>
            <form onSubmit={handleLogin} className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control w-full border rounded px-3 py-2" id="username" placeholder="Enter your username" required value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control w-full border rounded px-3 py-2" id="password" placeholder="Enter your password" required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                </div>
                <div className="mb-3 flex items-center">
                  <input type="checkbox" className="form-check-input mr-2" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <div className="flex justify-between px-6 pb-4">
                <button type="button" className="text-primary" onClick={() => { setShowLoginModal(false); setShowForgotModal(true); }}>Forgot Password?</button>
                <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Login</button>
              </div>
              </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                Sign Up
              </h5>
              <button onClick={() => setShowSignupModal(false)} className="text-gray-500 hover:text-gray-700">
                <span aria-hidden>×</span>
              </button>
            </div>
              <form onSubmit={handleSignup} className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="signup-email" className="form-label">Email</label>
                <input type="email" className="form-control w-full border rounded px-3 py-2" id="signup-email" placeholder="Enter your email" required value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="signup-username" className="form-label">Username</label>
                <input type="text" className="form-control w-full border rounded px-3 py-2" id="signup-username" placeholder="Enter your username" required value={signupData.username} onChange={e => setSignupData({ ...signupData, username: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="signup-password" className="form-label">Password</label>
                <input type="password" className="form-control w-full border rounded px-3 py-2" id="signup-password" placeholder="Enter your password" required value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} />
                </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
                <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Sign Up</button>
              </form>
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                Subscribe to Newsletter
              </h5>
              <button onClick={() => setShowNewsletterModal(false)} className="text-gray-500 hover:text-gray-700">
                <span aria-hidden>×</span>
              </button>
            </div>
            <form onSubmit={handleNewsletter} className="px-6 py-4">
              <div className="mb-3">
                <label htmlFor="newsletter-email" className="form-label">Email</label>
                <input type="email" className="form-control w-full border rounded px-3 py-2" id="newsletter-email" placeholder="Enter your email" required value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
              </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Subscribe</button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h5 className="text-lg font-semibold">
                Reset Password
              </h5>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-500 hover:text-gray-700">
                <span aria-hidden>×</span>
              </button>
            </div>
              <form onSubmit={handleForgot} className="px-6 py-4">
                <div className="mb-3">
                  <label htmlFor="forgot-email" className="form-label">Email</label>
                <input type="email" className="form-control w-full border rounded px-3 py-2" id="forgot-email" placeholder="Enter your email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button type="submit" className="btn btn-primary w-full bg-primary text-white py-2 rounded-button">Send Reset Link</button>
              </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          {success}
          <button
            onClick={() => setSuccess("")}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/40">
          <Image src="/home.jpg" fill className="w-full h-full object-cover img-border" alt="Hero Image" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold animate-slide-in-left hero-h1-contrast">Professional Maintenance Services for Your Room & Classes</h1>
            <p className="text-xl mb-8 animate-slide-in-left-slow">Expert solutions delivered by skilled team. Available 24/7 for all your maintenance needs.</p>
            <div className="flex space-x-4">
              <a href="/service" className="bg-primary text-white px-8 py-3 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer inline-block">Submit Request</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide maintenance services for your respective rooms and classes, ensuring safety and reliability.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Cards */}
            <div className="service-card p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-flashlight-line ri-2x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Electrical Installation</h3>
              <p className="text-gray-600 text-center mb-4">Professional installation services for all your electrical needs, from new construction to renovations.</p>
              <a href="https://douglaselectric.us/electrical-installation-and-maintenance/" target="_blank" className="text-primary hover:text-blue-700 flex items-center justify-center">
                Learn More <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
            <div className="service-card p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-tools-line ri-2x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Maintenance & Repair</h3>
              <p className="text-gray-600 text-center mb-4">Regular maintenance and prompt repair services to keep your systems running smoothly.</p>
              <a href="https://www.aztecplumbing.net/blog/plumbing-maintenance-tips/" target="_blank"className="text-primary hover:text-blue-700 flex items-center justify-center">
                Learn More <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
            <div className="service-card p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <i className="ri-home-gear-line ri-2x text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Smart Solutions</h3>
              <p className="text-gray-600 text-center mb-4">Advanced smart maintenance for your properties</p>
              <a href="https://www.bakkersliedrecht.com/en/solutions/smart-maintenance/" target="_blank" className="text-primary hover:text-blue-700 flex items-center justify-center">
                Learn More <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image src="/work1.jpg" width={600} height={400} className="rounded-lg shadow-lg w-full h-auto img-border" alt="About Us" />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Excellence in Campus Maintenance Services</h2>
              <p className="text-gray-600 mb-6">We are dedicated to providing top-quality maintenance solutions with a focus on safety, reliability, and efficiency. Our team of certified professionals brings expertise and commitment to every work, ensuring that your college facilities are well-maintained and fully operational. From routine upkeep to emergency repairs, we prioritize creating a safe and comfortable environment for students, faculty, and staff.</p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <i className="ri-check-line ri-2x text-primary mr-4"></i>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-900">Trusted & Reliable</h4>
                    <p className="text-gray-600">Committed to delivering exceptional service.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="ri-time-line ri-2x text-primary mr-4"></i>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-900">24/7 Service</h4>
                    <p className="text-gray-600">Emergency response available</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="ri-shield-check-line ri-2x text-primary mr-4"></i>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-900">Guaranteed Work</h4>
                    <p className="text-gray-600">100% satisfaction guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="ri-team-line ri-2x text-primary mr-4"></i>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-900">Expert Team</h4>
                    <p className="text-gray-600">Skilled professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Recent Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our portfolio of successful electrical installations and solutions across various places.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/fan.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="Commercial Project" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Fan Installation</h3>
                  <p className="mb-4">CST Hostels</p>
                </div>
              </div>
            </div>
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/socket.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="Residential Project" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Home Setup</h3>
                  <p className="mb-4">college Residence</p>
                </div>
              </div>
            </div>
            <div className="project-card relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/repair.jpg" width={600} height={256} className="w-full h-64 object-cover img-border" alt="Industrial Project" />
              <div className="project-overlay absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Repair services</h3>
                  <p className="mb-4">phuentsholing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Client Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Here's what our Lecturers have to say about our services.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image src="/Dr. Cheki Dorji.jpeg" width={48} height={48} className="w-12 h-12 rounded-full mr-4 img-border" alt="Client" />
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Cheki Dorji</h4>
                  <p className="text-gray-600">President</p>
                </div>
              </div>
              <p className="text-gray-600">"Exceptional service from start to finish. The team was professional, efficient, and completed our office renovation ahead of schedule. Highly recommended!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image src="/kelzang dorji.jpg" width={48} height={48} className="w-12 h-12 rounded-full mr-4 img-border" alt="Client" />
                <div>
                  <h4 className="font-bold text-gray-900">Kelzang Dorji</h4>
                  <p className="text-gray-600">Dean of Student Affairs</p>
                </div>
              </div>
              <p className="text-gray-600">"Their expertise in electrical systems is unmatched. They've been maintaining our building's electrical infrastructure for years with excellent results."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Image src="/chimi.webp" width={48} height={48} className="w-12 h-12 rounded-full mr-4 img-border" alt="Client" />
                <div>
                  <h4 className="font-bold text-gray-900">Chimi Dem</h4>
                  <p className="text-gray-600">Student Service Officer</p>
                </div>
              </div>
              <p className="text-gray-600">"The home installation was seamless. The team was knowledgeable and helped us choose the perfect solutions for our needs. Outstanding service!"</p>
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
                <Image src="/cstlogo.png" alt="CST Logo" width={70} height={70} className="img-border" />
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
              <h4 className="text-xl font-bold mb-6 text-gray-900">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and special offers.</p>
              <form className="space-y-4" onSubmit={handleNewsletter}>
                <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-button bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
                <button className="w-full bg-primary text-white px-6 py-2 rounded-button hover:bg-blue-700 transition duration-300 whitespace-nowrap cursor-pointer">
                  Subscribe Now
                </button>
              </form>
              {error && <div className="mt-4 text-center text-red-500">{error}</div>}
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

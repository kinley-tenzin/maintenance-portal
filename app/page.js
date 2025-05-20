"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingAuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        if (res.ok) {
          setIsAuthenticated(true);
    router.replace("/home");
        }
      } catch (error) {
        console.error('Auth check error:', error);
  }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setIsAuthenticated(true);
        if (data.user && data.user.role === 'admin') {
          router.replace("/admin");
        } else {
          router.replace("/home");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
    setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });
      
      const data = await res.json();
      
      if (res.ok) {
        setTab("login");
        setSignupData({ username: "", password: "", email: "" });
        setError(""); // Clear any previous errors
      } else {
      setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show auth form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 font-bold border-b-2 transition-colors ${tab === "login" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-bold border-b-2 transition-colors ${tab === "signup" ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-700"
              value={loginData.username}
              onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-700"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded font-bold hover:bg-blue-800 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-700"
              value={signupData.username}
              onChange={e => setSignupData({ ...signupData, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-700"
              value={signupData.email}
              onChange={e => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-700"
              value={signupData.password}
              onChange={e => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded font-bold hover:bg-blue-800 transition"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

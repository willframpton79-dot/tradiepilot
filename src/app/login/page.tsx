"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("joe@tradiepilot.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-navy" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-white">
              Tradie<span className="text-amber">Pilot</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              Profit Intelligence
            </p>
          </div>
        </div>

        <div className="card-elevated">
          <h2 className="text-lg font-heading font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-surface border border-navy-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber/40 transition-colors"
                placeholder="joe@tradiepilot.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy-surface border border-navy-border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber/40 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-profit-red bg-profit-red/5 border border-profit-red/20 rounded-lg p-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber text-navy font-semibold py-2.5 rounded-lg hover:bg-amber-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-amber hover:text-amber-400">
              Sign up
            </a>
          </p>

          <div className="mt-4 pt-4 border-t border-navy-border">
            <p className="text-[10px] text-gray-500 text-center">
              Demo: use any email/password to sign in
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
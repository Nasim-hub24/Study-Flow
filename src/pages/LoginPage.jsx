import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    await loginAsDemo();
    setSubmitting(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 p-6 sm:p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-6 space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-content flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-md">
              S
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-xs text-base-content/60">
              Sign in to your StudyFlow account to continue
            </p>
          </div>

          {/* Quick Demo Login Option */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="btn btn-outline btn-primary w-full gap-2 border-dashed font-semibold"
            >
              <FiUserCheck className="text-lg" />
              <span>Sign In as Demo Student</span>
            </button>
            <div className="divider text-xs text-base-content/40 my-4">OR USE CREDENTIALS</div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label font-medium text-xs pb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-10 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center pb-1">
                <label className="label font-medium text-xs p-0">Password</label>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-10 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full gap-2 mt-2 shadow-xs"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer link to register */}
          <div className="text-center text-xs text-base-content/70 mt-6 pt-4 border-t border-base-200">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

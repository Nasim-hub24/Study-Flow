import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiZap,
  FiArrowRight,
  FiShield,
  FiBookOpen,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function LandingPage() {
  const { isAuthenticated, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoSignIn = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide animate-pulse">
              <FiZap /> Modern Study Management for Ambitious Students
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Turn chaotic study hours into{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                visible progress
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-base-content/70 leading-relaxed font-normal">
              StudyFlow gives students a single place to organize tasks, track focus sessions with interactive Pomodoro timers, and visualize academic improvement with clear charts.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-md sm:btn-lg gap-2 shadow-lg shadow-primary/25">
                  Go to Your Dashboard <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-md sm:btn-lg gap-2 shadow-lg shadow-primary/25">
                    Get Started Free <FiArrowRight />
                  </Link>
                  <button
                    type="button"
                    onClick={handleDemoSignIn}
                    className="btn btn-outline btn-md sm:btn-lg gap-2"
                  >
                    🚀 Try Instant Demo
                  </button>
                </>
              )}
            </div>

            {/* Quick highlight pills */}
            <div className="pt-8 flex flex-wrap justify-center gap-6 text-xs text-base-content/60 font-medium">
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-success" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-success" /> Focus Timer & Analytics
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-success" /> Dark & Light Themes
              </span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-base-200/50 px-4 sm:px-6 border-y border-base-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Built for Academic Excellence</h2>
              <p className="text-xs sm:text-sm text-base-content/70">
                Everything you need to master assignments, ace exams, and build unbeatable daily study habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-base-100 p-6 border border-base-200 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  <FiBookOpen />
                </div>
                <h3 className="font-bold text-lg">Subjects & Smart Tasks</h3>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  Color-code your courses, set due dates and priorities, and stay on top of upcoming exams with intuitive task filtering and completion streaks.
                </p>
              </div>

              <div className="card bg-base-100 p-6 border border-base-200 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl font-bold">
                  <FiClock />
                </div>
                <h3 className="font-bold text-lg">Focus Timer & Logging</h3>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  Deep work made simple with Pomodoro intervals, custom timers, and manual logging. Every minute is linked directly to your subjects and tasks.
                </p>
              </div>

              <div className="card bg-base-100 p-6 border border-base-200 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl font-bold">
                  <FiBarChart2 />
                </div>
                <h3 className="font-bold text-lg">Visual Analytics</h3>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  Beautiful interactive charts show your weekly hours, subject breakdown, and completion rates so you always know where your effort went.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h3 className="text-2xl font-bold">Why Students Love StudyFlow</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="card bg-base-200/40 p-6 rounded-2xl border border-base-200 space-y-3">
                <p className="text-xs sm:text-sm text-base-content/80 italic">
                  "StudyFlow changed how I study for finals. Seeing the weekly chart and keeping my 7-day streak motivated me to log 25+ hours of pure focus every week."
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                    AR
                  </div>
                  <div>
                    <p className="font-bold text-xs">Alex Rivera</p>
                    <p className="text-[11px] text-base-content/50">Computer Science & Math Student</p>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200/40 p-6 rounded-2xl border border-base-200 space-y-3">
                <p className="text-xs sm:text-sm text-base-content/80 italic">
                  "Having my tasks and Pomodoro timer in one clean dashboard without distractions is exactly what I needed. The subject color coding is brilliant!"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-xs">
                    SP
                  </div>
                  <div>
                    <p className="font-bold text-xs">Sarah Patel</p>
                    <p className="text-[11px] text-base-content/50">Pre-Med Chemistry Major</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-primary text-primary-content px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-black">Ready to elevate your study habits?</h2>
            <p className="text-sm opacity-90 max-w-xl mx-auto">
              Join thousands of learners planning their coursework and hitting their goals with StudyFlow.
            </p>
            <div className="pt-4">
              <Link to="/register" className="btn btn-secondary btn-md sm:btn-lg font-bold shadow-md">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

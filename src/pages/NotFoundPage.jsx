import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="card max-w-md w-full bg-base-100 border border-base-200 shadow-xl p-8 space-y-5 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-4xl font-black">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
            <p className="text-xs text-base-content/60 leading-relaxed">
              We couldn't find the page or study route you requested. It might have moved or the URL might be mistyped.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link to="/dashboard" className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs">
              <FiHome /> Back to Dashboard
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm rounded-xl gap-2">
              <FiCompass /> Landing Page
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

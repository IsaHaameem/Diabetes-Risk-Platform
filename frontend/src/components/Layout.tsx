import React from 'react';
import { Activity, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 cursor-pointer">
              <Activity className="h-8 w-8 text-secondary" />
              <span className="font-bold text-xl tracking-wide text-slate-900">DiabetesRisk AI</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Dashboard</Link>
                  <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">History</Link>
                  <Link to="/analytics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Analytics</Link>
                  <Link to="/models" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Models</Link>
                  <Link to="/batch" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Batch Mode</Link>
                  <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 transition">
                    <LogOut size={16} className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Login</Link>
                  <Link to="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition shadow-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white border-t py-6">
        <div className="text-center text-sm text-gray-500">
          © 2026 Diabetes Risk Intelligence Platform. Healthcare decision support system.
        </div>
      </footer>
    </div>
  );
};
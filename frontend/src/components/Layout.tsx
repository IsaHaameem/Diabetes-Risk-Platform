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
      <nav className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 cursor-pointer">
              <Activity className="h-8 w-8 text-secondary" />
              <span className="font-bold text-xl tracking-wide">DiabetesRisk AI</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition">Dashboard</Link>
                  <Link to="/history" className="text-sm font-medium text-gray-300 hover:text-white transition">History</Link>
                  <Link to="/analytics" className="text-sm font-medium text-gray-300 hover:text-white transition">Analytics</Link>
                  <Link to="/models" className="text-sm font-medium text-gray-300 hover:text-white transition">Models</Link>
                  <Link to="/batch" className="text-sm font-medium text-gray-300 hover:text-white transition">Batch Mode</Link>
                  <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition">
                    <LogOut size={16} className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">Login</Link>
                  <Link to="/signup" className="text-sm font-medium bg-secondary px-4 py-2 rounded hover:bg-blue-500 transition text-white">Sign Up</Link>
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
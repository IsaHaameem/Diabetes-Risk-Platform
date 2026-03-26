import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, BrainCircuit, FileBarChart } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold text-primary tracking-tight">
          Next-Generation <span className="text-secondary">Diabetes Risk</span> Intelligence
        </h1>
        <p className="text-lg text-gray-600">
          Empower your clinical decision-making with our advanced ML pipeline. Get instant probabilities, SHAP explainability, and AI-driven insights.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/signup" className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-500 transition shadow-lg">
            Start Free Trial
          </Link>
          <Link to="/login" className="px-8 py-3 bg-white text-primary border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition">
            Practitioner Login
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <BrainCircuit className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">XGBoost Predictions</h3>
          <p className="text-gray-500 text-sm">High-accuracy risk stratification trained on standardized PIMA datasets.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <Activity className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">SHAP Explainability</h3>
          <p className="text-gray-500 text-sm">Transparent AI. See exactly which biomarkers drove the risk assessment.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <FileBarChart className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Automated Reporting</h3>
          <p className="text-gray-500 text-sm">Generate batch CSVs or download comprehensive PDF patient reports instantly.</p>
        </div>
      </div>
    </div>
  );
};
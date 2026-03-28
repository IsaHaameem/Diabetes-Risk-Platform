import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PredictionResponse, PatientData } from '../services/api';
import { AlertCircle, CheckCircle, ArrowLeft, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChatAssistant } from '../components/ChatAssistant';
import { downloadReport } from '../services/api';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const state = location.state as { result: PredictionResponse, inputData: PatientData } | null;

  if (!state) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">No Assessment Data Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { result, inputData } = state;
  const probabilityPercent = (result.probability * 100).toFixed(1);

  const isHighRisk = result.risk_level === 'High';
  const isMediumRisk = result.risk_level === 'Medium';

  const colorClass = isHighRisk
    ? 'text-red-600'
    : isMediumRisk
    ? 'text-yellow-600'
    : 'text-green-600';

  const bgClass = isHighRisk
    ? 'bg-red-50 border-red-200'
    : isMediumRisk
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-green-50 border-green-200';

  const Icon = isHighRisk || isMediumRisk ? AlertCircle : CheckCircle;

  const shapData = Object.entries(result.shap_values).map(([name, value]) => ({
    name,
    value,
    impact: value > 0 ? 'Increases Risk' : 'Decreases Risk',
  }));

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadReport(inputData, result);
    } catch (error) {
      console.error('PDF Download failed:', error);
      alert('Failed to generate PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 relative">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`flex items-center text-white px-4 py-2 rounded-lg transition-all ${
            downloading ? 'bg-gray-400' : 'bg-slate-900 hover:bg-black'
          }`}
        >
          <Download size={16} className="mr-2" />
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* 🔥 PREMIUM TOP BANNER */}
      <div className="relative overflow-hidden p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-xl">

        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${
            isHighRisk
              ? 'bg-red-400'
              : isMediumRisk
              ? 'bg-yellow-400'
              : 'bg-green-400'
          }`}
        ></div>

        <div className="flex items-center gap-6 relative z-10">

          <div className={`p-4 rounded-2xl bg-white/60 backdrop-blur-md border ${colorClass}`}>
            <Icon size={48} strokeWidth={1.5} />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              AI Diagnostic Result
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              Risk Level:
              <span className={`px-4 py-1 rounded-full border ${bgClass} ${colorClass}`}>
                {result.risk_level}
              </span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl text-center min-w-[180px] hover:scale-105 transition">
          <p className="text-sm text-slate-400 uppercase tracking-wide">Probability</p>
          <p className="text-5xl font-black">
            {probabilityPercent}
            <span className="text-2xl text-slate-400">%</span>
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SHAP */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-4 flex items-center">
            <FileText size={20} className="mr-2" /> Explainability (SHAP)
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            Red increases risk, green decreases risk.
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value: any) => Number(value).toFixed(4)} />
                <Bar dataKey="value">
                  {shapData.map((entry, index) => (
                    <Cell key={index} fill={entry.value > 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2" /> Recommendations
          </h3>

          <ul className="space-y-4">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                  {idx + 1}
                </span>
                <p className="text-slate-700 leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CHAT */}
      <ChatAssistant contextData={result} />
    </div>
  );
};
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PredictionResponse, PatientData } from '../services/api';
import { AlertCircle, CheckCircle, ArrowLeft, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChatAssistant } from '../components/ChatAssistant'; // <-- IMPORTED CHAT ASSISTANT
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
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  const { result, inputData } = state;
  const probabilityPercent = (result.probability * 100).toFixed(1);

  const isHighRisk = result.risk_level === 'High';
  const isMediumRisk = result.risk_level === 'Medium';
  const colorClass = isHighRisk ? 'text-red-600' : isMediumRisk ? 'text-yellow-600' : 'text-green-600';
  const bgClass = isHighRisk ? 'bg-red-50 border-red-200' : isMediumRisk ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
  const Icon = isHighRisk || isMediumRisk ? AlertCircle : CheckCircle;

  // Format SHAP data for Recharts (Filtering out exact 0s just in case)
  const shapData = Object.entries(result.shap_values)
    .map(([name, value]) => ({
      name,
      value,
      impact: value > 0 ? 'Increases Risk' : 'Decreases Risk'
    }));

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadReport(inputData, result);
    } catch (error) {
      console.error("PDF Download failed:", error);
      alert("Failed to generate PDF. Please check the backend terminal for error logs.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 relative">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className={`flex items-center text-white px-4 py-2 rounded-lg transition-colors ${downloading ? 'bg-gray-400' : 'bg-primary hover:bg-slate-800'}`}
        >
          <Download size={16} className="mr-2" /> {downloading ? 'Generating...' : 'Download PDF Report'}
        </button>
      </div>

      {/* Top Banner */}
      <div className={`p-8 rounded-xl border ${bgClass} flex flex-col md:flex-row items-center justify-between text-center md:text-left shadow-sm gap-6`}>
        <div className="flex items-center gap-6">
          <Icon size={64} className={`${colorClass}`} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Risk Level: <span className={colorClass}>{result.risk_level}</span></h1>
            <p className="text-gray-600 font-medium">Model Probability Score: {probabilityPercent}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileText size={20} className="mr-2 text-secondary" /> Model Explainability (SHAP)
          </h3>
          <p className="text-sm text-gray-500 mb-6">Shows how each factor contributed to this specific prediction. Red bars increase risk, green bars decrease risk.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => Number(value).toFixed(4)} />
                <Bar dataKey="value">
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2 text-secondary" /> Clinical Recommendations
          </h3>
          <ul className="space-y-4">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">{idx + 1}</span>
                <p className="text-gray-700">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* INJECT THE CHAT ASSISTANT HERE */}
      <ChatAssistant contextData={result} />
    </div>
  );
};
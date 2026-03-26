import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';
import type { ModelMetrics } from '../services/api';
import { Network, Cpu, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ModelComparison: React.FC = () => {
  const [data, setData] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getModelMetrics();
        setData(metrics);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading model telemetry...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-full text-secondary">
          <Network size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Model Evaluation & Telemetry</h2>
          <p className="text-sm text-gray-500">Performance comparison of trained algorithms on the PIMA test set.</p>
        </div>
      </div>

      {/* Model Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <Database className="text-gray-400 mb-3" size={24} />
          <h3 className="font-bold text-gray-800">Logistic Regression</h3>
          <p className="text-sm text-gray-500 mt-2">Baseline linear model. Highly interpretable but struggles with non-linear feature relationships.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <Network className="text-blue-400 mb-3" size={24} />
          <h3 className="font-bold text-gray-800">Random Forest</h3>
          <p className="text-sm text-gray-500 mt-2">Ensemble method using bagging. Excellent at handling feature interactions and preventing overfitting.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PRODUCTION MODEL</div>
          <Cpu className="text-secondary mb-3" size={24} />
          <h3 className="font-bold text-gray-800">XGBoost (Selected)</h3>
          <p className="text-sm text-gray-500 mt-2">Gradient boosting framework. Maximizes ROC-AUC and F1-score through sequential tree optimization.</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Cross-Validation Metrics (%)</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fill: '#475569', fontWeight: 500}} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{fill: '#475569'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Accuracy" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="F1_Score" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="ROC_AUC" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
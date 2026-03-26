import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import type { AnalyticsData } from '../services/api';
import { Users, TrendingUp, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Compiling analytics...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg max-w-4xl mx-auto mt-10">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-full text-secondary">
          <PieChartIcon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Population Health Analytics</h2>
          <p className="text-sm text-gray-500">Aggregate insights from your patient assessment history.</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg mr-4"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total Assessments</p>
            <p className="text-3xl font-extrabold text-gray-800">{data.total_assessments}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-lg mr-4"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Avg Probability</p>
            <p className="text-3xl font-extrabold text-gray-800">{data.average_risk_probability}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mr-4"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">High Risk Patients</p>
            <p className="text-3xl font-extrabold text-red-600">{data.high_risk_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Patient Risk Stratification</h3>
        {data.total_assessments === 0 ? (
          <p className="text-center text-gray-500 py-10">No data available to chart. Please assess patients first.</p>
        ) : (
          <div className="h-80 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Patients']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictRisk } from '../services/api';
import type { PatientData } from '../services/api';
import { Stethoscope } from 'lucide-react';

export const PredictionForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<PatientData>({
    Pregnancies: 0,
    Glucose: 120,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 79,
    BMI: 25.0,
    DiabetesPedigreeFunction: 0.5,
    Age: 33,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await predictRisk(formData);
      // Pass the result and the input data to the results page via router state
      navigate('/results', { state: { result, inputData: formData } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred connecting to the prediction API.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = Object.keys(formData) as Array<keyof PatientData>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <Stethoscope size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">New Patient Assessment</h2>
          <p className="text-sm text-gray-500">Enter clinical metrics to generate a risk intelligence report.</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 text-white font-semibold rounded-lg shadow-md transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-slate-800'
            }`}
          >
            {loading ? 'Analyzing Data...' : 'Generate Risk Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};
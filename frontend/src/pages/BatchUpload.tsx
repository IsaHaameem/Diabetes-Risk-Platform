import React, { useState } from 'react';
import { batchPredict } from '../services/api';
import { UploadCloud, FileType, CheckCircle } from 'lucide-react';

export const BatchUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Added success state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess(false); // Reset success on new file
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setLoading(true);
    setSuccess(false);
    try {
      await batchPredict(file);
      setFile(null); 
      setSuccess(true); // Trigger success message
    } catch (err: any) {
      setError("Error processing batch file. Ensure it is a valid CSV with correct headers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mt-10">
      <UploadCloud size={64} className="mx-auto text-secondary mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Batch Processing (CSV)</h2>
      <p className="text-gray-500 mb-8">Upload a CSV file containing patient data to run multiple predictions simultaneously.</p>
      
      {/* Error Message */}
      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-6 flex items-center justify-center text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
          <CheckCircle className="mr-2" size={20} />
          Batch processed successfully! Check your downloads folder for the results.
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-full mb-6">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileType size={32} className="text-gray-400 mb-2" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">CSV format only</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
      </div>

      {file && <p className="text-sm font-medium text-gray-700 mb-4">Selected File: <span className="text-secondary">{file.name}</span></p>}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-slate-800'}`}
      >
        {loading ? 'Processing & Downloading...' : 'Run Batch Analysis'}
      </button>
    </div>
  );
};
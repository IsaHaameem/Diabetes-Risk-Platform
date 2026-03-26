import axios from 'axios';

// =====================
// 🔗 AXIOS INSTANCE
// =====================
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================
// 🔐 TOKEN INTERCEPTOR
// =====================
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// 🧠 TYPES
// =====================
export interface PatientData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_level: 'Low' | 'Medium' | 'High';
  shap_values: Record<string, number>;
  recommendations: string[];
}

// =====================
// 🔮 PREDICT API
// =====================
export const predictRisk = async (
  data: PatientData
): Promise<PredictionResponse> => {
  const response = await apiClient.post('/predict', data);
  return response.data;
};

// =====================
// 🔐 AUTH APIs
// =====================
export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post('/auth/login', data);

  // 🔥 store token automatically
  localStorage.setItem('token', res.data.access_token);

  return res.data;
};

export const signup = async (data: {
  email: string;
  password: string;
}) => {
  const res = await apiClient.post('/auth/signup', data);
  return res.data;
};

// =====================
// 🤖 AI CHAT
// =====================
export const chatWithAI = async (
  message: string,
  context: any
) => {
  const res = await apiClient.post('/chat/', {
    message,
    context,
  });

  return res.data;
};

// =====================
// 📄 PDF DOWNLOAD
// =====================
export const downloadReport = async (patientData: any, result: any) => {
  const res = await apiClient.post('/generate-report', {
    patient_data: patientData,
    result: result,
  }, {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.pdf");
  document.body.appendChild(link);
  link.click();
};
export const batchPredict = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/batch-predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob", // important for file download
  });

  return response.data;
};
export const getPredictionHistory = async () => {
  const response = await apiClient.get('/history/');
  return response.data;
};
export interface AnalyticsData {
  total_assessments: number;
  average_risk_probability: number;
  high_risk_percentage: number;
  risk_distribution: { name: string; value: number; color: string }[];
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await apiClient.get('/analytics/');
  return response.data;
};
export interface ModelMetrics {
  name: string;
  Accuracy: number;
  F1_Score: number;
  ROC_AUC: number;
}

export const getModelMetrics = async (): Promise<ModelMetrics[]> => {
  const response = await apiClient.get('/models/metrics');
  return response.data;
};
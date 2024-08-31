import axios from 'axios';
import { Job } from '../types/job';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const fetchCustomers = async () => {
  const response = await api.get('/api/customers');
  return response.data;
};

export const fetchCustomerById = async (id: string) => {
  const response = await api.get(`/api/customers/${id}`);
  return response.data;
};

export const updateCustomer = async (id: string, customerData: any) => {
  const { firstName, lastName, email, phone, notes } = customerData;
  const response = await api.put(`/api/customers/${id}`, { firstName, lastName, email, phone, notes });
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await api.delete(`/api/customers/${id}`);
  return response.data;
};

export const fetchJobs = async () => {
  const response = await api.get('/api/jobs');
  return response.data;
};


export const fetchJobById = async (id: string) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

export const updateJob = async (id: string, job: Job) => {
  const response = await api.put(`/api/jobs/${id}`, job);
  return response.data;
};

export const fetchPricingVariables = async () => {
  const response = await api.get('/api/settings/pricing');
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await api.delete(`/api/jobs/${id}`);
  return response.data;
};

export const fetchJobsByCustomer = async (customerId: string) => {
  const response = await api.get(`/api/jobs?customerId=${customerId}`);
  return response.data;
};

export const addComponentToJob = async (jobId: string, componentData: any) => {
  const response = await api.post(`/api/jobs/${jobId}/components`, componentData);
  return response.data;
};

export const removeComponentFromJob = async (jobId: string, componentId: string) => {
  const response = await api.delete(`/api/jobs/${jobId}/components/${componentId}`);
  return response.data;
};

export const updatePricingVariables = async (pricingVariables: any) => {
  const response = await api.put('/api/settings/pricing', pricingVariables);
  return response.data;
};

export const createCustomer = async (customerData: any) => {
  const response = await api.post('/api/customers', customerData);
  return response.data;
};

export const createJob = async (jobData: any) => {
  const response = await api.post('/api/jobs', jobData);
  return response.data;
};

export default api;
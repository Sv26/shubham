import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const initializeDatabase = () => API.get('/initialize-database');
export const fetchTransactions = (params) => API.get('/transactions', { params });
export const fetchStatistics = (params) => API.get('/statistics', { params });
export const fetchBarChart = (params) => API.get('/bar-chart', { params });
export const fetchPieChart = (params) => API.get('/pie-chart', { params });
export const fetchCombinedData = (params) => API.get('/combined-data', { params });

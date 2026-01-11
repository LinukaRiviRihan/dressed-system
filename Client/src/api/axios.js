import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

export const designService = {
  getAll: () => api.get('/designs'),
  getCategories: () => api.get('/designs/categories'),
  create: (formData) =>
    api.post('/designs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const quoteService = {
  getByDesignId: (designId) => api.get(`/quotes/design/${designId}`),
  submit: (quoteData) => api.post('/quotes', quoteData),
};

export default api;

import api from './api';

export const getCategories = () => api.get('/complaints/categories').then((r) => r.data.categories);

export const getPublicStats = () => api.get('/complaints/stats/public').then((r) => r.data);

export const submitComplaint = (formData) =>
  api
    .post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export const supportComplaint = (complaintId) =>
  api.post(`/complaints/${complaintId}/support`).then((r) => r.data);

export const getComplaint = (complaintId) =>
  api.get(`/complaints/${complaintId}`).then((r) => r.data);

export const submitFeedback = (complaintId, feedback) =>
  api.post(`/complaints/${complaintId}/feedback`, { feedback }).then((r) => r.data);

export const getMyComplaints = () => api.get('/user/complaints').then((r) => r.data.complaints);

// Admin
export const adminListComplaints = (params) =>
  api.get('/admin/complaints', { params }).then((r) => r.data.complaints);

export const adminGetComplaint = (complaintId) =>
  api.get(`/admin/complaints/${complaintId}`).then((r) => r.data);

export const adminUpdateStatus = (complaintId, payload) =>
  api.put(`/admin/complaints/${complaintId}/status`, payload).then((r) => r.data);

export const adminDashboard = () => api.get('/admin/dashboard').then((r) => r.data);
export const adminAnalytics = () => api.get('/admin/analytics').then((r) => r.data);
export const adminUsers = () => api.get('/admin/users').then((r) => r.data.users);

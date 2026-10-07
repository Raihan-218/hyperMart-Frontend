import api from './api';

export const registerUser = (data) =>
  api.post('/users/register', data);

export const loginUser = (data) =>
  api.post('/users/login', data);

export const logoutUser = () =>
  api.post('/users/logout');

export const getCurrentUser = () =>
  api.get('/users/me');

export const updateUserProfile = (data) =>
  api.put('/users/profile', data);

export const verifyUserEmail = (token) =>
  api.get(`/users/verify-email?token=${encodeURIComponent(token)}`);

export const resendVerificationEmail = (email) =>
  api.post('/users/resend-verification', { email });

import api from './api';

const register = (name, email, password) => {
  return api.post('/auth/register', {
    name,
    email,
    password,
    auth_provider: 'email',
  });
};

const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

const getMe = () => {
  return api.get('/auth/me');
};

const logout = () => {
  // No API call needed for stateless JWT logout on backend, just remove token
  return Promise.resolve();
};

const authService = {
  register,
  login,
  getMe,
  logout,
};

export default authService;
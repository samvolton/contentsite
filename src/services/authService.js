import axios from '../api/axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const register = async (userData) => {
  try {
    console.log('Registering user:', { ...userData, password: '[REDACTED]' });
    const response = await axios.post('/auth/register', userData);
    console.log('Register response:', response.data);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Kayıt başarısız oldu. Lütfen tekrar deneyin.' };
  }
};

const login = async (credentials) => {
  try {
    console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
    const response = await axios.post('/auth/login', credentials);
    console.log('Login response:', response.data);

    if (response.data.token) {
      console.log('Token received, setting auth token');
      setAuthToken(response.data.token);
      return { success: true, user: response.data.user };
    } else {
      console.warn('No token received in login response');
      return { success: false, error: 'No token received' };
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      return { success: false, error: error.response.data.error || 'Login failed' };
    } else if (error.request) {
      console.error('No response received:', error.request);
      return { success: false, error: 'No response from server' };
    } else {
      console.error('Error setting up request:', error.message);
      return { success: false, error: 'Error setting up request' };
    }
  }
};

const logout = async () => {
  try {
    console.log('Logging out user');
    await axios.post('/auth/logout');
    setAuthToken(null);
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
  }
};

const getProfile = async () => {
  try {
    console.log('Fetching user profile');
    const response = await axios.get('/auth/profile');
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error;
  }
};

const updateProfile = async (userData) => {
  try {
    console.log('Updating user profile:', { ...userData, password: '[REDACTED]' });
    const response = await axios.patch('/auth/profile', userData);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
    throw error;
  }
};

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      setAuthToken(token);
      const response = await axios.get('/auth/profile');
      
      if (response.data) {
        return { isAuthenticated: true, user: response.data };
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setAuthToken(null);
      return { isAuthenticated: false, user: null };
    }
  }
  return { isAuthenticated: false, user: null };
};

export { 
  setAuthToken, 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile,
  checkAuth
};
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
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error, please try again');
    }
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
    } else {
      console.warn('No token received in login response');
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw error.response.data;
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error('Error setting up request');
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

export { 
  setAuthToken, 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile
};

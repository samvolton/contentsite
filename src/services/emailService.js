import axios from '../api/axios';

export const sendVerificationEmail = async (email, amount) => {
  try {
    const response = await axios.post('/auth/send-verification-email', { email, amount });
    return response.data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

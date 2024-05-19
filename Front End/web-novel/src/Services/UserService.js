import axios from './axios';
import { toast } from 'react-toastify';

const loginApi = (email, password) => {
  return axios.post('/login', { email, password });
};

const verifyOTPApi = async (data) => {
  const response = await axios.post('/verifyOTP', data);
  return response;
};

const forgotPasswordApi = async (data) => {
  const response = await axios.post('/forgot-password', data);
  return response;
};

const verifyResetPasswordTokenApi = async (data) => {
  const response = await axios.post('/verify-reset-password-token', data);
  return response;
};

const resetPasswordApi = async (data) => {
  const response = await axios.post('/reset-password', data);
  return response;
};

const registerApi = async (username, email, password, confirmPassword) => {
  const response = await axios.post('/register', { username, email, password, confirmPassword });
  return response.data;
};

const fetchAllUsers = async () => {
  try {
    const response = await axios.get('/admin/user_management');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`/admin/user_management/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user detail:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const response = await axios.post('/admin/user_management/create-user', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(`Tạo người dùng mới thành công: ${response.data.username}`);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error(`Tạo người dùng mới thất bại: ${error.message}`);
    throw error;
  }
};

const updateUser = async (userData) => {
  try {
    const response = await axios.post('/admin/user_management/update-user-info', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(`Cập nhật người dùng thành công: ${response.data.username}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error(`Cập nhật người dùng thất bại: ${error.message}`);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.delete(`/admin/user_management/${userId}`);
    toast.success(`Xóa người dùng thành công`);
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error(`Xóa người dùng thất bại: ${error.message}`);
    throw error;
  }
};


const getUserProfileById = async (userId) => {
  try {
    const response = await axios.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const updateUserProfile = async (formData) => {
  try {
    const response = await axios.post('/update-user-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export {
  loginApi,
  forgotPasswordApi,
  verifyResetPasswordTokenApi,
  resetPasswordApi,
  verifyOTPApi,
  registerApi,
  fetchAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfileById,
  updateUserProfile,
};
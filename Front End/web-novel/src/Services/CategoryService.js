import axios from './axios.js';

const fetchAllCategories = async () => {
  try {
    const response = await axios.get('/admin/category_management');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`/admin/category_management/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category detail:', error);
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await axios.post('/admin/category_management/create-category', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

const updateCategory = async (categoryData) => {
  try {
    const response = await axios.post('/admin/category_management/update-category', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.post('/admin/category_management/delete-category', { id: categoryId });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export {
  fetchAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
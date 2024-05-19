import axios from './axios.js';

const fetchAllComments = async () => {
  try {
    const response = await axios.get('/admin/comment_management');
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const getCommentById = async (commentId) => {
  try {
    const response = await axios.get(`/admin/comment_management/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comment detail:', error);
    throw error;
  }
};

const createComment = async (commentData) => {
  try {
    const response = await axios.post('/admin/comment_management/create-comment', commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

const updateComment = async (commentData) => {
  try {
    const response = await axios.post('/admin/comment_management/update-comment', commentData);
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

const deleteComment = async (commentData) => {
  try {
    const response = await axios.post('/admin/comment_management/delete-comment', commentData);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export {
  fetchAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
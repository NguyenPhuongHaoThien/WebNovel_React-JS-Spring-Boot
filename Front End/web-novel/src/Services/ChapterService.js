import axios from './axios.js';

const fetchAllChapters = async () => {
  try {
    const response = await axios.get('/admin/chapter_management');
    return response.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

const getChapterById = async (chapterId) => {
  try {
    const response = await axios.get(`/admin/chapter_management/${chapterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter detail:', error);
    throw error;
  }
};

const createChapter = async (chapterData) => {
  try {
    const response = await axios.post('/admin/chapter_management/create-chapter', chapterData);
    return response.data;
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
};

const updateChapter = async (chapterData) => {
  try {
    const response = await axios.post('/admin/chapter_management/update-chapter', chapterData);
    return response.data;
  } catch (error) {
    console.error('Error updating chapter:', error);
    throw error;
  }
};

const deleteChapter = async (chapterData) => {
  try {
    const response = await axios.post('/admin/chapter_management/delete-chapter',  chapterData );
    return response.data;
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
};

export {
  fetchAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
};
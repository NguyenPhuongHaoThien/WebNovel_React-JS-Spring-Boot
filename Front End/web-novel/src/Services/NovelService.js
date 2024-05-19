import axios from './axios.js';
import { toast } from 'react-toastify';
import { fromByteArray } from 'base64-js';

const convertToBase64 = (imageData) => {
  const base64String = fromByteArray(new Uint8Array(imageData));
  return `data:image/jpeg;base64,${base64String}`;
};

const fetchAllNovels = async () => {
  try {
    const response = await axios.get('/admin/novel_management');
    return response.data;
  } catch (error) {
    console.error('Error fetching novels:', error);
    throw error;
  }
};

const getNovelById = async (novelId) => {
  try {
    const response = await axios.get(`/admin/novel_management/${novelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching novel detail:', error);
    throw error;
  }
};

const createNovel = async (formData) => {
  try {
    const response = await axios.post('/admin/novel_management/create-novel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Novel created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating novel:', error);
    toast.error(`Error creating novel: ${error.message}`);
    throw error;
  }
};

const updateNovel = async (formData) => {
  try {
    const response = await axios.post('/admin/novel_management/update-novel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Novel updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating novel:', error);
    toast.error(`Error updating novel: ${error.message}`);
    throw error;
  }
};

const deleteNovel = async (novelId) => {
  try {
    await axios.post('/admin/novel_management/delete-novel', { id: novelId });
    toast.success('Novel deleted successfully');
  } catch (error) {
    console.error('Error deleting novel:', error);
    toast.error('Error deleting novel');
    throw error;
  }
};

const addChapterToNovel = async (novelId, chapterData) => {
  try {
    const response = await axios.post(`/admin/novel_management/${novelId}/add-chapter`, chapterData);
    toast.success('Chapter added successfully');
    return response.data;
  } catch (error) {
    console.error('Error adding chapter to novel:', error);
    toast.error('Error adding chapter to novel');
    throw error;
  }
};

const fetchNovelsByAuthorId = async (authorId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`/novels/author/${authorId}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching novels by author:', error);
    throw error;
  }
};

const fetchNovelsByCategoryId = async (categoryId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`/novels/category/${categoryId}`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching novels by category:', error);
    throw error;
  }
};

const fetchReadingHistory = async (userId) => {
  try {
    const response = await axios.get(`/reading-history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reading history:', error);
    throw error;
  }
};

const saveReadingHistory = async (userId, novelId, currentChapter) => {
  try {
    await axios.post('/reading-history', { userId, novelId, currentChapter });
  } catch (error) {
    console.error('Error saving reading history:', error);
    throw error;
  }
};

const fetchEditorPicks = async () => {
  try {
    const response = await axios.get('/home/editor-picks');
    return response.data;
  } catch (error) {
    console.error('Error fetching editor picks:', error);
    throw error;
  }
};

const fetchCurrentlyReading = async (userId) => {
  try {
    const response = await axios.get(`/home/currently-reading?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching currently reading:', error);
    throw error;
  }
};

const fetchNewUpdates = async () => {
  try {
    const response = await axios.get('/home/new-updates');
    return response.data;
  } catch (error) {
    console.error('Error fetching new updates:', error);
    throw error;
  }
};

const fetchMostRead = async () => {
  try {
    const response = await axios.get('/home/most-read');
    return response.data;
  } catch (error) {
    console.error('Error fetching most read:', error);
    throw error;
  }
};

const fetchMostPopular = async () => {
  try {
    const response = await axios.get('/home/most-popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching most popular:', error);
    throw error;
  }
};

const fetchMostRecommended = async () => {
  try {
    const response = await axios.get('/home/most-recommended');
    return response.data;
  } catch (error) {
    console.error('Error fetching most recommended:', error);
    throw error;
  }
};

const fetchHighlyRated = async () => {
  try {
    const response = await axios.get('/home/highly-rated');
    return response.data;
  } catch (error) {
    console.error('Error fetching highly rated:', error);
    throw error;
  }
};

const fetchNewlyReviewed = async () => {
  try {
    const response = await axios.get('/home/newly-reviewed');
    return response.data;
  } catch (error) {
    console.error('Error fetching newly reviewed:', error);
    throw error;
  }
};

const fetchNewlyPosted = async () => {
  try {
    const response = await axios.get('/home/newly-posted');
    return response.data;
  } catch (error) {
    console.error('Error fetching newly posted:', error);
    throw error;
  }
};

const fetchNewlyCompleted = async () => {
  try {
    const response = await axios.get('/home/newly-completed');
    return response.data;
  } catch (error) {
    console.error('Error fetching newly completed:', error);
    throw error;
  }
};

const getNovelDetail = async (novelId) => {
  try {
    const response = await axios.get(`/home/novel_detail/${novelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching novel detail:', error);
    throw error;
  }
};

const incrementViewCount = async (novelId) => {
  try {
    await axios.post(`/home/novel_detail/${novelId}/increment-view`);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

const incrementCommentCount = async (novelId) => {
  try {
    await axios.post(`/home/novel_detail/${novelId}/increment-comment-count`);
  } catch (error) {
    console.error('Error incrementing comment count:', error);
    throw error;
  }
};

const incrementFavoriteCount = async (novelId) => {
  try {
    await axios.post(`/home/novel_detail/${novelId}/increment-favorite-count`);
  } catch (error) {
    console.error('Error incrementing favorite count:', error);
    throw error;
  }
};

const incrementRecommendationCount = async (novelId) => {
  try {
    await axios.post(`/home/novel_detail/${novelId}/increment-recommendation-count`);
  } catch (error) {
    console.error('Error incrementing recommendation count:', error);
    throw error;
  }
};

const updateRating = async (novelId, score) => {
  try {
    await axios.post(`/home/novel_detail/${novelId}/update-rating`, { score });
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};


const getChaptersByNovelId = async (novelId) => {
  try {
    const response = await axios.get(`/read-novel/${novelId}/chapters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

const getChapterByNovelIdAndChapterId = async (novelId, chapterId) => {
  try {
    const response = await axios.get(`/read-novel/${novelId}/chapters/${chapterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const searchNovels = async (categoryIds, viewFilter, ratingFilter, chapterFilter, page, size, keyword) => {
  try {
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    categoryIds.forEach(categoryId => params.append('categoryIds', categoryId));
    params.append('viewFilter', viewFilter);
    params.append('ratingFilter', ratingFilter);
    params.append('chapterFilter', chapterFilter);
    params.append('page', page);
    params.append('size', size);

    const response = await axios.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching novels:', error);
    throw error;
  }
};


const searchNovelsWithSuggestions = async (keyword) => {
  try {
    const response = await axios.get('/search/suggestions', {
      params: {
        keyword,
      },
    });
    return response.data.map(suggestion => ({
      id: suggestion.id,
      nameNovel: suggestion.nameNovel,
      author: suggestion.author,
      category: suggestion.category,
      averageRating: suggestion.averageRating,
    }));
  } catch (error) {
    console.error('Error searching novels with suggestions:', error);
    throw error;
  }
};

const navigateToNovelDetail = (navigate, novelId) => {
  navigate(`/home/novel_detail/${novelId}`);
};

const createComment = async (comment) => {
  try {
    const response = await axios.post(`/home/novel_detail/${comment.novelId}/comments`, comment);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};


// NovelService.js
// ...

const getNovelsByPage = async (page, pageNumber, pageSize, categoryIds, viewFilter, ratingFilter, chapterFilter) => {
  try {
    const params = new URLSearchParams();
    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach(categoryId => params.append('categoryIds', categoryId));
    }
    params.append('viewFilter', viewFilter || '');
    params.append('ratingFilter', ratingFilter || '');
    params.append('chapterFilter', chapterFilter || '');
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    const url = `/novels/page/${page}`;
    console.log('API URL:', url);
    console.log('Request Params:', Object.fromEntries(params));

    const response = await axios.get(url, { params });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching novels by page:', error);
    throw error;
  }
};

const getNovelsByRanking = async (rankingType, pageNumber, pageSize, categoryIds, viewFilter, ratingFilter, chapterFilter) => {
  try {
    const url = `/novels/page/rankings/${rankingType}`;
    console.log('API URL:', url);
    console.log('Request Params:', {
      pageNumber,
      pageSize,
      categoryIds,
      viewFilter,
      ratingFilter,
      chapterFilter,
    });

    const response = await axios.get(url, {
      params: {
        pageNumber,
        pageSize,
        categoryIds,
        viewFilter,
        ratingFilter,
        chapterFilter,
      },
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching novels by ranking:', error);
    throw error;
  }
};

// ...

export {
  fetchAllNovels,
  getNovelById,
  createNovel,
  updateNovel,
  deleteNovel,
  fetchNovelsByAuthorId,
  fetchNovelsByCategoryId,
  fetchReadingHistory,
  saveReadingHistory,
  addChapterToNovel,
  fetchEditorPicks,
  fetchCurrentlyReading,
  fetchNewUpdates,
  fetchMostRead,
  fetchMostPopular,
  fetchMostRecommended,
  fetchHighlyRated,
  fetchNewlyReviewed,
  fetchNewlyPosted,
  fetchNewlyCompleted,
  convertToBase64,
  getNovelDetail,
  incrementViewCount,
  incrementCommentCount,
  incrementFavoriteCount,
  incrementRecommendationCount,
  updateRating,
  getChaptersByNovelId,
  getChapterByNovelIdAndChapterId,
  fetchCategories,
  searchNovels,
  getNovelsByPage,
  searchNovelsWithSuggestions,
  navigateToNovelDetail,
  createComment,
  getNovelsByRanking,
};
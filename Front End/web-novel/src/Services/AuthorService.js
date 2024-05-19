// AuthorService.js (cập nhật)
import axios from './axios.js';
import { toast } from 'react-toastify';

const fetchAuthors = async () => {
 try {
   const response = await axios.get('/admin/author_management');
   return response.data;
 } catch (error) {
   console.error('Error fetching authors:', error);
   throw error;
 }
};

const getAuthorById = async (id) => {
 try {
   const response = await axios.get(`/admin/author_management/${id}`);
   return response.data;
 } catch (error) {
   console.error('Error fetching author by id:', error);
   throw error;
 }
};

const createAuthor = async (authorData) => {
 try {
   const response = await axios.post('/admin/author_management/create-author', authorData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   toast.success(`Author created successfully: ${response.data.name}`)
   return response.data;
 } catch (error) {
   console.error('Error creating author:', error);
   toast.error(`Error creating author: ${error.message}`)
   throw error;
 }
};

const updateAuthor = async (authorData) => {
 try {
   const response = await axios.post('/admin/author_management/update-author-info', authorData, {
     headers: {
       'Content-Type': 'multipart/form-data',
     },
   });
   toast.success(`Author updated successfully: ${response.data.name}`)
   return response.data;
 } catch (error) {
   console.error('Error updating author:', error);
    toast.error(`Error updating author: ${error.message}`)
   throw error;
 }
};

const deleteAuthor = async (authorId) => {
 try {
   await axios.delete(`/admin/author_management/${authorId}`);
    toast.success('Author deleted successfully');
} catch (error) {
   console.error('Error deleting author:', error);
    toast.error('Error deleting author');
   throw error;
 }
};

export {
 fetchAuthors,
 getAuthorById,
 createAuthor,
 updateAuthor,
 deleteAuthor,
};
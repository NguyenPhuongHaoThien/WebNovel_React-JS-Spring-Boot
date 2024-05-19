// AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from '../Components/Auth/LoginForm';
import HomePage from '../Components/HomePage/HomePage';
import RegisterForm from '../Components/Auth/RegisterForm';
import ForgotPassword from '../Components/Auth/ForgotPassword';
import ResetPassword from '../Components/Auth/ResetPassword';
import Dashboard from  '../Components/Admin/Part/Dashboard';
import NovelTable from  '../Components/Admin/Novel/NovelTable';
import CategoryTable from  '../Components/Admin/Category/CategoryTable';
import ChapterTable from  '../Components/Admin/Chapter/ChapterTable';
import CommentTable from  '../Components/Admin/Comment/CommentTable';
import UserTable from  '../Components/Admin/User/UserTable';
import AuthorTable from  '../Components/Admin/Author/AuthorTable';
import NovelDetail from  '../Components/NovelDetail/NovelDetail';
import ReadNovel from '../Components/ReadNovel/ReadNovel';
import SearchResults from '../Components/Search/SearchResults';
import NovelList from '../Components/PageNovel/NovelList';
import UserProfile from '../Components/UserProfile/UserProfile'; 
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    return (
        <>
        <Routes>
           
            <Route path="/" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={HomePage} />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            <Route path="/home" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={HomePage} />} />
            <Route path="/verifyOTP" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verifyResetPasswordTokenApi" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/novel_crud" element={<PrivateRoute roles={['ROLE_ADMIN']} component={NovelTable} />} />
            <Route path="/admin/dashboard" element={<PrivateRoute roles={['ROLE_ADMIN']} component={Dashboard} />} />
            <Route path="/admin/novel_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={NovelTable} />} />  
            <Route path="/admin/category_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={CategoryTable} />} />  
            <Route path="/admin/chapter_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={ChapterTable} />} />  
            <Route path="/admin/comment_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={CommentTable} />} />  
            <Route path="/admin/user_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={UserTable} />} /> 
            <Route path="/admin/author_management" element={<PrivateRoute roles={['ROLE_ADMIN']} component={AuthorTable} />} />
            <Route path="/home/novel_detail/:id" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={NovelDetail} />} />
            <Route path="/read-novel/:novelId/chapters/:chapterId" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={ReadNovel} />} />
            <Route path="/search/" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={SearchResults} />} />
            <Route path="/novels/page/:page" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={NovelList} />} />
            <Route path="/novels/page/rankings/:rankingType" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={NovelList} />} />
            <Route path="/user-profile" element={<PrivateRoute roles={['ROLE_USER', 'ROLE_ADMIN']} component={UserProfile} />} />
        </Routes>
        </>
    );
}
export default AppRoutes;
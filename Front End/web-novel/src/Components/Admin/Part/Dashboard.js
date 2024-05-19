import React, { useState, useContext } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminHome from './AdminHome';
import NovelTable  from '../Novel/NovelTable';
import CategoryTable from '../Category/CategoryTable';
import UserTable from '../User/UserTable';
import CommentTable from '../Comment/CommentTable';
import ChapterTable from '../Chapter/ChapterTable';
import { UserContext } from '../../../Contexts/UserContext';
import './admin_part.css';


const AdminDashboard = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const { user } = useContext(UserContext);

  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  return (
    <div className="admin-grid-container">
      <AdminHeader OpenAdminSidebar={OpenAdminSidebar} />
      <AdminSidebar openAdminSidebarToggle={openAdminSidebarToggle} OpenAdminSidebar={OpenAdminSidebar} />
      <AdminHome>
        <NovelTable />
        <CategoryTable />
        <UserTable />
        <CommentTable />
        <ChapterTable />
      </AdminHome>
    </div>
  );
};

export default AdminDashboard;
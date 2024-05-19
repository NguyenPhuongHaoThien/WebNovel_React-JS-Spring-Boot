import React, { useState, useContext } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../../Contexts/UserContext';

const AdminLayout = ({ children }) => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const location = useLocation();
  const { user } = useContext(UserContext);

  const toggleAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  return (
    <div className="admin-grid-container">
      <AdminHeader toggleAdminSidebar={toggleAdminSidebar} />
      <AdminSidebar
        openAdminSidebarToggle={openAdminSidebarToggle}
        toggleAdminSidebar={toggleAdminSidebar}
        activePath={location.pathname}
      />
      <main className="admin-main-container">{children}</main>
    </div>
  );
};

export default AdminLayout;
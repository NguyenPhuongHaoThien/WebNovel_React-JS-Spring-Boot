import React, { useContext } from 'react';
import { BsHouseDoor, BsBookHalf, BsGrid3X3Gap, BsPeople, BsChat, BsClipboardData, BsBarChartLine, BsBoxArrowRight } from 'react-icons/bs';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminSidebar({ openAdminSidebarToggle, toggleAdminSidebar, activePath }) {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    // Xử lý sự kiện khi click vào item
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload();
    toast.success('Đăng xuất thành công');
  };

  return (
    <aside id="admin-sidebar" className={openAdminSidebarToggle ? "admin-sidebar-responsive" : ""}>
      <div className='admin-sidebar-title'>
        <div className='admin-sidebar-brand'>
          <BsBookHalf className='admin-icon-header' /> NOVEL WORLD
        </div>
        <span className='admin-icon admin-close-icon' onClick={toggleAdminSidebar}>X</span>
      </div>

      <ul className='admin-sidebar-list'>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/dashboard' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/dashboard')}
        >
          <a href="/admin/dashboard">
            <BsHouseDoor className='admin-icon' /> Dashboard
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/novel_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/novel_management')}
        >
          <a href="/admin/novel_management">
            <BsBookHalf className='admin-icon' /> Novels
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/category_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/category_management')}
        >
          <a href="/admin/category_management">
            <BsGrid3X3Gap className='admin-icon' /> Categories
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/user_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/user_management')}
        >
          <a href="/admin/user_management">
            <BsPeople className='admin-icon' /> Customers
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/author_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/author_management')}
        >
          <a href="/admin/author_management">
            <BsPeople className='admin-icon' /> Authors
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/comment_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/comment_management')}
        >
          <a href="/admin/comment_management">
            <BsChat className='admin-icon' /> Comments
          </a>
        </li>
        <li
          className={`admin-sidebar-list-item ${activePath === '/admin/chapter_management' ? 'active' : ''}`}
          onClick={() => handleItemClick('/admin/chapter_management')}
        >
          <a href="/admin/chapter_management">
            <BsClipboardData className='admin-icon' /> Chapters
          </a>
        </li>
        <li className="admin-sidebar-list-item">
          <a href="">
            <BsBarChartLine className='admin-icon' /> Reports
          </a>
        </li>
        <li className="admin-sidebar-list-item" onClick={handleLogout}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <BsBoxArrowRight className='admin-icon' /> Logout
          </a>
        </li>
      </ul>
    </aside>
  )
}

export default AdminSidebar;
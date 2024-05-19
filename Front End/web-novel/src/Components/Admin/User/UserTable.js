import React, { useState, useEffect , useContext} from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsSearch, BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { Table, Button, Modal, Dropdown, Toast } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import UserForm from './UserForm';
import '../Part/modal.css';
import AdminLayout from '../Part/AdminLayout';
import { fetchAllUsers, createUser, updateUser, deleteUser } from '../../../Services/UserService';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToastMessage('Error fetching users', 'danger');
    }
  };

  useEffect(() => {
    if (user.auth && user.role === 'ROLE_ADMIN') {
      fetchUsers();
    } else {
      // Người dùng chưa đăng nhập hoặc không có quyền truy cập, chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [user.auth, user.role, navigate]);


  const handleCreateUserSubmit = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUserSubmit = async (userId, userData) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setSelectedUser(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      showToastMessage('User deleted successfully!', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToastMessage('Error deleting user', 'danger');
    }
  };
  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUserConfirm = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <AdminLayout>
      <div className="admin-main-title">
        <h2>User Management</h2>
        <Button variant="primary" onClick={handleCreateUser}>
          Create User
        </Button>
      </div>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Sex</th>
            <th>Role</th>
            <th>Full Name</th>
            <th>Avatar</th>
            <th>Create Day</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.sex}</td>
              <td>{user.role}</td>
              <td>{user.fullName}</td>
              <td>
                {user.avatar && (
                  <img src={user.avatar} alt="Avatar" width="50" />
                )}
              </td>
              <td>{user.createDay ? new Date(user.createDay).toLocaleDateString() : ''}</td>
              <td>{user.active ? 'Active' : 'Inactive'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditUser(user)}>
                      <i className="fas fa-edit"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteUserConfirm(user)}>
                      <i className="fas fa-trash"></i> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modals */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
        dialogClassName="custom-modal"
      >
        <UserForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateUserSubmit}
          isEditing={false}
        />
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        dialogClassName="custom-modal"
      >
        <UserForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSubmit={handleUpdateUserSubmit}
          user={selectedUser}
          isEditing={true}
        />
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleDeleteUser(selectedUser.id);
            setShowDeleteModal(false);
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          minWidth: '200px',
          zIndex: 9999,
        }}
        className={`bg-${toastType} text-white`}
      >
        <Toast.Header className={`bg-${toastType} text-white`}>
          <strong className="mr-auto">
            {toastType === 'success' ? 'Success' : 'Error'}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </AdminLayout>
  );
};

export default UserTable;
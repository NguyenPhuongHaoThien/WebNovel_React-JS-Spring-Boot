// AuthorTable.js
import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import AuthorForm from './AuthorForm';
import '../Part/modal.css';
import AdminLayout from '../Part/AdminLayout';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../../Services/AuthorService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';


const AuthorTable = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchAuthorData = async () => {
    try {
      const authorsData = await fetchAuthors();
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Error fetching authors');
    }
  };

  useEffect(() => {
    if (user.auth && user.role === 'ROLE_ADMIN') {
      fetchAuthorData();
    } else {
      // Người dùng chưa đăng nhập hoặc không có quyền truy cập, chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [user.auth, user.role, navigate]);

  const handleCreateAuthorSubmit = async (authorData) => {
    try {
      const newAuthor = await createAuthor(authorData);
      setAuthors([...authors, newAuthor]);
      setShowCreateModal(false);
      toast.success('Author created successfully');
      fetchAuthorData();
    } catch (error) {
      console.error('Error creating author:', error);
      toast.error('Error creating author');
    }
  };

  const handleUpdateAuthorSubmit = async (authorData) => {
    try {
      const updatedAuthor = await updateAuthor(selectedAuthor.id, authorData);
      setAuthors(authors.map((author) => (author.id === updatedAuthor.id ? updatedAuthor : author)));
      setSelectedAuthor(null);
      setShowEditModal(false);
      toast.success('Author updated successfully');
      fetchAuthorData();
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Error updating author');
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      await deleteAuthor(authorId);
      const updatedAuthors = authors.filter((author) => author.id !== authorId);
      setAuthors(updatedAuthors);
      setShowDeleteModal(false);
      toast.success('Author deleted successfully');
      fetchAuthorData();
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Error deleting author');
    }
  };

  const handleCreateAuthor = () => {
    setSelectedAuthor(null);
    setShowCreateModal(true);
  };

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);
    setShowEditModal(true);
  };

  const handleDeleteAuthorConfirm = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="admin-main-title">
        <h2>Author Management</h2>
        <Button variant="primary" onClick={handleCreateAuthor}>
          Create Author
        </Button>
      </div>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Avatar</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Facebook</th>
            <th>Twitter</th>
            <th>Instagram</th>
            <th>Youtube</th>
            <th>Website</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author, index) => (
            <tr key={author.id}>
              <td>{index + 1}</td>
              <td>{author.id}</td>
              <td>{author.name}</td>
              <td>{author.description}</td>
              <td>
                {author.avatar && (
                  <img src={author.avatar} alt="Avatar" width="50" />
                )}
              </td>
              <td>{author.email}</td>
              <td>{author.phone}</td>
              <td>{author.address}</td>
              <td>{author.facebook}</td>
              <td>{author.twitter}</td>
              <td>{author.instagram}</td>
              <td>{author.youtube}</td>
              <td>{author.website}</td>
              <td>{author.active ? 'Active' : 'Inactive'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditAuthor(author)}>
                      <i className="fas fa-edit"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteAuthorConfirm(author)}>
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
        <AuthorForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateAuthorSubmit}
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
        <AuthorForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSubmit={handleUpdateAuthorSubmit}
          author={selectedAuthor}
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
          Are you sure you want to delete this author?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleDeleteAuthor(selectedAuthor.id);
            setShowDeleteModal(false);
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AuthorTable;
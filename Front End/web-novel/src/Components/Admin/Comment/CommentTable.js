import React, { useState, useEffect,useContext } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import CommentForm from './CommentForm';
import '../Part/modal.css';
import AdminLayout from '../Part/AdminLayout';
import { fetchAllComments, createComment, updateComment, deleteComment } from '../../../Services/CommentService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const CommentTable = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const { user } = useContext(UserContext);
  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.auth && user.role === 'ROLE_ADMIN') {
      fetchComments();
    } else {
      // Người dùng chưa đăng nhập hoặc không có quyền truy cập, chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [user.auth, user.role, navigate]);

  const fetchComments = async () => {
    try {
      const response = await fetchAllComments();
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      showToastMessage('Error fetching comments', 'error');
    }
  };

  const handleCreateCommentSubmit = async (commentData) => {
    try {
      const newComment = await createComment(commentData);
      setComments([...comments, newComment]);
      setShowCreateModal(false);
      showToastMessage('Comment created successfully!', 'success');
    } catch (error) {
      console.error('Error creating comment:', error);
      showToastMessage('Error creating comment', 'error');
    }
  };

  const handleUpdateCommentSubmit = async (commentData) => {
    try {
      const updatedComment = await updateComment(commentData);
      setComments(comments.map(comment => comment.id === updatedComment.id ? updatedComment : comment));
      setSelectedComment(null);
      setShowEditModal(false);
      showToastMessage('Comment updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating comment:', error);
      showToastMessage('Error updating comment', 'error');
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      const updatedComments = comments.filter((comment) => comment.id !== commentId);
      setComments(updatedComments);
      setShowDeleteModal(false);
      showToastMessage('Comment deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToastMessage('Error deleting comment', 'error');
    }
  };

  const handleCreateComment = () => {
    setSelectedComment(null);
    setShowCreateModal(true);
  };

  const handleEditComment = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const handleDeleteCommentConfirm = (comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const showToastMessage = (message, type) => {
    toast(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type,
    });
  };

  return (
    <AdminLayout>

      {/* Main Content */}
        <div className="admin-main-title">
          <h2>Comment Management</h2>
          <Button variant="primary" onClick={handleCreateComment}>
            Create Comment
          </Button>
        </div>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Username</th>
              <th>Novel Name</th>
              <th>Content</th>
              <th>Date</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={comment.id}>
                <td>{index + 1}</td>
                <td>{comment.id}</td>
                <td>{comment.userId}</td>
                <td>{comment.novelId}</td>
                <td>{comment.content}</td>
                <td>{comment.date}</td>
                <td>{comment.active ? 'Active' : 'Inactive'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" size="sm">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEditComment(comment)}>
                        <i className="fas fa-edit"></i> Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteComment(comment)}>
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
        <CommentForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateCommentSubmit}
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
        <CommentForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSubmit={handleUpdateCommentSubmit}
          comment={selectedComment}
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
            Are you sure you want to delete this comment?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              deleteComment(selectedComment.id);
              setShowDeleteModal(false);
            }}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        </AdminLayout>

  );
};

export default CommentTable;
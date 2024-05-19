import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import AdminLayout from '../Part/AdminLayout';
import ChapterForm from './ChapterForm';
import '../Part/modal.css';
import { fetchAllChapters, createChapter, updateChapter, deleteChapter } from '../../../Services/ChapterService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const ChapterTable = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const { user } = useContext(UserContext);
  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.auth && user.role === 'ROLE_ADMIN') {
      fetchChapters();
    } else {
      // Người dùng chưa đăng nhập hoặc không có quyền truy cập, chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [user.auth, user.role, navigate]);

  const fetchChapters = async () => {
    try {
      const response = await fetchAllChapters();
      setChapters(response);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      showToastMessage('Error fetching chapters', 'danger');
    }
  };

  const handleCreateChapterSubmit = async (chapterData) => {
    try {
      await createChapter(chapterData);
      setShowCreateModal(false);
      showToastMessage('Chapter created successfully!', 'success');
      fetchChapters();
    } catch (error) {
      console.error('Error creating chapter:', error);
      showToastMessage('Error creating chapter', 'danger');
    }
  };

  const handleUpdateChapterSubmit = async (chapterData) => {
    try {
      await updateChapter(chapterData);
      setSelectedChapter(null);
      setShowEditModal(false);
      showToastMessage('Chapter updated successfully!', 'success');
      fetchChapters();
    } catch (error) {
      console.error('Error updating chapter:', error);
      showToastMessage('Error updating chapter', 'danger');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter({ id: chapterId });
      setShowDeleteModal(false);
      showToastMessage('Chapter deleted successfully!', 'success');
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      showToastMessage('Error deleting chapter', 'error');
    }
  };

  const handleCreateChapter = () => {
    setSelectedChapter(null);
    setShowCreateModal(true);
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setShowEditModal(true);
  };

  const handleDeleteChapterConfirm = (chapter) => {
    setSelectedChapter(chapter);
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
        <h2>Chapter Management</h2>
        <Button variant="primary" onClick={handleCreateChapter}>
          Create Chapter
        </Button>
      </div>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Novel ID</th>
            <th>Chapter Name</th>
            <th>Chapter Content</th>
            <th>Chapter Number</th>
            <th>Create At</th>
            <th>Update At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter, index) => (
            <tr key={chapter.id}>
              <td>{index + 1}</td>
              <td>{chapter.id}</td>
              <td>{chapter.novelId}</td>
              <td>{chapter.nameChapter}</td>
              <td>{chapter.content.slice(0, 50)}...</td>
              <td>{chapter.numberChapter}</td>
              <td>{chapter.creatAt}</td>
              <td>{chapter.updateAt || '-'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditChapter(chapter)}>
                      <i className="fas fa-edit"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteChapterConfirm(chapter)}>
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
  <ChapterForm
    show={showCreateModal}
    onHide={() => setShowCreateModal(false)}
    onSubmit={handleCreateChapterSubmit}
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
  <ChapterForm
    show={showEditModal}
    onHide={() => setShowEditModal(false)}
    onSubmit={handleUpdateChapterSubmit}
    chapter={selectedChapter}
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
          Are you sure you want to delete this chapter?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleDeleteChapter(selectedChapter.id);
            setShowDeleteModal(false);
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default ChapterTable;
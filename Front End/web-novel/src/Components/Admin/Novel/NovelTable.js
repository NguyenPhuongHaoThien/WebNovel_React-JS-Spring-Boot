import React, { useState, useEffect, useContext } from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsSearch, BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import NovelForm from './NovelForm';
import '../Part/modal.css';
import AddChapterModal from './AddChapter';
import AdminLayout from '../Part/AdminLayout';
import { fetchAllNovels, createNovel, updateNovel, deleteNovel, addChapterToNovel } from '../../../Services/NovelService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const NovelTable = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const { user } = useContext(UserContext);
  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [selectedNovelForAddChapter, setSelectedNovelForAddChapter] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (user.auth && user.role === 'ROLE_ADMIN') {
      fetchNovelsFromAPI();
    } else {
      // Người dùng chưa đăng nhập hoặc không có quyền truy cập, chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [user.auth, user.role, navigate]);

  const fetchNovelsFromAPI = async () => {
    try {
      const novelsData = await fetchAllNovels();
      setNovels(novelsData);
    } catch (error) {
      console.error('Error fetching novels:', error);
    }
  };

  const createNovelHandler = async (novelData) => {
    try {
      const newNovel = await createNovel(novelData);
      setNovels([...novels, newNovel]);
      setShowCreateModal(false);
      toast.success('Novel created successfully');
    } catch (error) {
      console.error('Error creating novel:', error);
      toast.error('Error creating novel');
    }
  };

  const updateNovelHandler = async (novelData) => {
    try {
      const updatedNovel = await updateNovel(novelData);
      const updatedNovels = novels.map((novel) =>
      novelData.novel.id === updatedNovel.id ? updatedNovel : novel
      );
      setNovels(updatedNovels);
      setSelectedNovel(null);
      setShowEditModal(false);
      toast.success('Novel updated successfully');
    } catch (error) {
      console.error('Error updating novel:', error);
      toast.error('Error updating novel');
    }
  };

  const deleteNovelHandler = async (novelId) => {
    try {
      await deleteNovel(novelId);
      const updatedNovels = novels.filter((novel) => novel.id !== novelId);
      setNovels(updatedNovels);
      setShowDeleteModal(false);
      toast.success('Novel deleted successfully');
    } catch (error) {
      console.error('Error deleting novel:', error);
      toast.error('Error deleting novel');
    }
  };

  const handleAddChapter = async (novelId, chapterName, chapterContent) => {
    try {
      const chapterData = { nameChapter: chapterName, content: chapterContent };
      await addChapterToNovel(novelId, chapterData);
      fetchNovelsFromAPI(); // Tải lại dữ liệu tiểu thuyết sau khi thêm chương
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleCreateNovel = () => {
    setSelectedNovel(null);
    setShowCreateModal(true);
  };

  const handleEditNovel = (novel) => {
    setSelectedNovel(novel);
    setShowEditModal(true);
  };

  const handleDeleteNovel = (novel) => {
    setSelectedNovel(novel);
    setShowDeleteModal(true);
  };

  const openAddChapterModal = (novel) => {
    setSelectedNovelForAddChapter(novel);
    setShowAddChapterModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    fetchNovelsFromAPI(); // Tải lại dữ liệu tiểu thuyết sau khi đóng modal
  };

  return (
    <AdminLayout>
      <div className="admin-main-title">
        <h2>Novel Management</h2>
        <Button variant="primary" onClick={handleCreateNovel}>
          Create Novel
        </Button>
      </div>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Tên Tiểu Thuyết</th>
            <th>Tác Giả</th>
            <th>Danh Mục</th>
            <th>Đánh Giá</th>
            <th>Lượt Xem</th>
            <th>Ảnh Bìa</th>
            <th>Số Chương</th>
            <th>Số Đánh Giá</th>
            <th>Số Bình Luận</th>
            <th>Tổng Tiền Thưởng</th>
            <th>Lượt Yêu Thích</th>
            <th>Lượt Đề Xuất</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {novels.map((novelData, index) => (
            <tr key={novelData.novel.id}>
              <td>{index + 1}</td>
              <td>{novelData.novel.id}</td>
              <td>{novelData.novel.nameNovel}</td>
              <td>{novelData.categoryName}</td>
             <td>{novelData.authorName}</td>
              <td>{novelData.novel.averageRating}</td>
              <td>{novelData.novel.view}</td>
              <td>
                {novelData.novel.avatarNovel && (
                  <img src={novelData.novel.avatarNovel} alt="Avatar" width="50" />
                )}
              </td>
              <td>{novelData.novel.numberChapter}</td>
              <td>{novelData.novel.ratingCount}</td>
              <td>{novelData.novel.commentCount}</td>
              <td>{novelData.novel.totalRewardAmount}</td>
              <td>{novelData.novel.favoriteCount}</td>
              <td>{novelData.novel.recommendationCount}</td>
              <td>{novelData.novel.active ? 'Active' : 'Inactive'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditNovel(novelData)}>
                      <i className="fas fa-edit"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteNovel(novelData)}>
                      <i className="fas fa-trash"></i> Delete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => openAddChapterModal(novelData.novel)}>
                      <i className="fas fa-plus"></i> Add Chapter
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
        onHide={handleCloseModal}
        size="lg"
        centered
        dialogClassName="custom-modal"
      >
        <NovelForm
          show={showCreateModal}
          onHide={handleCloseModal}
          onSubmit={createNovelHandler}
          isEditing={false}
        />
      </Modal>

      <Modal
        show={showEditModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        dialogClassName="custom-modal"
      >
        <NovelForm
          show={showEditModal}
          onHide={handleCloseModal}
          onSubmit={updateNovelHandler}
          novel={selectedNovel}
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
        <Modal.Body>Are you sure you want to delete this novel?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteNovelHandler(selectedNovel.id);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <AddChapterModal
        show={showAddChapterModal}
        onHide={() => setShowAddChapterModal(false)}
        onAddChapter={handleAddChapter}
        novelId={selectedNovelForAddChapter?.id}
      />
    </AdminLayout>
  );
};

export default NovelTable;
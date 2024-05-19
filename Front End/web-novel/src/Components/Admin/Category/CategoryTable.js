import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import '../Part/admin_part.css';
import '../Part/novel_table.css';
import CategoryForm from './CategoryForm';
import '../Part/modal.css';
import AdminLayout from '../Part/AdminLayout';
import { fetchAllCategories, createCategory, updateCategory, deleteCategory } from '../../../Services/CategoryService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const CategoryTable = () => {
  const [openAdminSidebarToggle, setOpenAdminSidebarToggle] = useState(false);
  const OpenAdminSidebar = () => {
    setOpenAdminSidebarToggle(!openAdminSidebarToggle);
  };

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToastMessage('Error fetching categories', 'error');
    }
  };

  const handleCreateCategorySubmit = async (categoryData) => {
    try {
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setShowCreateModal(false);
      showToastMessage('Category created successfully!', 'success');
    } catch (error) {
      console.error('Error creating category:', error);
      showToastMessage('Error creating category', 'error');
    }  };

  const handleUpdateCategorySubmit = async (categoryData) => {
    try {
      const updatedCategory = await updateCategory(categoryData);
      const updatedCategories = categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      setSelectedCategory(null);
      setShowEditModal(false);
      showToastMessage('Category updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showToastMessage('Error updating category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      const updatedCategories = categories.filter((category) => category.id !== categoryId);
      setCategories(updatedCategories);
      setShowDeleteModal(false);
      showToastMessage('Category deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showToastMessage('Error deleting category', 'error');
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategoryConfirm = (category) => {
    setSelectedCategory(category);
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
      <div className="admin-main-title">
        <h2>Category Management</h2>
        <Button variant="primary" onClick={handleCreateCategory}>
          Create Category
        </Button>
      </div>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Tên Thể Loại</th>
            <th>Mô Tả</th>
            <th>Số Novel</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>{category.novelCount}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditCategory(category)}>
                      <i className="fas fa-edit"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteCategoryConfirm(category)}>
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
        <CategoryForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateCategorySubmit}
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
        <CategoryForm
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSubmit={handleUpdateCategorySubmit}
          category={selectedCategory}
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
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleDeleteCategory(selectedCategory.id);
            setShowDeleteModal(false);
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default CategoryTable;
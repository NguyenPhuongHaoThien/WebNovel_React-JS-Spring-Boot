import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Bookmark, FileText } from 'react-bootstrap-icons';

const CategoryForm = ({ show, onHide, onSubmit, category, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    novelCount: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: '',
        description: '',
        novelCount: 0,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="custom-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Category' : 'Create Category'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Tên Thể Loại:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Bookmark />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formCategoryDescription">
            <Form.Label>Mô Tả:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formNovelCount">
            <Form.Label>Số Novel:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="novelCount"
                value={formData.novelCount}
                onChange={handleChange}
                disabled
              />
            </InputGroup>
          </Form.Group>
          </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryForm;
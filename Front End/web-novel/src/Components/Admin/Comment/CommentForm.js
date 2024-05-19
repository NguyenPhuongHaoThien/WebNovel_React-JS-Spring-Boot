import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Person, Book, FileText, Calendar2Date } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const CommentForm = ({ show, onHide, onSubmit, comment, isEditing }) => {
  const [formData, setFormData] = useState({
    id: '',
    userId: '',
    novelId: '',
    content: '',
    date: '',
    active: true,
  });

  useEffect(() => {
    if (comment) {
      setFormData(comment);
    } else {
      setFormData({
        id: '',
        userId: '',
        novelId: '',
        content: '',
        date: '',
        active: true,
      });
    }
  }, [comment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onHide();
      showToastMessage(`Comment ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} comment:`, error);
      showToastMessage(`Error ${isEditing ? 'updating' : 'creating'} comment`, 'error');
    }
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
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="custom-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Comment' : 'Create Comment'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUserId">
            <Form.Label>Username:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formNovelId">
            <Form.Label>Novel Name:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Book />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="novelId"
                value={formData.novelId}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formContent">
            <Form.Label>Content:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formDate">
            <Form.Label>Date:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Calendar2Date />
              </InputGroup.Text>
              <FormControl
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formActive">
            <Form.Check
              type="checkbox"
              name="active"
              label="Active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
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

export default CommentForm;
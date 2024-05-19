import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Book, FileText, Hash, Calendar2Date } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { createChapter, updateChapter } from '../../../Services/ChapterService';

const ChapterForm = ({ show, onHide, chapter, isEditing, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    novelId: '',
    nameChapter: '',
    content: '',
    numberChapter: 1,
    creatAt: '',
    updateAt: '',
  });

  useEffect(() => {
    if (chapter) {
      setFormData({
        id: chapter.id,
        novelId: chapter.novelId,
        nameChapter: chapter.nameChapter,
        content: chapter.content,
        numberChapter: chapter.numberChapter,
        creatAt: chapter.creatAt ? new Date(chapter.creatAt).toISOString().split('T')[0] : '',
        updateAt: chapter.updateAt ? new Date(chapter.updateAt).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        id: '',
        novelId: '',
        nameChapter: '',
        content: '',
        numberChapter: 1,
        creatAt: '',
        updateAt: '',
      });
    }
  }, [chapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const creatAtDate = formData.creatAt ? new Date(formData.creatAt) : null;
    const updateAtDate = formData.updateAt ? new Date(formData.updateAt) : null;

    const submittedData = {
      ...formData,
      creatAt: creatAtDate ? creatAtDate.toISOString().split('T')[0] : '',
      updateAt: updateAtDate ? updateAtDate.toISOString().split('T')[0] : '',
    };

    if (isEditing && submittedData.updateAt === '') {
      showToastMessage('Please select an update date', 'warning');
      return;
    }

    onSubmit(submittedData);
  };

  const showToastMessage = (message, type) => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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
        <Modal.Title>{isEditing ? 'Edit Chapter' : 'Create Chapter'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNovelId">
            <Form.Label>Novel ID:</Form.Label>
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

          <Form.Group controlId="formChapterName">
            <Form.Label>Chapter Name:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="nameChapter"
                value={formData.nameChapter}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formChapterContent">
            <Form.Label>Chapter Content:</Form.Label>
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

          <Form.Group controlId="formChapterNumber">
            <Form.Label>Chapter Number:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Hash />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="numberChapter"
                value={formData.numberChapter}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formCreateAt">
            <Form.Label>Create At:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Calendar2Date />
              </InputGroup.Text>
              <FormControl
                type="date"
                name="creatAt"
                value={formData.creatAt || ''}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formUpdateAt">
            <Form.Label>Update At:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Calendar2Date />
              </InputGroup.Text>
              <FormControl
                type="date"
                name="updateAt"
                value={formData.updateAt || ''}
                onChange={handleChange}
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

export default ChapterForm;
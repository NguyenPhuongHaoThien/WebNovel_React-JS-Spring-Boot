import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addChapterToNovel } from '../../../Services/NovelService';
import { toast } from 'react-toastify';

const AddChapterModal = ({ show, onHide, novelId }) => {
  const [chapterName, setChapterName] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addChapterToNovel(novelId, { nameChapter: chapterName, content: chapterContent });
      setChapterName('');
      setChapterContent('');
      onHide();
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Chapter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="chapterName">
            <Form.Label>Chapter Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter chapter name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="chapterContent">
            <Form.Label>Chapter Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter chapter content"
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Add Chapter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddChapterModal;
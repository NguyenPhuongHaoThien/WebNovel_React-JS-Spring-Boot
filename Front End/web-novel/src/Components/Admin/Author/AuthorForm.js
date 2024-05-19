// AuthorForm.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Person, Envelope, Briefcase, Globe, Facebook, Twitter, Instagram, Youtube } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { createAuthor, updateAuthor } from '../../../Services/AuthorService';

const AuthorForm = ({ show, onHide, onSubmit, author, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: null,
    email: '',
    phone: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    website: '',
    active: true,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (author) {
      setFormData({
        ...author,
        avatar: author.avatar || null, // Thay đổi ở đây
      });
      if (author.avatar) {
        setAvatarPreview(author.avatar);
      } else {
        setAvatarPreview(null);
      }
  

    } else {
      setFormData({
        name: '',
        description: '',
        avatar: null,
        email: '',
        phone: '',
        address: '',
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        website: '',
        active: true,
      });
      setAvatarPreview(null);
    }
  }, [author]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
  
      reader.readAsDataURL(file);
    } else {
      // Nếu không có tệp mới được chọn, giữ nguyên avatarPreview cũ
      setAvatarFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('author', JSON.stringify(formData));
      if (avatarFile) {
        formDataToSend.append('avatarFile', avatarFile);
      }
      if (isEditing) {
        await updateAuthor(formDataToSend);
      } else {
        await createAuthor(formDataToSend);
      }
      onHide();
    } catch (error) {
      console.error('Error submitting author form:', error);
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} author: ${error.message}`);
    }
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
        <Modal.Title>{isEditing ? 'Edit Author' : 'Create Author'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Briefcase />
              </InputGroup.Text>
              <FormControl
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formAvatar">
            <Form.Label>Avatar:</Form.Label>
            <FormControl type="file" onChange={handleAvatarChange} />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2"
                width="100"
              />
            )}
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Envelope />
              </InputGroup.Text>
              <FormControl
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Address:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Globe />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formFacebook">
            <Form.Label>Facebook:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Facebook />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formTwitter">
            <Form.Label>Twitter:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Twitter />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formInstagram">
            <Form.Label>Instagram:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Instagram />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formYoutube">
            <Form.Label>Youtube:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Youtube />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formWebsite">
            <Form.Label>Website:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Globe />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="website"
                value={formData.website}
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
              onChange={handleChange}
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

export default AuthorForm;
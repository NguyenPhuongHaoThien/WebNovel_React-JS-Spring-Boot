import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Person, Envelope, PersonPlus, Calendar2Date } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { createUser, updateUser } from '../../../Services/UserService';

const UserForm = ({ show, onHide, onSubmit, user, isEditing }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sex: '',
    role: '',
    fullName: '',
    avatar: null,
    createDay: '',
    active: true,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);


  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        avatar: user.avatar || null,
        createDay: user.createDay ? user.createDay.split('T')[0] : '',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      } else {
        setAvatarPreview(null);
      }
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: '',
        role: '',
        fullName: '',
        avatar: null,
        createDay: '',
        active: true,
      });
    }
  }, [user]);

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
      setAvatarPreview(user.avatar || null); // Thay đổi ở đây
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('user', JSON.stringify(formData));
        if (avatarFile) {
            formDataToSend.append('avatarFile', avatarFile);
        }
        if (isEditing) {
            await updateUser(formDataToSend);
        } else {
            await createUser(formDataToSend);
        }
        onHide();
    } catch (error) {
        console.error('Error submitting user form:', error);
        console.log(error.response);
        toast.error(`Error ${isEditing ? 'updating' : 'creating'} user: ${error.message}`);
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
        <Modal.Title>{isEditing ? 'Edit User' : 'Create User'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </InputGroup>
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

          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formSex">
            <Form.Label>Sex:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <PersonPlus />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formFullName">
            <Form.Label>Full Name:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formAvatarUser">
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

          <Form.Group controlId="formCreateDay">
            <Form.Label>Create Day:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Calendar2Date />
              </InputGroup.Text>
              <FormControl
                type="date"
                name="createDay"
                value={formData.createDay}
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

export default UserForm;
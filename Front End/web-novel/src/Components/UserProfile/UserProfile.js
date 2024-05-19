import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaVenus, FaMars, FaRegCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { UserContext } from '../../Contexts/UserContext';
import { getUserProfileById, updateUserProfile } from '../../Services/UserService';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import Header from '../Part/Header/Header';
import Footer from '../Part/Footer/Footer';

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sex: '',
    role: '',
    fullName: '',
    avatar: null,
    createDay: null,
    active: true,
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.auth) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfileById(user.id);
        setUserInfo(data);
        setPreviewAvatar(data.avatar);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user.auth, user.id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setSelectedAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo.password !== userInfo.confirmPassword) {
      alert('Password and Confirm Password do not match');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('user', JSON.stringify(userInfo));
      if (selectedAvatar) {
        formData.append('avatarFile', selectedAvatar);
      }

      const updatedUser = await updateUserProfile(formData);
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUser,
      }));
      alert('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Failed to update user profile. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <Row>
          <Col md={4}>
            <div className="user-avatar">
              <Image src={previewAvatar || 'default-avatar.png'} roundedCircle fluid />
              <Form.Group controlId="avatar">
                <Form.Label>Change Avatar</Form.Label>
                <Form.Control type="file" onChange={handleAvatarChange} />
              </Form.Group>
            </div>
          </Col>
          <Col md={8}>
            <div className="user-info">
              <h2>User Profile</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>
                    <FaUser className="icon" />
                    Username
                  </Form.Label>
                  <Form.Control type="text" name="username" value={userInfo.username} readOnly />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>
                    <FaEnvelope className="icon" />
                    Email
                  </Form.Label>
                  <Form.Control type="email" name="email" value={userInfo.email} readOnly />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>
                    <FaLock className="icon" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>
                    <FaLock className="icon" />
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="sex">
                  <Form.Label>
                    <FaVenus className="icon" />
                    <FaMars className="icon" />
                    Sex
                  </Form.Label>
                  <Form.Control as="select" name="sex" value={userInfo.sex} onChange={handleChange}>
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="role">
                  <Form.Label>
                    <FaUser className="icon" />
                    Role
                  </Form.Label>
                  <Form.Control type="text" name="role" value={userInfo.role} readOnly />
                </Form.Group>
                <Form.Group controlId="fullName">
                  <Form.Label>
                    <FaUser className="icon" />
                    Full Name
                  </Form.Label>
                  <Form.Control type="text" name="fullName" value={userInfo.fullName} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="createDay">
                  <Form.Label>
                    <FaRegCalendarAlt className="icon" />
                    Create Day
                  </Form.Label>
                  <Form.Control type="text" name="createDay" value={userInfo.createDay} readOnly />
                </Form.Group>
                <Form.Group controlId="active">
                  <Form.Label>
                    {userInfo.active ? (
                      <>
                        <FaCheckCircle className="icon active" />
                        Active
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="icon inactive" />
                        Inactive
                      </>
                    )}
                  </Form.Label>
                </Form.Group>
                <Button variant="primary" type="submit" className="update-button">
                  Update Profile
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
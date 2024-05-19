import './ResetPassword.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetPasswordTokenApi, resetPasswordApi }  from '../../Services/UserService';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const verifyToken = async () => {
      try {
        const res = await verifyResetPasswordTokenApi({ token });
        if (res.data.success) {
          setTokenVerified(true);
        } else {
          toast.error(res.data.message);
          navigate('/');
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        toast.error('An error occurred during token verification');
        navigate('/');
      }
    };

    if (token) {
      verifyToken();
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please enter password and confirm password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password and confirm password do not match');
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    setLoading(true);
    try {
      const res = await resetPasswordApi({ token, newPassword: password });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error during reset password:', error);
      toast.error('An error occurred during reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenVerified) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <FaLock className="mb-3" size={48} />
          <h3>Verifying token...</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="reset-password-container shadow p-4 rounded">
        <h2 className="text-center mb-4">
          <FaLock className="mr-2" />
          Tạo Lại Mật Khẩu
        </h2>
        <Form>
          <Form.Group controlId="formPassword">
            <Form.Label>Mật Khẩu Mới</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Nhập Lại Mật Khẩu Mới</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3 w-100"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPassword;
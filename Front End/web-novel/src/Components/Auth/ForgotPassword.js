import './ForgotPassword.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi }  from '../../Services/UserService';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      toast.error('An error occurred during forgot password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="forgot-password-container shadow p-4 rounded">
        <h2 className="text-center mb-4">
          <FaEnvelope className="mr-2" />
          Forgot Password
        </h2>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3 w-100"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Password Link'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ForgotPassword;
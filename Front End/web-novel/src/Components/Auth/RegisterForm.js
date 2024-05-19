import './RegisterForm.css';
import { useState, useContext } from 'react';
import { registerApi, loginApi } from '../../Services/UserService';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../Contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { loginContext } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const data = await registerApi(username, email, password, confirmPassword);
      console.log('Registration response:', data);
  
      if (data === 'User created successfully') {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      toast.error('Registration failed. Please try again.');
    }
  }

  return (
    <div className="register-page">
      <div className="wrapper">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" disabled={!username || !email || !password || !confirmPassword}>
            Register
          </button>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
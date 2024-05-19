import './LoginForm.css';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loginApi, verifyOTPApi } from '../../Services/UserService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEnvelope, FaEyeSlash, FaEye, FaSync } from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import backgroundImage from '../../Assets/Auth/background.jpg';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginContext } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOTP] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isOTPSent && location.pathname === '/login') {
      navigate('/home');
    }
  }, [isOTPSent, location.pathname]);

  const handleLogin = async (email, password) => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    if (password !== '' && password === password.toUpperCase()) {
      toast.warning('Caps Lock is on');
    }

    setLoadingApi(true);
    try {
      const res = await loginApi(email, password);
      console.log('Login API response:', res);
      if (res.data.success) {
        setIsOTPSent(true);
        setUserId(res.data.data.userId);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoadingApi(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoadingApi(true);
    try {
      const res = await verifyOTPApi({ otp, userId });
      console.log('Verify OTP API response:', res);
      if (res.data.success) {
        const { token, id, role, email } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        loginContext(email, token, id, role);
        setIsOTPSent(false);
        if (role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast.error('An error occurred during OTP verification');
    } finally {
      setLoadingApi(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event.key === 'Enter') {
      if (isOTPSent) {
        handleVerifyOTP();
      } else {
        handleLogin(email, password);
      }
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="wrapper animate__animated animate__fadeIn">
        <h1 className="animate__animated animate__bounceIn">Đăng Nhập</h1>
        <div className="input-box animate__animated animate__fadeInLeft">
          <input
            type="email"
            placeholder="Địa Chỉ Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <span className="icon">
            <FaEnvelope />
          </span>
        </div>
        <div className="input-box animate__animated animate__fadeInRight">
          <input
            type={isShowPassword ? 'text' : 'password'}
            placeholder="Mật Khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => handlePressEnter(event)}
          />
          <span className="icon" onClick={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="remember-forgot animate__animated animate__fadeInUp">
          <label>
            <input type="checkbox" /> Ghi Nhớ
          </label>
          <Link to="/forgot-password">Quên Mật Khẩu?</Link>
        </div>
        <div className="register-link animate__animated animate__fadeInUp">
          <span>Chưa có tài khoản?</span>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
        {isOTPSent ? (
          <div className="otp-container animate__animated animate__fadeInUp">
            <div className="input-box">
              <input
                type="text"
                placeholder="Mã Xác Thực OTP"
                value={otp}
                onChange={(event) => setOTP(event.target.value)}
                onKeyDown={(event) => handlePressEnter(event)}
              />
            </div>
            <button
              className={otp ? 'button active animate__animated animate__pulse animate__infinite' : 'button'}
              disabled={!otp || loadingApi}
              onClick={handleVerifyOTP}
            >
              {loadingApi && <FaSync className="spin" />}
              &nbsp; Xác Thực OTP
            </button>
          </div>
        ) : (
          <button
            className={(email && password ? 'button active animate__animated animate__pulse animate__infinite' : 'button')}
            disabled={!email || !password || loadingApi}
            onClick={() => handleLogin(email, password)}
          >
            {loadingApi && <FaSync className="spin" />}
            &nbsp; Đăng Nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

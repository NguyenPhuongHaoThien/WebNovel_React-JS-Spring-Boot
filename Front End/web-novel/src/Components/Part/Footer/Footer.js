import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>Về chúng tôi</h4>
            <p>
              Mê Truyện Chữ là nền tảng mở trực tuyến, miễn phí đọc truyện chữ
              được convert hoặc dịch kỹ lưỡng, do các converter và dịch giả
              đóng góp, rất nhiều truyện hay và nổi bật được cập nhật nhanh nhất
              với đủ các thể loại tiên hiệp, kiếm hiệp, huyền ảo ...
            </p>
          </div>
          <div className="col">
            <h4>Liên kết</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h4>Theo dõi chúng tôi</h4>
            <ul className="social-icons">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="text-center">
          &copy; {new Date().getFullYear()} Mê Truyện Chữ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
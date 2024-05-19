import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBook, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaStar, FaUser } from 'react-icons/fa';
import './Header.css';
import { UserContext } from '../../../Contexts/UserContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { searchNovelsWithSuggestions } from '../../../Services/NovelService';
import { fetchAllCategories } from '../../../Services/CategoryService';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    try {
      const categoriesData = await fetchAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload();
    toast.success('Đăng xuất thành công');
  };

  const handleSearchInputChange = async (event) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);

    if (keyword.trim() !== '') {
      try {
        const suggestions = await searchNovelsWithSuggestions(keyword);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSuggestionClick = (novelId) => {
    setSearchTerm('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
    navigate(`/home/novel_detail/${novelId}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
      window.location.reload();
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">MeTruyenChu</Link>
        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                ref={searchInputRef}
              />
              <button type="submit" className="search-button">
                <FaSearch className="icon" />
              </button>
            </div>
            {showSuggestions && (
              <div className="search-suggestions">
                <ul>
                  {searchSuggestions.map((suggestion) => (
                    <li key={suggestion.id} onClick={() => handleSearchSuggestionClick(suggestion.id)}>
                      <div className="suggestion-name">{suggestion.nameNovel}</div>
                      <div className="suggestion-details">
                        <div className="suggestion-author">Tác giả: {suggestion.author}</div>
                        <div className="suggestion-category">Thể loại: {suggestion.category}</div>
                        <div className="suggestion-rating">
                          <FaStar className="icon" />
                          <span>{suggestion.averageRating}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
        <div className="navbar-links">
          <div className="dropdown">
            <Link to="/genre" className="dropdown-toggle">Thể loại</Link>
            <ul className="dropdown-menu">
              <li><Link to="/genre/all">Tất cả</Link></li>
              {categories.map((category) => (
                <li key={category.id}><Link to={`/genre/${category.id}`}>{category.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="dropdown">
            <Link to="/novels/page/rankings" className="dropdown-toggle">Bảng xếp hạng</Link>
            <ul className="dropdown-menu">
              <li><Link to="/novels/page/rankings/most-popular">Thịnh hành</Link></li>
              <li><Link to="/novels/page/rankings/most-read">Đọc nhiều</Link></li>
              <li><Link to="/novels/page/rankings/most-recommended">Đề cử</Link></li>
              <li><Link to="/novels/page/rankings/highly-rated">Đánh giá cao</Link></li>
            </ul>
          </div>
        </div>
        <div className="navbar-buttons">
          <Link to="/submit" className="btn-submit">
            <FaBook className="icon" />
            Đăng truyện
          </Link>
          {user.auth ? (
            <>
              <Link to="/user-profile" className="btn-profile">
                <FaUser className="icon" />
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt className="icon" />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                <FaSignInAlt className="icon" />
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-register">
                <FaUserPlus className="icon" />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
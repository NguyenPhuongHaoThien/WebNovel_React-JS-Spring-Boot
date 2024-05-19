import React, { useState, useEffect, useContext } from 'react';
import './SearchResults.css';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from '../Part/Header/Header';
import Footer from '../Part/Footer/Footer';
import { fetchCategories, searchNovels } from '../../Services/NovelService';
import { fetchAuthors } from '../../Services/AuthorService';
import { fetchAllCategories } from '../../Services/CategoryService';

import { UserContext } from '../../Contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [novels, setNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewFilter, setViewFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 16;

  const { user } = useContext(UserContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    if (user.auth) {
      fetchCategoriesData();
      fetchAuthorsData();
      searchNovelsData(keyword);
    } else {
      navigate('/login');
    }
  }, [user.auth, navigate, location.search]);

  const fetchCategoriesData = async () => {
    try {
      const categoriesData = await fetchAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthorsData = async () => {
    try {
      const authorsData = await fetchAuthors();
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const searchNovelsData = async (keyword) => {
    try {
      const searchResults = await searchNovels(
        selectedCategories.map(category => category.id),
        viewFilter,
        ratingFilter,
        chapterFilter,
        currentPage - 1,
        itemsPerPage,
        keyword
      );
      setNovels(searchResults.novels);
      setCurrentPage(searchResults.currentPage + 1);
      setTotalPages(searchResults.totalPages);
    } catch (error) {
      console.error('Error searching novels:', error);
    }
  };

  const handleCategoryClick = category => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(selectedCategory => selectedCategory.id !== category.id)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    setCurrentPage(1);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');
    searchNovelsData(keyword);
  }, [selectedCategories, viewFilter, ratingFilter, chapterFilter, currentPage, location.search]);

  return (
    <>
      <Header />
      <div className="search-results">
        <div className="sidebar">
          <h3>Thể loại</h3>
          <ul>
            {categories.map(category => (
              <li
                key={category.id}
                className={selectedCategories.includes(category) ? 'selected' : ''}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <div className="filters">
            <div className="filter">
              <label htmlFor="viewFilter">Lượt đọc:</label>
              <select
                id="viewFilter"
                value={viewFilter}
                onChange={event => {
                  setViewFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="1-1000">1-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            <div className="filter">
              <label htmlFor="ratingFilter">Đánh giá:</label>
              <select
                id="ratingFilter"
                value={ratingFilter}
                onChange={event => {
                  setRatingFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="1-2">1-2 sao</option>
                <option value="2-3">2-3 sao</option>
                <option value="3-4">3-4 sao</option>
                <option value="4-5">4-5 sao</option>
              </select>
            </div>

            <div className="filter">
              <label htmlFor="chapterFilter">Số chương:</label>
              <select
                id="chapterFilter"
                value={chapterFilter}
                onChange={event => {
                  setChapterFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="1-10">1-10 chương</option>
                <option value="10-50">10-50 chương</option>
                <option value="50-100">50-100 chương</option>
                <option value="100+">100+ chương</option>
              </select>
            </div>
          </div>

          <div className="results">
            {novels.map(novel => (
              <div className="result" key={novel.novel.id}>
                <img src={novel.novel.avatarNovel} alt={novel.novel.nameNovel} />
                <div className="details">
                  <h3>{novel.novel.nameNovel}</h3>
                  <div className="meta">
                    <span>{novel.authorName}</span>
                    <span>
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          color={index < Math.floor(novel.novel.averageRating) ? 'gold' : 'gray'}
                        />
                      ))}
                    </span>
                  </div>
                  <p>{novel.novel.body}</p>
                  <div className="tags">
                    <span className="genre">{novel.categoryName}</span>
                    <span className="chapters">{novel.novel.numberChapter} chương</span>
                    <span className="views">{novel.novel.view} lượt đọc</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <FaChevronLeft />
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
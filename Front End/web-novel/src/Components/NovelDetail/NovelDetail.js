import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaBook, FaUser } from 'react-icons/fa';
import { Container, Row, Col, Nav, Tab, Button, Form } from 'react-bootstrap';
import './NovelDetail.css';
import Header from '../Part/Header/Header';
import Footer from '../Part/Footer/Footer';
import { getNovelDetail, incrementViewCount, incrementCommentCount, incrementFavoriteCount, incrementRecommendationCount, updateRating, createComment } from '../../Services/NovelService';
import { UserContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const NovelDetail = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [comment, setComment] = useState('');
  const [novelData, setNovelData] = useState(null);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.auth) {
      navigate('/login');
      return;
    }

    const fetchNovelDetail = async () => {
      try {
        const data = await getNovelDetail(id);
        console.log('novelId:', id);
        console.log('Novel detail data:', data);
        console.log('User:', user);
        setNovelData(data);
      } catch (error) {
        console.error('Error fetching novel detail:', error);
      }
    };

    fetchNovelDetail();
  }, [id, user.auth]);

  const {
    novel,
    author,
    category,
    comments,
    totalChapters,
    chapters,
    latestChapter,
    totalNovels,
  } = novelData || {};

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', rating, review);
    updateRating(novel?.id || '', rating);
    setRating(0);
    setReview('');
    alert('Review submitted successfully!');
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    console.log('Submitting comment:', comment);
    const newComment = {
      userId: user.id,
      novelId: novel?.id || '',
      content: comment,
      createdAt: new Date(),
    };
    try {
      await createComment(newComment);
      incrementCommentCount(novel?.id || '');
      setComment('');
      alert('Comment submitted successfully!');
      const data = await getNovelDetail(id);
      setNovelData(data);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  const handleFavorite = () => {
    console.log('Adding to favorites');
    incrementFavoriteCount(novel?.id || '');
    alert('Added to favorites!');
  };

  const handleRecommend = () => {
    console.log('Recommending novel');
    incrementRecommendationCount(novel?.id || '');
    alert('Novel recommended!');
  };

  const renderPartThree = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <div className="body-content">
            <p>{novel?.body || 'Không có giới thiệu'}</p>
          </div>
        );
      case 'chapters':
        return (
          <ul className="chapters-list">
            {chapters?.map((chapter, index) => (
              <li key={index}>
                <Link to={`/read-novel/${novel?.id || ''}/chapters/${chapters && chapters.length > 0 ? chapters[0].id : ''}`}>{chapter.nameChapter}</Link>
              </li>
            ))}
          </ul>
        );
      case 'comments':
        return (
          <div className="comment-section">
            <ul className="comment-list">
              {comments?.map((commentData) => (
                <li key={commentData.comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <img src={commentData.user?.avatar || ''} alt={commentData.user?.username || ''} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-author">{commentData.user?.username || 'Unknown User'}</div>
                    <div className="comment-text">{commentData.comment.content}</div>
                    <div className="comment-date">{new Date(commentData.comment.createdAt).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="comment-form">
              <h4>Bình luận</h4>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Viết bình luận của bạn..."
                value={comment}
                onChange={handleCommentChange}
              />
              <Button variant="primary" onClick={handleSubmitComment}>
                Gửi bình luận
              </Button>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="review-form">
            <h4>Đánh giá truyện</h4>
            <div className="rating">
              <span>Đánh giá: </span>
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  color={index < rating ? '#f8bb86' : '#ccc'}
                  onClick={() => handleRatingChange(index + 1)}
                />
              ))}
            </div>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Viết đánh giá của bạn..."
              value={review}
              onChange={handleReviewChange}
            />
            <Button variant="primary" onClick={handleSubmitReview}>
              Gửi đánh giá
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="novel-detail-container">
        <div className="part-one">
          <div className="image-column">
            <div className="nh-thumb nh-thumb--large shadow">
              {novel && novel.avatarNovel ? (
                <img src={novel.avatarNovel} alt={novel.nameNovel} />
              ) : (
                <div>Không có ảnh bìa</div>
              )}
            </div>
          </div>
          <div className="info-column">
            <div className="novel-name">
              <h1>{novel?.nameNovel || 'Tên tiểu thuyết'}</h1>
            </div>
            <div className="category">
              <Link to={`/truyen?genre=${category?.id || ''}`} className="text-primary">
                {category?.name || 'Danh mục'}
              </Link>
            </div>
            <div className="stats">
              <div>
                <span className="font-weight-semibold">{totalChapters || 0}</span> Chương
              </div>
              <div>
                <span className="font-weight-semibold">{novel?.favoriteCount || 0}</span> Lượt yêu thích
              </div>
              <div>
                <span className="font-weight-semibold">{novel?.view || 0}</span> Lượt đọc
              </div>
            </div>
            <div className="rating">
              <span className="nh-rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <span className="active" style={{ width: `${(novel?.averageRating || 0) * 20}%` }}>
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </span>
              </span>
              <span className="d-inline-block ml-2">
                <span className="font-weight-semibold">{novel?.averageRating || 0}</span>/5
              </span>
              <span className="d-inline-block text-secondary ml-1">({novel?.ratingCount || 0} đánh giá)</span>
            </div>
            <div className="actions">
              <div className="action-buttons">
                <Link
                  to={`/read-novel/${novel?.id || ''}/chapters/${chapters && chapters.length > 0 ? chapters[0].id : ''}`}
                  className="btn btn-primary btn-md btn-shadow font-weight-semibold d-flex align-items-center justify-content-center"
                  style={{ color: 'rgb(255, 255, 255)' }}
                  onClick={() => {
                    console.log('Reading novel');
                    incrementViewCount(novel?.id || '');
                  }}
                >
                  <i className="nh-icon icon-glass mr-2"></i>Đọc truyện
                </Link>
                <button
                  className="btn btn-outline-secondary btn-md font-weight-semibold d-flex align-items-center justify-content-center"
                  onClick={handleFavorite}
                >
                  <i className="nh-icon icon-save mr-2"></i> Yêu thích
                </button>
                <button
                  className="btn btn-outline-warning btn-md bg-yellow-white text-primary font-weight-semibold d-flex align-items-center justify-content-center"
                  onClick={handleRecommend}
                >
                  <i className="svg-icon icon-flower mr-2"></i> Đề cử
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="part-two">
          <button
            className={`btn ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => setActiveTab('intro')}
          >
            Giới thiệu
          </button>
          <button
            className={`btn ${activeTab === 'chapters' ? 'active' : ''}`}
            onClick={() => setActiveTab('chapters')}
          >
            Danh sách chương
          </button>
          <button
            className={`btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Bình luận
          </button>
          <button
            className={`btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh giá
          </button>
        </div>
        <div className="part-three">
          <div className="body-content">{renderPartThree()}</div>
          <div className="author-info">
            <div className="nh-avatar">
              <img src={author?.avatar || ''} alt="Avatar" />
            </div>
            <div className="author-name">{author?.name || 'Tác giả'}</div>
            <div className="author-stats">
              <div>Số truyện: {author?.novelCount || 0}</div>
              <div>Số chương: {author?.chapterCount || 0}</div>
              <div>Tổng số truyện: {totalNovels || 0}</div>
            </div>
          </div>
        </div>
        <div className="part-four">
          <div>
            DÒNG CHƯƠNG MỚI: {latestChapter?.nameChapter || ''} (Cập nhật{' '}
            {latestChapter && latestChapter.updateAt
              ? new Date(latestChapter.updateAt).toLocaleString()
              : ''})
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetail;
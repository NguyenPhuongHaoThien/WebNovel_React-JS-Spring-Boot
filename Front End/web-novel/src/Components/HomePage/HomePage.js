import React, { useEffect, useState, useContext  } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaChevronLeft, FaChevronRight, FaBook, FaUser } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HomePage.css';
import banner from '../../Assets/HomePage/banner.jpg';
import Header from '../Part/Header/Header';
import Footer from '../Part/Footer/Footer';
import {
  fetchEditorPicks,
  fetchCurrentlyReading,
  fetchNewUpdates,
  fetchMostRead,
  fetchMostPopular,
  fetchMostRecommended,
  fetchHighlyRated,
  fetchNewlyReviewed,
  fetchNewlyPosted,
  fetchNewlyCompleted,
} from '../../Services/NovelService';
import { UserContext } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [editorPicks, setEditorPicks] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [newUpdates, setNewUpdates] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [mostRecommended, setMostRecommended] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [newlyReviewed, setNewlyReviewed] = useState([]);
  const [newlyPosted, setNewlyPosted] = useState([]);
  const [newlyCompleted, setNewlyCompleted] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });


    if (!user.auth) {
      navigate('/login');
      return;
    }


    const fetchData = async () => {
      try {
        const userId = user?.id; 

        const [
          editorPicksData,
          currentlyReadingData,
          newUpdatesData,
          mostReadData,
          mostPopularData,
          mostRecommendedData,
          highlyRatedData,
          newlyReviewedData,
          newlyPostedData,
          newlyCompletedData,
        ] = await Promise.all([
          fetchEditorPicks(),
          fetchCurrentlyReading(userId),
          fetchNewUpdates(),
          fetchMostRead(),
          fetchMostPopular(),
          fetchMostRecommended(),
          fetchHighlyRated(),
          fetchNewlyReviewed(),
          fetchNewlyPosted(),
          fetchNewlyCompleted(),
        ]);

        setEditorPicks(editorPicksData);
        setCurrentlyReading(currentlyReadingData);
        setNewUpdates(newUpdatesData);
        setMostRead(mostReadData);
        setMostPopular(mostPopularData);
        setMostRecommended(mostRecommendedData);
        setHighlyRated(highlyRatedData);
        setNewlyReviewed(newlyReviewedData);
        setNewlyPosted(newlyPostedData);
        setNewlyCompleted(newlyCompletedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage">
        {/* Part 0: Banner */}
        <div className="banner" data-aos="fade-in">
          <img src={banner} alt="Banner" />
          <div className="banner-overlay">
            <h1 data-aos="fade-up">Mê Truyện Chữ - MeTruyenChu</h1>
            <p data-aos="fade-up" data-aos-delay="200">
              Nền tảng online miễn phí đọc truyện chữ được convert hoặc dịch kỹ lưỡng.
            </p>
            <Link to="/stories" className="btn-explore" data-aos="fade-up" data-aos-delay="400">
              Khám phá ngay
            </Link>
          </div>
        </div>
  
        {/* Part 1: Biên tập viên đề cử và Đang đọc */}
        <div className="part1">
          <div className="editor-picks">
            <div className="section-header" data-aos="fade-up">
              <h2>Biên tập viên đề cử</h2>
              <Link to="/novels/page/editor-picks" className="link-see-more">
                Xem tất cả
              </Link>
            </div>
            <div className="novel-grid">
              {editorPicks.slice(0, 8).map((novel, index) => (
                <div key={novel.novel.id} className="novel-item" data-aos="zoom-in" data-aos-delay={index * 100}>
                  <Link to={`/home/novel_detail/${novel.novel.id}`}>
                    <img src={novel.novel.avatarNovel} alt="Avatar" width="50" />
                  </Link>
                  <div className="novel-info">
                    <h3>
                      <Link to={`/home/novel_detail/${novel.novel.id}`}>{novel.novel.nameNovel}</Link>
                    </h3>
                    <div className="rating">
                      <FaStar />
                      <span>{novel.novel.averageRating}</span>
                    </div>
                    <p>{novel.novel.body}</p>
                    <div className="author">
                      <FaUser />
                      <span>{novel.authorName}</span>
                    </div>
                    <div className="genre">
                      <FaBook />
                      <span>{novel.novel.categoryName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reading-guide">
            <div className="currently-reading" data-aos="fade-up">
              <div className="section-header">
                <h2>Đang đọc</h2>
              </div>
              {currentlyReading.slice(0, 5).map((reading, index) => (
                <div key={reading.id} className="reading-item" data-aos="fade-up" data-aos-delay={index * 100}>
                  <Link to={`/reading/${reading.id}`}>
                    <img src={reading.avatarNovel} alt="Avatar" width="50" />
                  </Link>
                  <div className="reading-info">
                    <h3>
                      <Link to={`/home/novel_detail/${reading.novel.id}`}>{reading.nameNovel}</Link>
                    </h3>
                    <p>Đã đọc: Chương {reading.currentChapter}/{reading.totalChapters}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="guide" data-aos="fade-up">
              <div className="section-header">
                <h2>Hướng dẫn</h2>
              </div>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="guide-item" data-aos="fade-up" data-aos-delay={index * 100}>
                  <Link to={`/guide/${index + 1}`}>Hướng dẫn {index + 1}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Part 2: Mới cập nhật */}
        <div className="part2" data-aos="fade-up">
          <div className="section-header">
            <h2>Mới cập nhật</h2>
            <Link to="/new-updates" className="link-see-more">
              Xem tất cả
            </Link>
          </div>
          <table className="novel-table">
            <thead>
              <tr>
                <th>Thể loại</th>
                <th>Tên novel</th>
                <th>Tên chương mới nhất</th>
                <th>Tên tác giả</th>
                <th>Thời gian cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {newUpdates.slice(0, 10).map((novel) => (
                <tr key={novel.novel.id}>
                  <td>
                    <Link to={`/genre/${novel.novel.categoryId}`}>{novel.categoryName}</Link>
                  </td>
                  <td>
                    <Link to={`/home/novel_detail/${novel.novel.id}`}>{novel.novel.nameNovel}</Link>
                  </td>
                  <td>
                    <Link to={`/chapter/${novel.lastChapterId}`}>{novel.lastChapterName}</Link>
                  </td>
                  <td>
                    <Link to={`/author/${novel.novel.authorId}`}>{novel.authorName}</Link>
                  </td>
                  <td>{new Date(novel.updateAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Part 3: Đọc nhiều, Đọc thịnh hành, Đề cử nhiều */}
        <div className="part3">
          <div className="most-read" data-aos="fade-up">
            <div className="section-header">
              <h2>Đọc nhiều nhất</h2>
              <Link to="/most-read" className="link-see-more">
                Xem tất cả
              </Link>
            </div>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên novel</th>
                  <th>Số lượt đọc</th>
                </tr>
              </thead>
              <tbody>
                {mostRead.slice(0, 10).map((novel, index) => (
                  <tr key={novel.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/home/novel_detail/${novel.id}`}>{novel.nameNovel}</Link>
                    </td>
                    <td>{novel.view}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="most-popular" data-aos="fade-up">
            <div className="section-header">
              <h2>Đọc thịnh hành nhất</h2>
              <Link to="/most-popular" className="link-see-more">
                Xem tất cả
              </Link>
            </div>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên novel</th>
                  <th>Số lượt comment</th>
                </tr>
              </thead>
              <tbody>
                {mostPopular.slice(0, 10).map((novel, index) => (
                  <tr key={novel.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/home/novel_detail/${novel.id}`}>{novel.nameNovel}</Link>
                    </td>
                    <td>{novel.commentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="most-recommended" data-aos="fade-up">
            <div className="section-header">
              <h2>Đề cử nhiều nhất</h2>
              <Link to="/most-recommended" className="link-see-more">
                Xem tất cả
              </Link>
            </div>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên novel</th>
                  <th>Số lượt đề cử</th>
                </tr>
              </thead>
              <tbody>
                {mostRecommended.slice(0, 10).map((novel, index) => (
                  <tr key={novel.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/home/novel_detail/${novel.id}`}>{novel.nameNovel}</Link>
                    </td>
                    <td>{novel.recommendationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Part 4: Đánh giá cao và Mới đánh giá */}
<div className="part4">
  <div className="highly-rated" data-aos="fade-up">
    <div className="section-header">
      <h2>Đánh giá cao</h2>
      <Link to="/highly-rated" className="link-see-more">
        Xem tất cả
      </Link>
    </div>
    <div className="novel-grid">
      {highlyRated.slice(0, 4).map((novel, index) => (
        <div key={novel.novel.id} className="novel-item" data-aos="zoom-in" data-aos-delay={index * 100}>
          <Link to={`/home/novel_detail/${novel.novel.id}`}>
            <img src={novel.novel.avatarNovel} alt="Avatar" width="50" />
          </Link>
          <div className="novel-info">
            <h3>
              <Link to={`/home/novel_detail/${novel.novel.id}`}>{novel.novel.nameNovel}</Link>
            </h3>
            <div className="rating">
              <FaStar />
              <span>{novel.novel.averageRating}</span>
            </div>
            <p>{novel.novel.body}</p>
            <div className="author">
              <FaUser />
              <span>{novel.authorName}</span>
            </div>
            <div className="genre">
              <FaBook />
              <span>{novel.novel.categoryName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div className="new-reviews" data-aos="fade-up">
    <div className="section-header">
      <h2>Mới đánh giá</h2>
      <Link to="/newly-reviewed" className="link-see-more">
        Xem tất cả
      </Link>
    </div>
    {newlyReviewed.slice(0, 3).map((review, index) => (
      <div key={review.comment.id} className="review-item" data-aos="fade-up" data-aos-delay={index * 100}>
        <Link to={`/user/${review.comment.userId}`}>
          <img src={review.userAvatar} alt="Avatar" width="10" />
        </Link>
        <div className="review-info">
          <h3>
            <Link to={`/user/${review.comment.userId}`}>{review.comment.userName}</Link>
          </h3>
          <div className="book-title">
            <Link to={`/home/novel_detail/${review.comment.novelId}`}>{review.comment.novelName}</Link>
          </div>
          <div className="rating">
            <FaStar />
            <span>{review.comment.rating}</span>
          </div>
          <p>{review.comment.content}</p>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Part 5: Mới đăng và Mới hoàn thành */}
<div className="part5">
  <div className="newly-posted" data-aos="fade-up">
    <div className="section-header">
      <h2>Mới đăng</h2>
      <Link to="/newly-posted" className="link-see-more">
        Xem tất cả
      </Link>
    </div>
    <div className="book-carousel">
      {newlyPosted.slice(0, 3).map((novel, index) => (
        <div
          key={novel.id}
          className={`book-cover ${index === activeSlide ? 'active' : ''}`}
        >
          <Link to={`/home/novel_detail/${novel.id}`}>
            <img src={novel.avatarNovel} alt="Avatar" width="50" />
            <div className="book-overlay"></div>
          </Link>
        </div>
      ))}
      <div className="book-details">
        <h3>
          <Link to={`/home/novel_detail/${newlyPosted[activeSlide]?.id}`}>
            {newlyPosted[activeSlide]?.nameNovel}
          </Link>
        </h3>
        <p>{newlyPosted[activeSlide]?.body}</p>
        <Link to={`/home/novel_detail/${newlyPosted[activeSlide]?.id}`} className="btn-read-now">
          Đọc ngay
        </Link>
      </div>
      <button
        className="prev-button"
        onClick={() => setActiveSlide((prevSlide) => (prevSlide - 1 + newlyPosted.length) % newlyPosted.length)}
      >
        <FaChevronLeft />
      </button>
      <button
        className="next-button"
        onClick={() => setActiveSlide((prevSlide) => (prevSlide + 1) % newlyPosted.length)}
      >
        <FaChevronRight />
      </button>
    </div>
  </div>
  <div className="newly-completed" data-aos="fade-up">
    <div className="section-header">
      <h2>Mới hoàn thành</h2>
      <Link to="/newly-completed" className="link-see-more">
        Xem tất cả
      </Link>
    </div>
    <div className="novel-grid">
      {newlyCompleted.slice(0, 6).map((novel, index) => (
        <div key={novel.id} className="novel-item" data-aos="zoom-in" data-aos-delay={index * 100}>
          <Link to={`/home/novel_detail/${novel.novel.id}`}>
            <img src={novel.avatarNovel} alt="Avatar" width="50" />
          </Link>
          <div className="novel-info">
            <h3>
              <Link to={`/home/novel_detail/${novel.novel.id}`}>{novel.nameNovel}</Link>
            </h3>
            <div className="rating">
              <FaStar />
              <span>{novel.averageRating}</span>
            </div>
            <p>{novel.body}</p>
            <div className="author">
              <FaUser />
              <span>{novel.authorName}</span>
            </div>
            <div className="genre">
              <FaBook />
              <span>{novel.categoryName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
<Footer />
</div>
);
};

export default Homepage;
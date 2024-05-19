import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaListUl } from 'react-icons/fa';
import './ReadNovel.css';
import Header from '../Part/Header/Header';
import Footer from '../Part/Footer/Footer';
import { getNovelDetail, getChaptersByNovelId, getChapterByNovelIdAndChapterId } from '../../Services/NovelService';
import { UserContext } from '../../Contexts/UserContext';

const ReadNovel = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const [novelData, setNovelData] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        // Kiểm tra nếu người dùng đã đăng nhập
        if (user.auth) {
          const data = await getNovelDetail(novelId);
          setNovelData(data);
          console.log('User:', user);
        } else {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching novel data:', error);
      }
    };

    const fetchChapterData = async () => {
      try {
        const data = await getChapterByNovelIdAndChapterId(novelId, chapterId);
        setChapterData(data);
      } catch (error) {
        console.error('Error fetching chapter data:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getChaptersByNovelId(novelId);
        setChapters(data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchNovelData();
    fetchChapterData();
    fetchChapters();
  }, [novelId, chapterId]);

  const handlePrevChapter = () => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (currentIndex > 0) {
      const prevChapterId = chapters[currentIndex - 1].id;
      navigate(`/read-novel/${novelId}/chapters/${prevChapterId}`);
    }
  };

  const handleNextChapter = () => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (currentIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentIndex + 1].id;
      navigate(`/read-novel/${novelId}/chapters/${nextChapterId}`);
    }
  };

  const getFirstChapterCreatedAt = () => {
    if (chapters && chapters.length > 0) {
      const firstChapter = chapters[0];
      return new Date(firstChapter.creatAt).toLocaleString();
    }
    return 'Unknown';
  };

  const handleChapterSelect = (selectedChapterId) => {
    navigate(`/read-novel/${novelId}/chapters/${selectedChapterId}`);
  };

  if (!novelData || !chapterData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Container className="read-novel-container">
        <Row>
          <Col>
            <div className="chapter-title">{chapterData.nameChapter}</div>
            <div className="novel-info">
              <span className="novel-name">{novelData.novel?.nameNovel || 'Unknown'}</span>
              <span className="novel-author">Tác giả: {novelData.author?.name || 'Unknown'}</span>
              <span className="novel-created-at">Ngày tạo: {getFirstChapterCreatedAt()}</span>
            </div>
            <div className="chapter-content">{chapterData.content}</div>
            <div className="chapter-navigation">
              <Button variant="primary" size="sm" onClick={handlePrevChapter} disabled={chapters.findIndex(chapter => chapter.id === chapterId) === 0}>
                <FaArrowLeft />
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="primary" size="sm">
                  <FaListUl /> Danh sách chương
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {chapters.map((chapter) => (
                    <Dropdown.Item
                      key={chapter.id}
                      onClick={() => handleChapterSelect(chapter.id)}
                      active={chapter.id === chapterId}
                    >
                      {chapter.nameChapter}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" size="sm" onClick={handleNextChapter} disabled={chapters.findIndex(chapter => chapter.id === chapterId) === chapters.length - 1}>
                <FaArrowRight />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default ReadNovel;
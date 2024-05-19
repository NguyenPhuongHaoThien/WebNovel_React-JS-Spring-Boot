import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Book, Person, Bookmark, Star, Eye, Image, FileText, Coin, Heart, HandThumbsUp } from 'react-bootstrap-icons';
import { createNovel, updateNovel } from '../../../Services/NovelService';
import { fetchAuthors } from '../../../Services/AuthorService';
import { fetchAllCategories } from '../../../Services/CategoryService';
import { toast } from 'react-toastify';

const NovelForm = ({ show, onHide, onSubmit, novel, isEditing }) => {
  const [formData, setFormData] = useState({
    nameNovel: '',
    authorId: '',
    categoryId: '',
    averageRating: '',
    view: '',
    avatarNovel: '',
    numberChapter: 0,
    ratingCount: '',
    commentCount: '',
    totalRewardAmount: '',
    favoriteCount: '',
    recommendationCount: '',
    active: true,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (novel) {
      setFormData(novel.novel);
      if (novel.novel.avatarNovel) {
        setAvatarPreview(novel.novel.avatarNovel);
      } else {
        setAvatarPreview(null);
      }
    } else {
      setFormData({
        nameNovel: '',
        authorId: '',
        categoryId: '',
        averageRating: '',
        view: '',
        avatarNovel: '',
        numberChapter: 0,
        ratingCount: '',
        commentCount: '',
        totalRewardAmount: '',
        favoriteCount: '',
        recommendationCount: '',
        active: true,
      });
      setAvatarPreview(null);
    }

    fetchAuthors().then((data) => setAuthors(data));
    fetchAllCategories().then((data) => setCategories(data));
  }, [novel]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
  
      reader.readAsDataURL(file);
    } else {
      // Nếu không có tệp mới được chọn, giữ nguyên avatarPreview cũ
      setAvatarFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('novel', JSON.stringify(formData));
      if (avatarFile) {
        formDataToSend.append('avatarFile', avatarFile);
      }
      formDataToSend.append('categoryName', formData.categoryId); // Thêm categoryName
      formDataToSend.append('authorName', formData.authorId); // Thêm authorName
  
      if (isEditing) {
        await updateNovel(formDataToSend);
      } else {
        await createNovel(formDataToSend);
      }
      onHide();
    } catch (error) {
      console.error('Error submitting user form:', error);
      console.log(error.response);
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} user: ${error.message}`);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="custom-modal" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Novel' : 'Create Novel'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNameNovel">
            <Form.Label>Tên Tiểu Thuyết:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Book />
              </InputGroup.Text>
              <FormControl
                type="text"
                name="nameNovel"
                value={formData.nameNovel}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

         
          <Form.Group controlId="formAuthorId">
            <Form.Label>Tác Giả:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
              <Form.Control
                as="select"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
              >
                <option value="">Chọn tác giả</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </Form.Control>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formCategoryId">
            <Form.Label>Danh Mục:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Bookmark />
              </InputGroup.Text>
              <Form.Control
                as="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formAverageRating">
            <Form.Label>Đánh Giá:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Star />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="averageRating"
                value={formData.averageRating}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formView">
            <Form.Label>Lượt Xem:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Eye />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="view"
                value={formData.view}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formAvatarNovel">
          <Form.Label>Ảnh Bìa:</Form.Label>
          <FormControl type="file" onChange={handleAvatarChange} />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-2"
              width="100"
            />
          )}
        </Form.Group>

          <Form.Group controlId="formNumberChapter">
            <Form.Label>Số Chương:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="numberChapter"
                value={formData.numberChapter}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formRatingCount">
            <Form.Label>Số Đánh Giá:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Star />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="ratingCount"
                value={formData.ratingCount}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formCommentCount">
            <Form.Label>Số Bình Luận:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FileText />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="commentCount"
                value={formData.commentCount}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formTotalRewardAmount">
            <Form.Label>Tổng Tiền Thưởng:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Coin />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="totalRewardAmount"
                value={formData.totalRewardAmount}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formFavoriteCount">
            <Form.Label>Lượt Yêu Thích:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <Heart />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="favoriteCount"
                value={formData.favoriteCount}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formRecommendationCount">
            <Form.Label>Lượt Đề Xuất:</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <HandThumbsUp />
              </InputGroup.Text>
              <FormControl
                type="number"
                name="recommendationCount"
                value={formData.recommendationCount}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formActive">
            <Form.Label>Trạng Thái:</Form.Label>
            <Form.Check
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              label={formData.active ? 'Active' : 'Inactive'}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NovelForm;
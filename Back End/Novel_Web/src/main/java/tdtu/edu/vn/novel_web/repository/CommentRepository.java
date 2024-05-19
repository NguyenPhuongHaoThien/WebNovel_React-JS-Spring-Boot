package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tdtu.edu.vn.novel_web.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByChapterId(String chapterId);

    List<Comment> findTop10ByOrderByCreatedAtDesc(Pageable pageable);

    List<Comment> findByNovelId(String novelId);

    @Query("{ 'id': ?0 }")
    List<Comment> findCommentsByNovelId(String novelId);
}
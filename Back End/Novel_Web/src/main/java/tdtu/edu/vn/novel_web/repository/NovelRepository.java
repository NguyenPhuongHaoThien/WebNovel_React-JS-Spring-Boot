package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tdtu.edu.vn.novel_web.model.Novel;

import java.util.List;

public interface NovelRepository extends MongoRepository<Novel, String> {
    Page<Novel> findByActive(boolean active, Pageable pageable);
    Page<Novel> findByAuthorId(String authorId, Pageable pageable);
    Page<Novel> findByCategoryId(String categoryId, Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop8ByOrderByRecommendationCountDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop10ByOrderByUpdateAtDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop10ByOrderByViewDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop10ByOrderByCommentationCountDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop10ByOrderByRecommendationCountDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop4ByOrderByAverageRatingDescRatingCountDesc(Pageable pageable);

    @Query("{ 'active': true }")
    List<Novel> findTop5ByOrderByCreateAtDesc(Pageable pageable);

    @Query("{ 'active': true, 'completed': true }")
    List<Novel> findTop6CompletedNovels(Pageable pageable);

    @Query("{ 'active': true, 'completed': true, 'chapterCount': { $gt: 5 } }")
    List<Novel> findTop10CompletedNovelsWithChapterCountGreaterThan5(Pageable pageable);

    List<Novel> findTop10ByOrderByAverageRatingDescRatingCountDesc(Pageable pageable);


    List<Novel> findByAuthorId(String authorId);

    int countByAuthorId(String id);

    List<Novel> findByActive(boolean b);





    List<Novel> findAllByOrderByUpdateAtDesc();

    List<Novel> findAllByOrderByViewDesc(Sort view);

    List<Novel> findAllByOrderByCommentCountDesc();

    List<Novel> findAllByOrderByRecommendationCountDesc();


    List<Novel> findAllByOrderByAverageRatingDescRatingCountDesc();

    List<Novel> findAllByOrderByCreateAtDesc();

    @Query("{ 'active': true, 'completed': true, 'numberChapter': { $gt: 5 } }")
    List<Novel> findAllCompletedNovelsWithChapterCountGreaterThan5(Pageable pageable);



    @Query("{ 'nameNovel': { $regex: ?0, $options: 'i' } }")
    List<Novel> findByNameNovelContainingIgnoreCase(String keyword);


    List<Novel> findAllByOrderByViewDesc();
}
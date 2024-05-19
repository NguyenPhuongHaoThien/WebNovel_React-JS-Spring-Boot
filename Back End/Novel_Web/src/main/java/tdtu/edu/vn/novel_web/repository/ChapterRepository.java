package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tdtu.edu.vn.novel_web.model.Chapter;

import java.util.List;

public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByNovelId(String novelId);
    @Query("{ 'novelId': ?0 }")
    List<Chapter> findByNovelId(String novelId, Sort sort);

    int countByNovelId(String novelId);
    List<Chapter> findByNovelIdOrderByNumberChapterAsc(String novelId);
    Chapter findFirstByNovelIdOrderByCreatAtDesc(String novelId);

    Chapter findByNovelIdAndNumberChapter(String novelId, int numberChapter);

    Chapter findByNovelIdAndId(String novelId, String chapterId);
}
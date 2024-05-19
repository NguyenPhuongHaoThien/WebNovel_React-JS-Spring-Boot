package tdtu.edu.vn.novel_web.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.novel_web.model.Chapter;
import tdtu.edu.vn.novel_web.repository.ChapterRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class ChapterService {
    private final ChapterRepository chapterRepository;

    public Chapter getChapterById(String id){
        return chapterRepository.findById(id).orElse(null);
    }

    public Chapter updateChapter(Chapter updateChapter){
        if(chapterRepository.existsById(updateChapter.getId())){
            return chapterRepository.save(updateChapter);
        }
        return null;
    }

    public Chapter createChapter(Chapter chapter){
        return chapterRepository.save(chapter);
    }


    public boolean deleteChapter(String id){
        if(chapterRepository.existsById(id)){
            chapterRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Chapter> getAllChapter() {
        return chapterRepository.findAll();
    }

    public Chapter getLastChapterByNovelId(String novelId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "numberChapter");
        List<Chapter> chapters = chapterRepository.findByNovelId(novelId, sort);
        if (!chapters.isEmpty()) {
            return chapters.get(0);
        }
        return null;
    }



    public List<Chapter> getChaptersByNovelId(String novelId) {
        return chapterRepository.findByNovelIdOrderByNumberChapterAsc(novelId);
    }

    public Chapter getChapterByNovelIdAndChapterId(String novelId, String chapterId) {
        return chapterRepository.findByNovelIdAndId(novelId, chapterId);
    }
}

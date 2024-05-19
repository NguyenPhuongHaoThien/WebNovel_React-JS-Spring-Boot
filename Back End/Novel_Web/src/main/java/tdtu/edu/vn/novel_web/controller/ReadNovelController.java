package tdtu.edu.vn.novel_web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tdtu.edu.vn.novel_web.model.Chapter;
import tdtu.edu.vn.novel_web.service.ChapterService;

import java.util.List;

@RestController
@RequestMapping("/read-novel")
public class ReadNovelController {
    private final ChapterService chapterService;

    @Autowired
    public ReadNovelController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping("/{novelId}/chapters")
    public ResponseEntity<List<Chapter>> getChaptersByNovelId(@PathVariable String novelId) {
        List<Chapter> chapters = chapterService.getChaptersByNovelId(novelId);
        return ResponseEntity.ok(chapters);
    }

    @GetMapping("/{novelId}/chapters/{chapterId}")
    public ResponseEntity<Chapter> getChapterByNovelIdAndChapterId(
            @PathVariable String novelId,
            @PathVariable String chapterId
    ) {
        Chapter chapter = chapterService.getChapterByNovelIdAndChapterId(novelId, chapterId);
        return ResponseEntity.ok(chapter);
    }
}


package tdtu.edu.vn.novel_web.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.novel_web.model.Chapter;
import tdtu.edu.vn.novel_web.model.Novel;
import tdtu.edu.vn.novel_web.model.User;
import tdtu.edu.vn.novel_web.service.ChapterService;

import java.util.List;

@RestController
@RequestMapping("/admin/chapter_management")
public class ChapterCRUDController {
    private final ChapterService chapterService;

    @Autowired
    public ChapterCRUDController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping
    public ResponseEntity<List<Chapter>> getAllChapter() {
        List<Chapter> chapters = chapterService.getAllChapter();
        if (chapters == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok(chapters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getUserById(@PathVariable String id) {
        Chapter chapter = chapterService.getChapterById(id);
        if (chapter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(chapter);
    }

    @PostMapping("/create-chapter")
    public ResponseEntity<Chapter> createUser(@RequestBody Chapter newChapter) {
        newChapter.setId(null);
        Chapter savedUser = chapterService.createChapter(newChapter);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/update-chapter") // should be PATCH method
    public ResponseEntity<Chapter> updateChapter(@RequestBody Chapter updatedChapter) {
        Chapter existingChapter = chapterService.getChapterById(updatedChapter.getId());
        if (existingChapter == null) {
            return ResponseEntity.notFound().build();
        }
        Chapter savedChapter = chapterService.updateChapter(updatedChapter);
        return ResponseEntity.ok(savedChapter);
    }


    @PostMapping("delete-chapter")
    public ResponseEntity<Chapter> deleteChapter(@RequestBody Chapter chapter) {
        Chapter existingChapter = chapterService.getChapterById(chapter.getId());
        if (existingChapter == null) {
            return ResponseEntity.notFound().build();
        }
        if (chapterService.deleteChapter(chapter.getId())) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

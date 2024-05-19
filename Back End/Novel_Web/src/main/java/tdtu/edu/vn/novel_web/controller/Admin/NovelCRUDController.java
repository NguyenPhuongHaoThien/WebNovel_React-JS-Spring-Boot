package tdtu.edu.vn.novel_web.controller.Admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.Chapter;
import tdtu.edu.vn.novel_web.model.Novel;
import tdtu.edu.vn.novel_web.service.NovelService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/novel_management")
public class NovelCRUDController {

    private final NovelService novelService;


    public NovelCRUDController(NovelService novelService) {
        this.novelService = novelService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllNovels() {
        List<Map<String, Object>> novels = novelService.getAllNovels();
        return ResponseEntity.ok(novels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Novel> getNovelById(@PathVariable String id) {
        Novel author = novelService.getNovelById(id);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }


    @PostMapping(value = "/create-novel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Novel> createNovel(@RequestParam("novel") String newNovelJson,
                                             @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
                                             @RequestParam(required = true) String categoryName,
                                             @RequestParam(required = true) String authorName) throws IOException {
        try {
            Novel newNovel = new ObjectMapper().readValue(newNovelJson, Novel.class);
            newNovel.setId(null);
            Novel savedNovel = novelService.createNovel(newNovel, avatarFile, categoryName, authorName);
            if (savedNovel == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.ok(savedNovel);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/update-novel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Novel> updateNovel(@RequestParam("novel") String updatedNovelJson,
                                             @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
                                             @RequestParam(required = true) String categoryName,
                                             @RequestParam(required = true) String authorName) throws IOException {
        try {
            Novel updatedNovel = new ObjectMapper().readValue(updatedNovelJson, Novel.class);
            Novel existingNovel = novelService.getNovelById(updatedNovel.getId());
            if (existingNovel == null) {
                return ResponseEntity.notFound().build();
            }
            Novel savedNovel = novelService.updateNovel(updatedNovel, avatarFile, categoryName, authorName);
            if (savedNovel == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.ok(savedNovel);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/delete-novel") // should DELETE method
    public ResponseEntity<Novel> deleteAuthor(@RequestBody Novel novel) {
        Novel existingAuthor = novelService.getNovelById(novel.getId());
        if (existingAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        if (novelService.deleteNovel(novel.getId())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/{novelId}/add-chapter")
    public ResponseEntity<Chapter> addChapterToNovel(@PathVariable String novelId, @RequestBody Chapter newChapter) {
        Chapter savedChapter = novelService.addChapterToNovel(novelId, newChapter);
        if (savedChapter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(savedChapter);
    }
}
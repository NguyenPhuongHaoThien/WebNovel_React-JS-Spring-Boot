package tdtu.edu.vn.novel_web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tdtu.edu.vn.novel_web.model.HistoryReading;
import tdtu.edu.vn.novel_web.model.Novel;
import tdtu.edu.vn.novel_web.service.CommentService;
import tdtu.edu.vn.novel_web.service.HistoryReadingService;
import tdtu.edu.vn.novel_web.service.NovelService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/home")
public class HomeController {
    private final NovelService novelService;
    private final HistoryReadingService historyReadingService;
    private final CommentService commentService;

    @Autowired
    public HomeController(NovelService novelService, HistoryReadingService historyReadingService, CommentService commentService) {
        this.novelService = novelService;
        this.historyReadingService = historyReadingService;
        this.commentService = commentService;
    }

    @GetMapping("/editor-picks")
    public ResponseEntity<List<Map<String, Object>>> getEditorPicks() {
        List<Map<String, Object>> editorPicks = novelService.getEditorPicks();
        return ResponseEntity.ok(editorPicks);
    }

    @GetMapping("/currently-reading")
    public ResponseEntity<List<HistoryReading>> getCurrentlyReading(@RequestParam String userId) {
        List<HistoryReading> currentlyReading = historyReadingService.getCurrentlyReading(userId);
        return ResponseEntity.ok(currentlyReading);
    }

    @GetMapping("/new-updates")
    public ResponseEntity<List<Map<String, Object>>> getNewUpdates() {
        List<Map<String, Object>> newUpdates = novelService.getNewUpdates();
        return ResponseEntity.ok(newUpdates);
    }

    @GetMapping("/most-read")
    public ResponseEntity<List<Novel>> getMostRead() {
        List<Novel> mostRead = novelService.getMostRead();
        return ResponseEntity.ok(mostRead);
    }

    @GetMapping("/most-popular")
    public ResponseEntity<List<Novel>> getMostPopular() {
        List<Novel> mostPopular = novelService.getMostPopular();
        return ResponseEntity.ok(mostPopular);
    }

    @GetMapping("/most-recommended")
    public ResponseEntity<List<Novel>> getMostRecommended() {
        List<Novel> mostRecommended = novelService.getMostRecommended();
        return ResponseEntity.ok(mostRecommended);
    }

    @GetMapping("/highly-rated")
    public ResponseEntity<List<Map<String, Object>>> getHighlyRated() {
        List<Map<String, Object>> highlyRated = novelService.getHighlyRated();
        return ResponseEntity.ok(highlyRated);
    }

    @GetMapping("/newly-reviewed")
    public ResponseEntity<List<Map<String, Object>>> getNewlyReviewed() {
        List<Map<String, Object>> newlyReviewed = commentService.getNewlyReviewed();
        return ResponseEntity.ok(newlyReviewed);
    }

    @GetMapping("/newly-posted")
    public ResponseEntity<List<Novel>> getNewlyPosted() {
        List<Novel> newlyPosted = novelService.getNewlyPosted();
        return ResponseEntity.ok(newlyPosted);
    }

    @GetMapping("/newly-completed")
    public ResponseEntity<List<Novel>> getNewlyCompleted() {
        List<Novel> newlyCompleted = novelService.getNewlyCompleted();
        return ResponseEntity.ok(newlyCompleted);
    }
}
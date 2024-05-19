package tdtu.edu.vn.novel_web.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.novel_web.model.Comment;
import tdtu.edu.vn.novel_web.service.CommentService;
import tdtu.edu.vn.novel_web.service.NovelService;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/home/novel_detail")
public class NovelDetailController {
    private final NovelService novelService;
    private final CommentService commentService;

    @Autowired
    public NovelDetailController(NovelService novelService, CommentService commentService) {
        this.novelService = novelService;
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNovelDetail(@PathVariable String id) {
        Map<String, Object> novelDetail = novelService.getNovelDetail(id);
        return ResponseEntity.ok(novelDetail);
    }

    @PostMapping("/{id}/increment-view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable String id) {
        novelService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/increment-comment-count")
    public ResponseEntity<Void> incrementCommentCount(@PathVariable String id) {
        novelService.incrementCommentCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/increment-favorite-count")
    public ResponseEntity<Void> incrementFavoriteCount(@PathVariable String id) {
        novelService.incrementFavoriteCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/increment-recommendation-count")
    public ResponseEntity<Void> incrementRecommendationCount(@PathVariable String id) {
        novelService.incrementRecommendationCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/update-rating")
    public ResponseEntity<Void> updateRating(@PathVariable String id, @RequestBody Map<String, Integer> request) {
        int score = request.get("score");
        novelService.updateRating(id, score);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> createComment(@PathVariable String id, @RequestBody Comment comment) {
        comment.setNovelId(id);
        Comment createdComment = commentService.createComment(comment);
        return ResponseEntity.ok(createdComment);
    }
}
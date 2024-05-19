package tdtu.edu.vn.novel_web.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.novel_web.model.Comment;
import tdtu.edu.vn.novel_web.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/admin/comment_management")
public class CommentCRUDController {
    private final CommentService commentService;

    @Autowired
    public CommentCRUDController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComment() {
        List<Comment> comments = commentService.getAllComment();
        if (comments == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Comment comment = commentService.getCommentById(id);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comment);
    }

    @PostMapping("/create-comment")
    public ResponseEntity<Comment> createComment(@RequestBody Comment newComment) {
        newComment.setId(null);
        Comment savedComment = commentService.createComment(newComment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    @PostMapping("/update-comment")
    public ResponseEntity<Comment> updateComment(@RequestBody Comment updatedComment) {
        Comment existingComment = commentService.getCommentById(updatedComment.getId());
        if (existingComment == null) {
            return ResponseEntity.notFound().build();
        }
        Comment savedComment = commentService.updateComment(updatedComment);
        return ResponseEntity.ok(savedComment);
    }

    @PostMapping("/delete-comment")
    public ResponseEntity<Void> deleteComment(@RequestBody Comment comment) {
        Comment existingComment = commentService.getCommentById(comment.getId());
        if (existingComment == null) {
            return ResponseEntity.notFound().build();
        }
        if (commentService.deleteComment(comment.getId())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }


}

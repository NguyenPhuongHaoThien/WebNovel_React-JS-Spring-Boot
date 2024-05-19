package tdtu.edu.vn.novel_web.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.novel_web.model.Comment;
import tdtu.edu.vn.novel_web.model.User;
import tdtu.edu.vn.novel_web.repository.CommentRepository;
import tdtu.edu.vn.novel_web.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NovelService novelService;

    public Comment getCommentById(String id){
        return commentRepository.findById(id).orElse(null);
    }

    public Comment updateComment(Comment updateComment){
        if(commentRepository.existsById(updateComment.getId())){
            return commentRepository.save(updateComment);
        }
        return null;
    }

    public Comment createComment(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        novelService.incrementCommentCount(comment.getNovelId());
        return savedComment;
    }

    public boolean deleteComment(String id){
        if(commentRepository.existsById(id)){
            commentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Comment> getAllComment() {
        return commentRepository.findAll();
    }

    public List<Map<String, Object>> getNewlyReviewed() {
        Pageable pageable = PageRequest.of(0, 10);
        List<Comment> comments = commentRepository.findTop10ByOrderByCreatedAtDesc(pageable);
        List<String> userIds = comments.stream().map(Comment::getUserId).collect(Collectors.toList());
        List<User> users = (List<User>) userRepository.findAllById(userIds);
        Map<String, String> userAvatarMap = users.stream().collect(Collectors.toMap(User::getId, User::getAvatar));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Comment comment : comments) {
            Map<String, Object> commentData = new HashMap<>();
            commentData.put("comment", comment);
            commentData.put("userAvatar", userAvatarMap.get(comment.getUserId()));
            result.add(commentData);
        }
        return result;
    }

    public List<Comment> getCommentsByNovelId(String novelId) {
        return commentRepository.findCommentsByNovelId(novelId);
    }


}
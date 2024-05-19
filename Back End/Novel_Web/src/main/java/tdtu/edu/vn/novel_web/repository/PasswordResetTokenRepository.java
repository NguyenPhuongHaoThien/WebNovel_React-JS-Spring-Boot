package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import tdtu.edu.vn.novel_web.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    PasswordResetToken findByToken(String token);
    void deleteByUserId(String userId);
}
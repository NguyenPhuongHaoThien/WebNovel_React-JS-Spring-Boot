package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import tdtu.edu.vn.novel_web.model.OTPCode;

import java.util.Date;
import java.util.List;

public interface OTPCodeRepository extends MongoRepository<OTPCode, String> {
    OTPCode findByUserId(String userId);
    void deleteByUserId(String userId);
    List<OTPCode> findByCreatedAtBefore(Date expirationTime);
}
package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import tdtu.edu.vn.novel_web.model.HistoryReading;

import java.util.List;

public interface HistoryReadingRepository extends MongoRepository<HistoryReading, String> {
    List<HistoryReading> findTop5ByUserIdOrderByIdDesc(String userId);
}
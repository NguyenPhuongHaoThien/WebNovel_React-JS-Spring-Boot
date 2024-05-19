package tdtu.edu.vn.novel_web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.novel_web.model.HistoryReading;
import tdtu.edu.vn.novel_web.repository.HistoryReadingRepository;

import java.util.List;

@Service
public class HistoryReadingService {
    private final HistoryReadingRepository historyReadingRepository;

    @Autowired
    public HistoryReadingService(HistoryReadingRepository historyReadingRepository) {
        this.historyReadingRepository = historyReadingRepository;
    }

    public List<HistoryReading> getCurrentlyReading(String userId) {
        return historyReadingRepository.findTop5ByUserIdOrderByIdDesc(userId);
    }

    // Other methods for HistoryReading
}
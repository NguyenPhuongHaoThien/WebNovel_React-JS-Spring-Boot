package tdtu.edu.vn.novel_web.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "HistoryReadings")
public class HistoryReading {
    @Id
    private String id;
    private String userId;
    private String novelId;
    private int chapterId;
}

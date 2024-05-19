package tdtu.edu.vn.novel_web.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Comments")
public class Comment {
    @Id
    private String id;
    private String userId;
    private String novelId;
    private String chapterId;
    private String content;
    private String date;
    private Date createdAt;
    private boolean active = true;
}

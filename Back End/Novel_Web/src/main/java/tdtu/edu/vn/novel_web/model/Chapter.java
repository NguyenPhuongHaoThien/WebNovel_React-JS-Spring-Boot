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
@Document(collection = "Chapters")
public class Chapter {
    @Id
    private String id;
    private String novelId;
    private String nameChapter;
    private String content;
    private int numberChapter;
    private Date creatAt;
    private Date updateAt;
}

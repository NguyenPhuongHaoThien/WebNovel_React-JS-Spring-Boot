package tdtu.edu.vn.novel_web.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Authors")
public class Author {
    @Id
    private String id;
    private String name;
    private String description;
    private String avatar;
    private String email;
    private String phone;
    private String address;
    private String facebook;
    private String twitter;
    private String instagram;
    private String youtube;
    private String website;
    private boolean active = true;
}

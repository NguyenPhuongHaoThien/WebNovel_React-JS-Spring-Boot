package tdtu.edu.vn.novel_web.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Users")
public class User implements Serializable {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String sex;
    private String role;
    private String fullName;
    private String avatar;
    private Date createDay;
    private boolean active = true;



    public User(String username, String email, String password, String confirmPassword){
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

}

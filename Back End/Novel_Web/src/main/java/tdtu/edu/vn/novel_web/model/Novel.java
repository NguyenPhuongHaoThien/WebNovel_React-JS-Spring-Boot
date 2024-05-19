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
@Document(collection = "Novels")
public class Novel {
    @Id
    private String id;
    private String nameNovel;
    private String categoryId;
    private String authorId;
    private int view;
    private String avatarNovel;
    private String body;
    private boolean active = true;
    private int numberChapter;
    private int commentCount;
    private double totalRewardAmount;
    private int favoriteCount;
    private int recommendationCount;
    private double averageRating;
    private int ratingCount;
    private Date createAt = new Date(); // Thuộc tính createAt đã được thêm
    private Date updateAt = new Date(); // Thêm thuộc tính updateAt và khởi tạo giá trị mặc định

    // Methods to update recommendation count
    public void incrementRecommendationCount() {
        this.recommendationCount++;
    }

    // Methods to update rating information
    public void updateRating(int score) {
        double totalScore = this.averageRating * this.ratingCount + score;
        this.ratingCount++;
        this.averageRating = totalScore / this.ratingCount;
    }

    // Methods to update reward amount
    public void addRewardAmount(double amount) {
        this.totalRewardAmount += amount;
    }

}
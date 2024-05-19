package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import tdtu.edu.vn.novel_web.model.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {

    Category findByName(String categoryName);
}

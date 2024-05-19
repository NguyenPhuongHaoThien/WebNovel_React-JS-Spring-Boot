package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import tdtu.edu.vn.novel_web.model.Author;

public interface AuthorRepository extends MongoRepository<Author, String> {
    Author findByName(String authorName);


}

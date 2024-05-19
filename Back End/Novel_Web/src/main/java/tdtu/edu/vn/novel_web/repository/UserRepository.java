package tdtu.edu.vn.novel_web.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tdtu.edu.vn.novel_web.model.User;
@Repository
public interface UserRepository extends MongoRepository<User, String>{
    User findByUsername(String username);

    User findByEmail(String email);

    boolean existsByUsername(String username);

}

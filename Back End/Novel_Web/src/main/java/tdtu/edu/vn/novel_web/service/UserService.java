package tdtu.edu.vn.novel_web.service;

import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.User;
import tdtu.edu.vn.novel_web.repository.UserRepository;

import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    public User getUserById(String id){
        return userRepository.findById(id).orElse(null);
    }
    public User updateUser(User updatedUser, MultipartFile avatarFile) throws IOException {
        if (userRepository.existsById(updatedUser.getId())) {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel"));
                updatedUser.setAvatar((String) uploadResult.get("url"));
            }
            return userRepository.save(updatedUser);
        }
        return null;
    }


    public void register(String username, String email, String password, String confirmPassword){
        User user = new User(username, email, password, confirmPassword);
        user.setPassword(passwordEncoder.encode(password));
        user.setConfirmPassword(passwordEncoder.encode(password));
        user.setSex("");
        user.setAvatar("");
        // Kiểm tra và xử lý trường avatar
        if (user.getAvatar() == null || user.getAvatar().length() == 0) {
            user.setAvatar(""); // Đặt giá trị mặc định nếu không có ảnh đại diện
        }
        user.setFullName("");
        user.setRole("ROLE_USER");
        user.setCreateDay(new Date());
        userRepository.save(user);

    }

    public boolean checkLogin(User user) {
        User userDb = findByEmail(user.getEmail());

        if (userDb == null) {
            return false;
        }

        System.out.println("Check login: " + user.getEmail() + " " + user.getPassword());

        return passwordEncoder.matches(user.getPassword(), userDb.getPassword());
    }

    public User findByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (UsernameNotFoundException e) {
            return null;
        }
    }

    public boolean isUserExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }


    //crud
    public User createUser(User user, MultipartFile avatarFile) throws IOException {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setConfirmPassword(passwordEncoder.encode(user.getConfirmPassword()));
        user.setRole("ROLE_USER");
        user.setCreateDay(new Date());

        if (avatarFile != null && !avatarFile.isEmpty()) {
            Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel/users"));
            user.setAvatar((String) uploadResult.get("url"));
        }

        return userRepository.save(user);
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }





}

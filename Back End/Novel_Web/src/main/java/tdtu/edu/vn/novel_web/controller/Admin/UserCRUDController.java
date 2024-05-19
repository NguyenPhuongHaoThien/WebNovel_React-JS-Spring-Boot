package tdtu.edu.vn.novel_web.controller.Admin;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.User;
import tdtu.edu.vn.novel_web.service.UserService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/user_management")
public class UserCRUDController {

    private final UserService userService;

    public UserCRUDController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUser();
        if (users == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping(value = "/create-user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> createUser(@RequestParam("user") String newUserJson, @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) throws IOException {
        try {
            User newUser = new ObjectMapper().readValue(newUserJson, User.class);
            newUser.setId(null);
            User savedUser = userService.createUser(newUser, avatarFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping(value = "/update-user-info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUser(@RequestParam("user") String updatedUserJson, @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) throws IOException {
        try {
            User updatedUser = new ObjectMapper().readValue(updatedUserJson, User.class);
            User existingUser = userService.getUserById(updatedUser.getId());
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }
            User savedUser = userService.updateUser(updatedUser, avatarFile);
            if (savedUser == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        if (userService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
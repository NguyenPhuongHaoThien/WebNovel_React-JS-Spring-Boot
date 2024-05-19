package tdtu.edu.vn.novel_web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.OTPCode;
import tdtu.edu.vn.novel_web.model.PasswordResetToken;
import tdtu.edu.vn.novel_web.model.User;
import tdtu.edu.vn.novel_web.repository.OTPCodeRepository;
import tdtu.edu.vn.novel_web.repository.PasswordResetTokenRepository;
import tdtu.edu.vn.novel_web.service.EmailService;
import tdtu.edu.vn.novel_web.service.UserService;
import tdtu.edu.vn.novel_web.util.JwtUtilsHelper;
import tdtu.edu.vn.novel_web.util.ResponseData;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    UserService userService;
    JwtUtilsHelper jwtUtilsHelper;
    OTPCodeRepository otpCodeRepository;
    EmailService emailService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    PasswordResetTokenRepository passwordResetTokenRepository;



    private String baseUrl ;

    private static final String ROLE = "ROLE_USER";
    private static final int OTP_LENGTH = 6;
    private Map<String, Map<String, Object>> resetPasswordDataMap = new ConcurrentHashMap<>();

    @Autowired
    public UserController(UserService userService,
                          JwtUtilsHelper jwtUtilsHelper,
                          OTPCodeRepository otpCodeRepository,
                          EmailService emailService,
                          BCryptPasswordEncoder passwordEncoder,
                          PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userService = userService;
        this.jwtUtilsHelper = jwtUtilsHelper;
        this.otpCodeRepository = otpCodeRepository;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder= passwordEncoder;
    }


    public String generateOTP(){
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public String generateResetPasswordLink(User user) {
        // Use the hardcoded base URL
        return baseUrl + "/reset-password?email=" + user.getEmail();
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpServletRequest request) {
        ResponseData responseData = new ResponseData();

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required fields");
        }

        if (userService.checkLogin(user)) {
            User userDb = userService.findByEmail(user.getEmail());

            String ipAddress = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");

//            // Cập nhật hoặc tạo mới lịch sử đăng nhập
//            LoginHistory loginHistory = loginHistoryRepository.findByUserId(userDb.getId());
//            if (loginHistory == null) {
//                loginHistory = new LoginHistory();
//                loginHistory.setUserId(userDb.getId());
//            }
//
//            // Kiểm tra xem địa chỉ IP đã tồn tại trong danh sách ipAddresses hay chưa
//            if (!loginHistory.getIpAddresses().contains(ipAddress)) {
//                loginHistory.getIpAddresses().add(ipAddress);
//            }
//
//            loginHistory.setLastLoginTime(new Date());
//            loginHistory.setUserAgent(userAgent);
//            loginHistoryRepository.save(loginHistory);


            // Generate OTP
            String otp = generateOTP();

            otpCodeRepository.deleteByUserId(userDb.getId());

            // Save OTP to database
            OTPCode otpCode = new OTPCode();
            otpCode.setUserId(userDb.getId());
            otpCode.setCode(otp);
            otpCode.setCreatedAt(new Date()); // Lưu thời điểm tạo mã OTP
            otpCodeRepository.save(otpCode);

            // Send OTP to user's email
            try {
                emailService.sendOTPEmail(userDb.getEmail(), otp);
                System.out.println("OTP: " + otp);
            } catch (javax.mail.MessagingException e) {
                responseData.setSuccess(false);
                responseData.setMessage("Failed to send OTP email");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
            }

            responseData.setSuccess(true);
            responseData.setMessage("OTP sent to your email. Please enter the OTP to complete the login.");
            Map<String, Object> data = new HashMap<>();
            data.put("userId", userDb.getId());
            responseData.setData(data);



            return ResponseEntity.ok(responseData);
        } else {
            responseData.setSuccess(false);
            responseData.setMessage("Invalid email or password");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseData);
        }
    }

    public void deleteExpiredOTPCodes() {
        Date oneMinuteAgo = new Date(System.currentTimeMillis() - 60000);
        List<OTPCode> expiredOTPCodes = otpCodeRepository.findByCreatedAtBefore(oneMinuteAgo);
        otpCodeRepository.deleteAll(expiredOTPCodes);
    }

    @PostMapping("/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        ResponseData responseData = new ResponseData();

        System.out.println("verifyOTP");
        System.out.println(requestBody);

        String otp = requestBody.get("otp");
        String userId = requestBody.get("userId");

        // Get the stored OTP from database
        OTPCode otpCode = otpCodeRepository.findByUserId(userId);

        if (otpCode == null || !otp.equals(otpCode.getCode())) {
            responseData.setSuccess(false);
            responseData.setMessage("Invalid OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseData);
        }

        // OTP is correct, generate JWT token
        User user = userService.getUserById(userId);
        String token = jwtUtilsHelper.generateToken(user.getEmail(), user.getRole(), user.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("id", user.getId());
        data.put("role", user.getRole());
        data.put("email", user.getEmail());
        responseData.setData(data);
        responseData.setSuccess(true);
        responseData.setMessage("Login successful");

        // Remove OTP from database
        otpCodeRepository.deleteByUserId(userId);

        return ResponseEntity.ok(responseData);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        ResponseData responseData = new ResponseData();
        String email = requestBody.get("email");

        User user = userService.findByEmail(email);
        if (user == null) {
            responseData.setSuccess(false);
            responseData.setMessage("Email not found");
            return ResponseEntity.badRequest().body(responseData);
        }

        // Generate reset password token
        String token = UUID.randomUUID().toString();

        // Delete old token for the user (if exists)
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Save new token to database
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUserId(user.getId());
        passwordResetToken.setToken(token);
        passwordResetToken.setExpiryDate(new Date(System.currentTimeMillis() + 3600000)); // 1 hour expiry
        passwordResetToken.setStatus(1); // Token created
        passwordResetTokenRepository.save(passwordResetToken);

        // Send reset password link to user's email
        String resetPasswordLink = "http://localhost:3000/reset-password?token=" + token;
        System.out.println("token: " + token);
        try {
            emailService.sendResetPasswordLinkEmail(user.getEmail(), resetPasswordLink);
            System.out.println("Reset Password Link: " + resetPasswordLink);
        } catch (MessagingException e) {
            responseData.setSuccess(false);
            responseData.setMessage("Failed to send reset password email");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
        }

        responseData.setSuccess(true);
        responseData.setMessage("Reset password link sent to your email");

        return ResponseEntity.ok(responseData);
    }
    public void sendResetPasswordOTP( User input_user, HttpServletRequest request) throws MessagingException {
        User user = userService.findByEmail(input_user.getEmail());
        if (user == null) {
            // Xử lý trường hợp email không tồn tại
            return;
        }

        String otp = generateOTP();
        emailService.sendResetPasswordOTPEmail(user.getEmail(), otp);
        System.out.println("OTP: " + otp);

        // Lưu trữ OTP và user vào cấu trúc dữ liệu tạm thời
        Map<String, Object> resetPasswordData = new HashMap<>();
        resetPasswordData.put("otp", otp);
        resetPasswordData.put("user", user);
        // Sử dụng sessionId làm khóa để lưu trữ
        String sessionId = request.getSession().getId();
        resetPasswordDataMap.put(sessionId, resetPasswordData);
    }
    @PostMapping("/verify-reset-password-token")
    public ResponseEntity<?> verifyResetPasswordToken(@RequestBody Map<String, String> requestBody) {
        ResponseData responseData = new ResponseData();

        String token = requestBody.get("token");

        // Get the password reset token from database
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);

        if (passwordResetToken == null || passwordResetToken.getExpiryDate().before(new Date()) || passwordResetToken.getStatus() != 1) {
            responseData.setSuccess(false);
            responseData.setMessage("Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseData);
        }

        // Token is valid, update status to verified
        passwordResetToken.setStatus(2);
        passwordResetTokenRepository.save(passwordResetToken);

        responseData.setSuccess(true);
        responseData.setMessage("Token verification successful");

        return ResponseEntity.ok(responseData);
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestBody) throws IOException {
        ResponseData responseData = new ResponseData();
        String token = requestBody.get("token");
        String newPassword = requestBody.get("newPassword");

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
        if (passwordResetToken == null || passwordResetToken.getExpiryDate().before(new Date()) || passwordResetToken.getStatus() != 2) {
            responseData.setSuccess(false);
            responseData.setMessage("Invalid or unverified token");
            return ResponseEntity.badRequest().body(responseData);
        }

        User user = userService.getUserById(passwordResetToken.getUserId());
        if (user == null) {
            responseData.setSuccess(false);
            responseData.setMessage("User not found");
            return ResponseEntity.badRequest().body(responseData);
        }

        // Reset password
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.updateUser(user, null);

        // Update token status to used
        passwordResetToken.setStatus(3);
        passwordResetTokenRepository.save(passwordResetToken);

        responseData.setSuccess(true);
        responseData.setMessage("Password reset successful");
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/register")
    public ResponseEntity<String> PostRegister(@RequestBody User user) {
        try {
            String username = user.getUsername();
            String email = user.getEmail();
            String password = user.getPassword();
            String confirmPassword = user.getConfirmPassword();

            if (password == null || !password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Password and confirm password not match");
            }

            if (userService.isUserExists(username) || userService.isUserExists(email)){
                return ResponseEntity.badRequest().body("Username or email already exists");
            }

            userService.register(username, email, password, confirmPassword);

            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }


    @PostMapping(value = "/update-user-info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUserInfo(@RequestParam("user") String updatedUserJson, @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) throws IOException {
        try {
            User updatedUser = new ObjectMapper().readValue(updatedUserJson, User.class);
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

}

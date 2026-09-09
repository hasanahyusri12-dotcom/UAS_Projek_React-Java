package com.bagipakai.bagigunapakai.service.implementation;

import com.bagipakai.bagigunapakai.dto.AuthResponse;
import com.bagipakai.bagigunapakai.dto.LoginRequest;
import com.bagipakai.bagigunapakai.dto.RegisterRequest;
import com.bagipakai.bagigunapakai.entity.User;
import com.bagipakai.bagigunapakai.repository.UserRepository;
import com.bagipakai.bagigunapakai.security.JwtUtil;
import com.bagipakai.bagigunapakai.service.AuthService;
import com.bagipakai.bagigunapakai.util.RegisterRequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Contoh penerapan abstract class + method overloading + @Override
        new RegisterRequestValidator().validate(request);

        // Validasi: username sudah dipakai atau belum
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username sudah digunakan");
        }

        // Validasi: email sudah dipakai atau belum (hindari error 500 dari constraint DB)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email sudah digunakan");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash password
        user.setRole("USER"); // default role saat register
        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null)
            user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Username atau password salah"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Username atau password salah");
        }

        if (user.getActive() != null && !user.getActive()) {
            throw new IllegalStateException("Akun kamu sedang dinonaktifkan");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}

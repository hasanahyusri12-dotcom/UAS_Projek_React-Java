package com.bagipakai.bagigunapakai.service;

import com.bagipakai.bagigunapakai.dto.AuthResponse;
import com.bagipakai.bagigunapakai.dto.LoginRequest;
import com.bagipakai.bagigunapakai.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
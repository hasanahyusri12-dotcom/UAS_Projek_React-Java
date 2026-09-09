package com.bagipakai.bagigunapakai.util;

import com.bagipakai.bagigunapakai.dto.RegisterRequest;

/**
 * Contoh penerapan INHERITANCE (extends) + METHOD OVERRIDING (@Override):
 * mewarisi method validateNotBlank dari AbstractValidator dan
 * meng-override method abstrak getDomainName().
 */
public class RegisterRequestValidator extends AbstractValidator {

    @Override
    public String getDomainName() {
        return "Registrasi";
    }

    public void validate(RegisterRequest request) {
        validateNotBlank(request.getUsername(), "Username");
        validateNotBlank(request.getEmail(), "Email");
        validateNotBlank(request.getPassword(), "Password");
    }
}

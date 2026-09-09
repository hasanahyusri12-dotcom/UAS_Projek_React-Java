package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.service.UserService;
import com.bagipakai.bagigunapakai.dto.ProfileRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping("/me")
    public Object me(Authentication a) {
        return service.me(a.getName());
    }

    @PutMapping("/me")
    public Object update(@RequestBody ProfileRequest r, Authentication a) {
        return service.update(a.getName(), r);
    }
}

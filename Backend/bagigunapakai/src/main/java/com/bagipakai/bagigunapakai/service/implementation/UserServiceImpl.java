package com.bagipakai.bagigunapakai.service.implementation;

import java.util.NoSuchElementException;
import com.bagipakai.bagigunapakai.service.UserService;
import com.bagipakai.bagigunapakai.entity.User;
import com.bagipakai.bagigunapakai.dto.ProfileRequest;
import com.bagipakai.bagigunapakai.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repo;

    public User me(String u) {
        return repo.findByUsername(u).orElseThrow(() -> new NoSuchElementException("User tidak ditemukan"));
    }

    public User update(String u, ProfileRequest r) {
        User x = me(u);
        if (r.getFullName() != null)
            x.setFullName(r.getFullName());
        if (r.getPhoneNumber() != null)
            x.setPhoneNumber(r.getPhoneNumber());
        if (r.getEmail() != null && !r.getEmail().equals(x.getEmail()) && repo.findByEmail(r.getEmail()).isPresent())
            throw new IllegalArgumentException("Email sudah digunakan");
        if (r.getEmail() != null)
            x.setEmail(r.getEmail());
        return repo.save(x);
    }
}

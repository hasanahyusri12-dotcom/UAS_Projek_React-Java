package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.entity.*;
import com.bagipakai.bagigunapakai.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationRepository repo;

    @GetMapping
    public List<Notification> all(Authentication a) {
        return repo.findByRecipientUsernameOrderByCreatedAtDesc(a.getName());
    }

    @GetMapping("/unread-count")
    public long unread(Authentication a) {
        return repo.countByRecipientUsernameAndReadFalse(a.getName());
    }

    @PutMapping("/{id}/read")
    public Notification read(@PathVariable Long id, Authentication a) {
        Notification n = repo.findById(id).orElseThrow();
        if (!n.getRecipient().getUsername().equals(a.getName()))
            throw new SecurityException("Akses ditolak");
        n.setRead(true);
        return repo.save(n);
    }
}

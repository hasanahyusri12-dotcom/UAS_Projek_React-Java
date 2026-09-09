package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.entity.Item;
import com.bagipakai.bagigunapakai.entity.TransactionStatus;
import com.bagipakai.bagigunapakai.entity.User;
import com.bagipakai.bagigunapakai.repository.ItemRepository;
import com.bagipakai.bagigunapakai.repository.TransactionRepository;
import com.bagipakai.bagigunapakai.repository.UserRepository;
import com.bagipakai.bagigunapakai.service.ItemService;
import com.bagipakai.bagigunapakai.service.NotificationService;          // [+] BARU

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final ItemService itemService;
    private final NotificationService notificationService;              // [+] BARU

    // =========================================================
    // ITEM PENDING
    // =========================================================

    @GetMapping("/items/pending")
    public List<Item> pendingItems() {

        return itemRepository
                .findByStatus(
                        "MENUNGGU_REVIEW",
                        PageRequest.of(0, 100)
                )
                .getContent();
    }

    // =========================================================
    // APPROVE ITEM
    // =========================================================

    private User ownerOf(Item item) {                                    // [+] BARU
        return userRepository.findByUsername(item.getOwnerUsername())
                .orElseThrow(() -> new NoSuchElementException("Pemilik tidak ditemukan"));
    }

    @PutMapping("/items/{id}/approve")
    public Item approve(@PathVariable Long id) {                         // [~] DIUBAH

        Item item = itemService.moderate(id, "TERSEDIA");

        User owner = ownerOf(item);
        notificationService.create(
                owner,
                "Barang kamu sudah disetujui ✅",
                "\"" + item.getNamaBarang() + "\" tampil di Jelajah Barang dan menerima klaim.",
                "ITEM_APPROVED",
                item.getId()
        );

        return item;
    }

    // =========================================================
    // REJECT ITEM
    // =========================================================

    @PutMapping("/items/{id}/reject")
    public Item reject(@PathVariable Long id) {                          // [~] DIUBAH

        Item item = itemService.moderate(id, "DITOLAK");

        User owner = ownerOf(item);
        notificationService.create(
                owner,
                "Barang kamu perlu direvisi",
                "\"" + item.getNamaBarang() + "\" ditolak oleh moderator. Cek info di Dashboard Saya.",
                "ITEM_REJECTED",
                item.getId()
        );

        return item;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping("/users")
    public List<User> users() {

        return userRepository.findAll();
    }

    // =========================================================
    // SUSPEND USER
    // =========================================================

    @PutMapping("/users/{id}/suspend")
    public User suspend(
            @PathVariable Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "User tidak ditemukan"
                        )
                );

        user.setActive(false);

        return userRepository.save(user);
    }

    // =========================================================
    // ACTIVATE USER
    // =========================================================

    @PutMapping("/users/{id}/activate")
    public User activate(
            @PathVariable Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "User tidak ditemukan"
                        )
                );

        user.setActive(true);

        return userRepository.save(user);
    }

    // =========================================================
    // CHANGE ROLE
    // =========================================================

    @PutMapping("/users/{id}/role")
    public User changeRole(
            @PathVariable Long id,
            @RequestParam String role) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "User tidak ditemukan"
                        )
                );

        user.setRole(role);

        return userRepository.save(user);
    }

    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        Map<String, Object> data =
                new LinkedHashMap<>();

        // Total user
        data.put(
                "totalUsers",
                userRepository.count()
        );

        // Total barang
        data.put(
                "totalItems",
                itemRepository.count()
        );

        // Barang menunggu review
        data.put(
                "pendingItems",
                itemRepository
                        .findByStatus(
                                "MENUNGGU_REVIEW",
                                PageRequest.of(0, 1)
                        )
                        .getTotalElements()
        );

        // Barang tersedia
        data.put(
                "availableItems",
                itemRepository
                        .findByStatus(
                                "TERSEDIA",
                                PageRequest.of(0, 1)
                        )
                        .getTotalElements()
        );

        // Transaksi selesai
        data.put(
                "completedTransactions",
                transactionRepository
                        .countByStatus(
                                TransactionStatus.COMPLETED
                        )
        );

        return data;
    }
}

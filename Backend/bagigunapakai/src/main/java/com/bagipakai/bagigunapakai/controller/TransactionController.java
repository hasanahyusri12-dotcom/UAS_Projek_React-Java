package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.entity.*;
import com.bagipakai.bagigunapakai.repository.*;
import com.bagipakai.bagigunapakai.service.NotificationService;          // [+] BARU
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionRepository repo;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;               // [+] BARU

    @GetMapping
    public List<Transaction> mine(Authentication a) {
        return repo.findByGiverUsernameOrReceiverUsernameOrderBySelectedAtDesc(a.getName(), a.getName());
    }

    @GetMapping("/{id}")
    public Transaction get(@PathVariable Long id, Authentication a) {
        Transaction t = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Transaksi tidak ditemukan"));
        if (!t.getGiver().getUsername().equals(a.getName()) && !t.getReceiver().getUsername().equals(a.getName()))
            throw new SecurityException("Akses ditolak");
        return t;
    }

    @PutMapping("/{id}/received")
    public Transaction received(@PathVariable Long id, Authentication a) {   // [~] DIUBAH
        Transaction t = get(id, a);
        if (!t.getReceiver().getUsername().equals(a.getName()))
            throw new SecurityException("Hanya penerima");
        t.setStatus(TransactionStatus.RECEIVED);
        t.setReceivedAt(LocalDateTime.now());
        Transaction saved = repo.save(t);

        // === [+] BARU: notif ke GIVER ===
        notificationService.create(
                t.getGiver(),
                "Penerima sudah konfirmasi barang diterima",
                "Transaksi untuk \"" + t.getItem().getNamaBarang()
                        + "\" sudah ditandai RECEIVED.",
                "TX_RECEIVED",
                saved.getId()
        );

        return saved;
    }

    @PutMapping("/{id}/confirm")
    public Transaction confirm(@PathVariable Long id, Authentication a) {   // [~] DIUBAH
        Transaction t = get(id, a);
        if (!t.getReceiver().getUsername().equals(a.getName()))
            throw new SecurityException("Hanya penerima");
        t.setStatus(TransactionStatus.COMPLETED);
        t.setConfirmedAt(LocalDateTime.now());
        Transaction saved = repo.save(t);

        // Barang dianggap selesai setelah penerima konfirmasi
        Item item = saved.getItem();
        if (item != null) {
            item.setStatus("SELESAI");
            itemRepository.save(item);
        }

        // === [+] BARU: notif ke GIVER ===
        notificationService.create(
                t.getGiver(),
                "Transaksi selesai 🤝",
                "Barang \"" + item.getNamaBarang()
                        + "\" sudah dikonfirmasi selesai oleh penerima. Terima kasih sudah berbagi!",
                "TX_COMPLETED",
                saved.getId()
        );

        return saved;
    }
}

package com.bagipakai.bagigunapakai.service.implementation;

import com.bagipakai.bagigunapakai.entity.*;
import com.bagipakai.bagigunapakai.repository.*;
import com.bagipakai.bagigunapakai.service.ClaimService;
import com.bagipakai.bagigunapakai.service.NotificationService;    // [+] BARU
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Class implementation dari interface ClaimService (menggunakan @Override).
 * Seluruh proses bisnis klaim: mengajukan, membatalkan, menerima, sampai
 * membuat transaksi & percakapan.
 */
@Service
@RequiredArgsConstructor
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claims;
    private final ItemRepository items;
    private final UserRepository users;
    private final TransactionRepository transactions;
    private final ConversationRepository conversations;
    private final NotificationService notificationService;          // [+] BARU

    @Override
    public ClaimRequest create(Long itemId, ClaimRequest dto, String username) {
        Item i = items.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Barang tidak ditemukan"));

        if (!"TERSEDIA".equals(i.getStatus()))
            throw new IllegalStateException("Barang tidak tersedia");

        if (i.getOwnerUsername().equals(username))
            throw new IllegalArgumentException("Tidak bisa mengajukan barang sendiri");

        if (claims.findByItemIdAndRequesterUsername(itemId, username).isPresent())
            throw new IllegalArgumentException("Sudah pernah mengajukan");

        User requester = users.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Pengguna tidak ditemukan"));

        ClaimRequest c = new ClaimRequest();
        c.setItem(i);
        c.setRequester(requester);
        c.setMessage(dto.getMessage());
        ClaimRequest saved = claims.save(c);

        // === [+] BARU: notifikasi untuk pemilik barang ===
        User owner = users.findByUsername(i.getOwnerUsername())
                .orElseThrow(() -> new NoSuchElementException("Pemilik barang tidak ditemukan"));
        notificationService.create(
                owner,
                "Pemohon baru untuk barangmu",
                "@" + username + " mengajukan klaim atas \"" + i.getNamaBarang()
                        + "\". Cek dan tentukan penerima.",
                "CLAIM_REQUEST",
                i.getId()
        );

        return saved;
    }

    @Override
    public List<ClaimRequest> mine(String username) {
        return claims.findByRequesterUsernameOrderByCreatedAtDesc(username);
    }

    @Override
    public List<ClaimRequest> byItem(Long itemId, String username) {
        Item i = items.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Barang tidak ditemukan"));
        if (!i.getOwnerUsername().equals(username))
            throw new SecurityException("Akses ditolak");
        return claims.findByItemIdOrderByCreatedAtDesc(itemId);
    }

    @Override
    public ClaimRequest cancel(Long id, String username) {
        ClaimRequest c = claims.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Claim tidak ditemukan"));
        if (!c.getRequester().getUsername().equals(username))
            throw new SecurityException("Akses ditolak");
        if (c.getStatus() != ClaimStatus.PENDING)
            throw new IllegalStateException("Request sudah tidak bisa dibatalkan");
        c.setStatus(ClaimStatus.CANCELLED);
        return claims.save(c);
    }

    @Override
    public Transaction accept(Long id, String username) {
        ClaimRequest chosen = claims.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Claim tidak ditemukan"));

        Item item = chosen.getItem();

        if (!item.getOwnerUsername().equals(username))
            throw new SecurityException("Hanya pemilik barang yang bisa memilih penerima");

        if (chosen.getStatus() != ClaimStatus.PENDING || !"TERSEDIA".equals(item.getStatus()))
            throw new IllegalStateException("Request tidak dapat diterima");

        // Semua permintaan lain untuk barang ini ditolak, yang dipilih diterima
        for (ClaimRequest c : claims.findByItemIdOrderByCreatedAtDesc(item.getId())) {
            if (c.getStatus() == ClaimStatus.PENDING)
                c.setStatus(c.getId().equals(id) ? ClaimStatus.ACCEPTED : ClaimStatus.REJECTED);
            c.setDecidedAt(LocalDateTime.now());
            claims.save(c);
        }

        // Barang berubah status: TERSEDIA -> DIPILIH
        item.setStatus("DIPILIH");
        items.save(item);

        User giver = users.findByUsername(item.getOwnerUsername())
                .orElseThrow(() -> new NoSuchElementException("Pengguna tidak ditemukan"));

        Transaction t = new Transaction();
        t.setItem(item);
        t.setGiver(giver);
        t.setReceiver(chosen.getRequester());
        t.setStatus(TransactionStatus.ARRANGING_PICKUP);
        Transaction saved = transactions.save(t);

        // FIX BUG: giver wajib di-set di Conversation (kolom NOT NULL di database).
        Conversation chat = new Conversation();
        chat.setItem(item);
        chat.setGiver(giver);
        chat.setReceiver(chosen.getRequester());
        conversations.save(chat);

        // === [+] BARU: notifikasi untuk pengklaim yang diterima ===
        notificationService.create(
                chosen.getRequester(),
                "Selamat! Klaim kamu diterima 🎉",
                "Pemilik barang menerima klaimmu atas \"" + item.getNamaBarang()
                        + "\". Silakan hubungi via Pesan untuk serah terima.",
                "CLAIM_ACCEPTED",
                item.getId()
        );

        // === [+] BARU: notifikasi untuk penglaim lain (yang DITOLAK) ===
        for (ClaimRequest other : claims.findByItemIdOrderByCreatedAtDesc(item.getId())) {
            if (other.getId().equals(id)) continue;
            if (other.getStatus() != ClaimStatus.REJECTED) continue;
            notificationService.create(
                    other.getRequester(),
                    "Klaim kamu belum terpilih",
                    "Untuk barang \"" + item.getNamaBarang()
                            + "\", pemilik memilih pemohon lain. Semangat barang berikutnya!",
                    "CLAIM_REJECTED",
                    item.getId()
            );
        }

        return saved;
    }
}

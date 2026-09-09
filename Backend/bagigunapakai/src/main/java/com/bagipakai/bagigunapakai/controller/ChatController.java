package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.entity.*;
import com.bagipakai.bagigunapakai.dto.MessageRequest;
import com.bagipakai.bagigunapakai.repository.*;
import com.bagipakai.bagigunapakai.service.NotificationService;          // [+] BARU
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ChatController {
    private final ConversationRepository conversations;
    private final MessageRepository messages;
    private final UserRepository users;
    private final NotificationService notificationService;               // [+] BARU

    @GetMapping
    public List<Conversation> all(Authentication a) {
        return conversations.findByGiverUsernameOrReceiverUsernameOrderByLastMessageAtDesc(a.getName(), a.getName());
    }

    @GetMapping("/{id}/messages")
    public List<Message> messages(@PathVariable Long id, Authentication a) {
        Conversation c = member(id, a);
        return messages.findByConversationIdOrderBySentAtAsc(c.getId());
    }

    @PostMapping("/{id}/messages")
    public Message send(@PathVariable Long id, @RequestBody MessageRequest r, Authentication a) {  // [~] DIUBAH
        Conversation c = member(id, a);
        if (r.getContent() == null || r.getContent().isBlank())
            throw new IllegalArgumentException("Pesan kosong");

        User sender = users.findByUsername(a.getName()).orElseThrow();
        Message m = new Message();
        m.setConversation(c);
        m.setSender(sender);
        m.setContent(r.getContent());
        c.setLastMessageAt(LocalDateTime.now());
        conversations.save(c);
        Message saved = messages.save(m);

        // === [+] BARU: pihak lain dalam conversation ===
        User recipient = c.getGiver().getUsername().equals(sender.getUsername())
                ? c.getReceiver()
                : c.getGiver();
        notificationService.create(
                recipient,
                "Pesan baru dari @" + sender.getUsername(),
                "Ada pesan baru dalam obrolan.",
                "CHAT",
                c.getId()
        );

        return saved;
    }

    private Conversation member(Long id, Authentication a) {
        Conversation c = conversations.findById(id).orElseThrow();
        if (!c.getGiver().getUsername().equals(a.getName()) && !c.getReceiver().getUsername().equals(a.getName()))
            throw new SecurityException("Akses ditolak");
        return c;
    }

    // [+] BARU: helper snippet untuk message
    private String snippet(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…";
    }
}

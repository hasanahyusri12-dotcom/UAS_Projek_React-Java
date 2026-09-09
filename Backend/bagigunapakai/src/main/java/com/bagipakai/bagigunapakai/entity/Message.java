package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Conversation conversation;
    @ManyToOne(optional = false)
    private User sender;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "is_read")
    private boolean read;
    private LocalDateTime sentAt = LocalDateTime.now();
}

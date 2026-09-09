package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Item item;
    @ManyToOne(optional = false)
    private User giver;
    @ManyToOne(optional = false)
    private User receiver;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastMessageAt = LocalDateTime.now();
}

package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    private Item item;
    @ManyToOne(optional = false)
    private User giver;
    @ManyToOne(optional = false)
    private User receiver;
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.ARRANGING_PICKUP;
    private String pickupNote;
    private LocalDateTime selectedAt = LocalDateTime.now();
    private LocalDateTime receivedAt;
    private LocalDateTime confirmedAt;
}

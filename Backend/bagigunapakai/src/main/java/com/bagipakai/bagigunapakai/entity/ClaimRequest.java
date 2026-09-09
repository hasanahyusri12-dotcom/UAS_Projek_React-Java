package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_requests", uniqueConstraints = @UniqueConstraint(columnNames = { "item_id", "requester_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaimRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private Item item;
    @ManyToOne(optional = false)
    private User requester;
    @Enumerated(EnumType.STRING)
    private ClaimStatus status = ClaimStatus.PENDING;
    @Column(columnDefinition = "TEXT")
    private String message;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime decidedAt;

    public ClaimRequest(String message) {
        this.message = message;
    }
}

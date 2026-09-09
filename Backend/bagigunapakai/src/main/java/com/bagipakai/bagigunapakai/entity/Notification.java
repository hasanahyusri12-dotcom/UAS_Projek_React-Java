package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonProperty;     // [+] BARU
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private User recipient;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String message;
    private String type;
    private Long referenceId;
    @Column(name = "is_read")
    @JsonProperty("read")                              // [+] BARU — biar FE yakin dapat key "read"
    private boolean read;
    private LocalDateTime createdAt = LocalDateTime.now();
}

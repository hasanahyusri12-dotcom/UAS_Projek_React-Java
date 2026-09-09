package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20, nullable = false)
    private String role = "USER";

    @Column(length = 100)
    private String fullName;

    @Column(length = 30)
    private String phoneNumber;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Sabuk pengaman: jamin kolom2 wajib tetap keisi walau
    // baris di-INSERT lewat raw SQL (bukan dari new User())
    @PrePersist
    public void prePersist() {
        if (this.role      == null) this.role      = "USER";
        if (this.active    == null) this.active    = Boolean.TRUE;
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }
}

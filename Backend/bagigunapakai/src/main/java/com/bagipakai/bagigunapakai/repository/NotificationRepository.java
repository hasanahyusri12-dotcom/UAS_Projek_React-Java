package com.bagipakai.bagigunapakai.repository;

import com.bagipakai.bagigunapakai.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(String u);

    long countByRecipientUsernameAndReadFalse(String u);
}

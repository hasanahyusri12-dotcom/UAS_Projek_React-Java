package com.bagipakai.bagigunapakai.repository;

import com.bagipakai.bagigunapakai.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByGiverUsernameOrReceiverUsernameOrderByLastMessageAtDesc(String g, String r);

    Optional<Conversation> findByItemIdAndReceiverUsername(Long id, String u);
}

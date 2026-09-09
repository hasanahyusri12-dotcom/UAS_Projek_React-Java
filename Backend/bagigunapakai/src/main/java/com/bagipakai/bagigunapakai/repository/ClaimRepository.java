package com.bagipakai.bagigunapakai.repository;

import com.bagipakai.bagigunapakai.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ClaimRepository extends JpaRepository<ClaimRequest, Long> {
    List<ClaimRequest> findByRequesterUsernameOrderByCreatedAtDesc(String u);

    List<ClaimRequest> findByItemIdOrderByCreatedAtDesc(Long id);

    Optional<ClaimRequest> findByItemIdAndRequesterUsername(Long id, String u);
}

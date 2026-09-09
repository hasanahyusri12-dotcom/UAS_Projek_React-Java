package com.bagipakai.bagigunapakai.repository;

import com.bagipakai.bagigunapakai.entity.Transaction;
import com.bagipakai.bagigunapakai.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByGiverUsernameOrReceiverUsernameOrderBySelectedAtDesc(String giver, String receiver);
    long countByStatus(TransactionStatus status);
}

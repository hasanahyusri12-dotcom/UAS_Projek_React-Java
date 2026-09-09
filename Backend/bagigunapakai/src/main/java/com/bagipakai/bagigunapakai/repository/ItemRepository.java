package com.bagipakai.bagigunapakai.repository;

import com.bagipakai.bagigunapakai.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ItemRepository
        extends JpaRepository<Item, Long>,
                JpaSpecificationExecutor<Item> {

    List<Item> findByOwnerUsernameOrderByIdDesc(String ownerUsername);

    Page<Item> findByStatus(String status, Pageable pageable);
}
package com.bagipakai.bagigunapakai.service;

import com.bagipakai.bagigunapakai.entity.ClaimRequest;
import com.bagipakai.bagigunapakai.entity.Transaction;

import java.util.List;

/**
 * INTERFACE (ketentuan proyek: minimal satu interface + class implementation).
 * Proses bisnis claim ditempatkan di service, bukan di controller.
 */
public interface ClaimService {

    ClaimRequest create(Long itemId, ClaimRequest dto, String username);

    List<ClaimRequest> mine(String username);

    List<ClaimRequest> byItem(Long itemId, String username);

    ClaimRequest cancel(Long id, String username);

    Transaction accept(Long id, String username);
}

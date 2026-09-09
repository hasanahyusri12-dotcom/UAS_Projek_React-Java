package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.entity.ClaimRequest;
import com.bagipakai.bagigunapakai.entity.Transaction;
import com.bagipakai.bagigunapakai.service.ClaimService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping("/items/{itemId}")
    public ClaimRequest create(@PathVariable Long itemId, @RequestBody ClaimRequest d, Authentication a) {
        return claimService.create(itemId, d, a.getName());
    }

    @GetMapping("/mine")
    public List<ClaimRequest> mine(Authentication a) {
        return claimService.mine(a.getName());
    }

    @GetMapping("/items/{itemId}")
    public List<ClaimRequest> byItem(@PathVariable Long itemId, Authentication a) {
        return claimService.byItem(itemId, a.getName());
    }

    @PutMapping("/{id}/cancel")
    public ClaimRequest cancel(@PathVariable Long id, Authentication a) {
        return claimService.cancel(id, a.getName());
    }

    @PutMapping("/{id}/accept")
    public Transaction accept(@PathVariable Long id, Authentication a) {
        return claimService.accept(id, a.getName());
    }
}

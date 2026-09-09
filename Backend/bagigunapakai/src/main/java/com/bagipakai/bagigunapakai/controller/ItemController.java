package com.bagipakai.bagigunapakai.controller;

import com.bagipakai.bagigunapakai.dto.ItemRequest;
import com.bagipakai.bagigunapakai.entity.Item;
import com.bagipakai.bagigunapakai.service.ItemService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // =========================================================
    // GET SEMUA ITEM
    // =========================================================

    @GetMapping
    public Page<Item> getItems(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String kategori,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ownerUsername,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return itemService.getItems(
                q,
                kategori,
                status,
                ownerUsername,
                sort,
                direction,
                page,
                size
        );
    }

    // =========================================================
    // GET ITEM SAYA
    // =========================================================

    @GetMapping("/mine")
    public List<Item> getMyItems(
            Authentication authentication) {

        return itemService.getMyItems(
                authentication.getName()
        );
    }

    // =========================================================
    // GET ITEM BERDASARKAN ID
    // =========================================================

    @GetMapping("/{id}")
    public Item getItemById(
            @PathVariable Long id) {

        return itemService.getById(id);
    }

    // =========================================================
    // CREATE ITEM
    // =========================================================

    @PostMapping
    public Item createItem(
            @Valid @RequestBody ItemRequest request,
            Authentication authentication) {

        return itemService.create(
                request,
                authentication.getName()
        );
    }

    // =========================================================
    // UPDATE ITEM
    // =========================================================

    @PutMapping("/{id}")
    public Item updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequest request,
            Authentication authentication) {

        return itemService.update(
                id,
                request,
                authentication.getName()
        );
    }

    // =========================================================
    // DELETE ITEM
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteItem(
            @PathVariable Long id,
            Authentication authentication) {

        itemService.delete(
                id,
                authentication.getName()
        );
    }

    // =========================================================
    // UPLOAD FOTO
    // =========================================================

    @PostMapping("/{id}/foto")
    public Item uploadFoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        return itemService.uploadPhoto(
                id,
                file,
                authentication.getName()
        );
    }
}
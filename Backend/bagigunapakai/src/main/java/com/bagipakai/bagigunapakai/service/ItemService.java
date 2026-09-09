package com.bagipakai.bagigunapakai.service;

import com.bagipakai.bagigunapakai.dto.ItemRequest;
import com.bagipakai.bagigunapakai.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ItemService {

    Page<Item> getItems(
            String keyword,
            String kategori,
            String status,
            String ownerUsername,
            String sortBy,
            String direction,
            int page,
            int size
    );

    List<Item> getMyItems(String username);

    Item getById(Long id);

    Item create(
            ItemRequest request,
            String ownerUsername
    );

    Item update(
            Long id,
            ItemRequest request,
            String ownerUsername
    );

    void delete(
            Long id,
            String ownerUsername
    );

    Item uploadPhoto(
            Long id,
            MultipartFile file,
            String ownerUsername
    ) throws IOException;

    Item moderate(
            Long id,
            String status
    );
}
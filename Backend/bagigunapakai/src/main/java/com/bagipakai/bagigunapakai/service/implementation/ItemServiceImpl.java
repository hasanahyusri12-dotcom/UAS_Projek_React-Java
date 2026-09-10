package com.bagipakai.bagigunapakai.service.implementation;

import com.bagipakai.bagigunapakai.dto.ItemRequest;
import com.bagipakai.bagigunapakai.entity.Item;
import com.bagipakai.bagigunapakai.repository.ItemRepository;
import com.bagipakai.bagigunapakai.service.ItemService;

import jakarta.persistence.criteria.Predicate;

import lombok.RequiredArgsConstructor;

import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.security.access.AccessDeniedException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final Environment environment;

    // =========================================================
    // GET ITEMS
    // =========================================================

    @Override
    public Page<Item> getItems(
            String keyword,
            String kategori,
            String status,
            String ownerUsername,
            String sortBy,
            String direction,
            int page,
            int size) {

        String safeSortBy = List.of(
                "id",
                "namaBarang",
                "kategori",
                "status"
        ).contains(sortBy)
                ? sortBy
                : "id";

        Sort sort;

        if ("asc".equalsIgnoreCase(direction)) {
            sort = Sort.by(safeSortBy).ascending();
        } else {
            sort = Sort.by(safeSortBy).descending();
        }

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(
                Math.max(size, 1),
                100
        );

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                sort
        );

        Specification<Item> specification =
                (root, query, cb) -> {

            List<Predicate> predicates =
                    new ArrayList<>();

            // SEARCH
            if (StringUtils.hasText(keyword)) {

                String like =
                        "%" + keyword.toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(
                                        cb.lower(
                                                root.get("namaBarang")
                                        ),
                                        like
                                ),

                                cb.like(
                                        cb.lower(
                                                root.get("deskripsi")
                                        ),
                                        like
                                )
                        )
                );
            }

            // FILTER KATEGORI
            if (StringUtils.hasText(kategori)) {

                predicates.add(
                        cb.equal(
                                cb.lower(
                                        root.get("kategori")
                                ),
                                kategori.toLowerCase()
                        )
                );
            }

            // FILTER STATUS
            if (StringUtils.hasText(status)) {

                predicates.add(
                        cb.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            // FILTER OWNER
            if (StringUtils.hasText(ownerUsername)) {

                predicates.add(
                        cb.equal(
                                root.get("ownerUsername"),
                                ownerUsername
                        )
                );
            }

            return cb.and(
                    predicates.toArray(
                            new Predicate[0]
                    )
            );
        };

        return itemRepository.findAll(
                specification,
                pageable
        );
    }

    // =========================================================
    // GET MY ITEMS
    // =========================================================

    @Override
    public List<Item> getMyItems(
            String username) {

        return itemRepository
                .findByOwnerUsernameOrderByIdDesc(
                        username
                );
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    public Item getById(Long id) {

        return itemRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Barang tidak ditemukan"
                        )
                );
    }

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public Item create(
            ItemRequest request,
            String ownerUsername) {

        Item item = new Item();

        item.setNamaBarang(
                request.getNamaBarang()
        );

        item.setDeskripsi(
                request.getDeskripsi()
        );

        item.setKategori(
                request.getKategori()
        );

        item.setLokasi(
                request.getLokasi()
        );

        item.setOwnerUsername(
                ownerUsername
        );

        // Barang baru menunggu review
        item.setStatus(
                "MENUNGGU_REVIEW"
        );

        return itemRepository.save(item);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public Item update(
            Long id,
            ItemRequest request,
            String ownerUsername) {

        Item item = getById(id);

        verifyOwner(
                item,
                ownerUsername
        );

        if ("SELESAI".equals(item.getStatus())) {

            throw new IllegalStateException(
                    "Barang selesai tidak bisa diubah"
            );
        }

        item.setNamaBarang(
                request.getNamaBarang()
        );

        item.setDeskripsi(
                request.getDeskripsi()
        );

        item.setKategori(
                request.getKategori()
        );

        item.setLokasi(
                request.getLokasi()
        );

        // Kalau barang sebelumnya ditolak,
        // masuk review lagi
        if ("DITOLAK".equals(item.getStatus())) {

            item.setStatus(
                    "MENUNGGU_REVIEW"
            );
        }

        return itemRepository.save(item);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void delete(
            Long id,
            String ownerUsername) {

        Item item = getById(id);

        verifyOwner(
                item,
                ownerUsername
        );

        itemRepository.delete(item);
    }

    // =========================================================
    // UPLOAD PHOTO
    // =========================================================

    @Override
    public Item uploadPhoto(
            Long id,
            MultipartFile file,
            String ownerUsername)
            throws IOException {

        Item item = getById(id);

        verifyOwner(
                item,
                ownerUsername
        );

        if (file == null ||
                file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File foto tidak boleh kosong"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "File harus berupa gambar"
            );
        }

        String uploadDir =
                environment.getProperty(
                        "app.upload.dir",
                        "uploads/items"
                );

        Path uploadPath =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize();

        Files.createDirectories(
                uploadPath
        );

        String originalName =
                file.getOriginalFilename();

        if (originalName == null ||
                originalName.isBlank()) {

            originalName = "image.jpg";
        }

        String extension = ".jpg";

        int dotIndex =
                originalName.lastIndexOf('.');

        if (dotIndex >= 0) {

            extension =
                    originalName.substring(
                            dotIndex
                    );
        }

        String newFilename =
                "item-"
                + id
                + "-"
                + UUID.randomUUID()
                + extension;

        Path filePath =
                uploadPath.resolve(
                        newFilename
                );

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

item.setFotoUrl(
        "/uploads/items/" + newFilename
);
        return itemRepository.save(item);
    }

    // =========================================================
    // MODERATE
    // =========================================================

    @Override
    public Item moderate(
            Long id,
            String status) {

        Item item = getById(id);

        if (!"TERSEDIA".equals(status) &&
                !"DITOLAK".equals(status)) {

            throw new IllegalArgumentException(
                    "Status moderasi hanya TERSEDIA atau DITOLAK"
            );
        }

        item.setStatus(status);

        return itemRepository.save(item);
    }

    // =========================================================
    // VERIFY OWNER
    // =========================================================

    private void verifyOwner(
            Item item,
            String ownerUsername) {

        if (item.getOwnerUsername() == null ||
                !item.getOwnerUsername()
                        .equals(ownerUsername)) {

            throw new AccessDeniedException(
                    "Kamu bukan pemilik barang ini"
            );
        }
    }
}
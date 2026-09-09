package com.bagipakai.bagigunapakai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {

    @NotBlank(message = "Nama barang tidak boleh kosong")
    private String namaBarang;

    @NotBlank(message = "Deskripsi tidak boleh kosong")
    private String deskripsi;

    @NotBlank(message = "Kategori tidak boleh kosong")
    private String kategori;

    @NotBlank(message = "Lokasi tidak boleh kosong")
    private String lokasi;

    private String status; // tidak wajib, karena diisi otomatis saat create
}
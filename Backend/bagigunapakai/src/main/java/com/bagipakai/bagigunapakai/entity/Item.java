package com.bagipakai.bagigunapakai.entity;

import jakarta.persistence.*;

/**
 * CLASS UTAMA yang merepresentasikan data aplikasi (ketentuan OOP):
 * - attribute menggunakan access modifier PRIVATE (encapsulation)
 * - getter dan setter public
 * - constructor (no-arg + constructor berparameter, memakai keyword this)
 * - merupakan ENTITY JPA (@Entity, @Table, @Id, @GeneratedValue)
 */
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String namaBarang;

    private String deskripsi;

    private String kategori;

    private String lokasi;

    private String fotoUrl;

    private String status;

    private String ownerUsername;

    // Constructor no-arg (dibutuhkan JPA / Jackson)
    public Item() {
    }

    // Constructor berparameter (memakai keyword this)
    public Item(Long id, String namaBarang, String deskripsi, String kategori,
                String lokasi, String fotoUrl, String status, String ownerUsername) {
        this.id = id;
        this.namaBarang = namaBarang;
        this.deskripsi = deskripsi;
        this.kategori = kategori;
        this.lokasi = lokasi;
        this.fotoUrl = fotoUrl;
        this.status = status;
        this.ownerUsername = ownerUsername;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNamaBarang() {
        return namaBarang;
    }

    public void setNamaBarang(String namaBarang) {
        this.namaBarang = namaBarang;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public String getLokasi() {
        return lokasi;
    }

    public void setLokasi(String lokasi) {
        this.lokasi = lokasi;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }
}

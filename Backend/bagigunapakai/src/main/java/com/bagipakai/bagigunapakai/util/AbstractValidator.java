package com.bagipakai.bagigunapakai.util;

/** *
 * Abstract class = class yang tidak bisa di-instantiate langsung,
 * berisi method konkret yang diwarisi oleh subclass, plus satu method abstrak
 * yang wajib di-override oleh subclass (@Override).
 *
 * Method overloading = nama method sama (validateNotBlank) tetapi
 * parameter berbeda (1 parameter vs 2 parameter).
 */
public abstract class AbstractValidator {

    // Method overloading #1: 1 parameter
    protected final void validateNotBlank(String value) {
        validateNotBlank(value, "Field");
    }

    // Method overloading #2: 2 parameter (nilai + nama field untuk pesan error)
    protected final void validateNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " tidak boleh kosong");
        }
    }

    // Method abstrak: wajib diimplementasikan (di-override) oleh subclass
    public abstract String getDomainName();
}

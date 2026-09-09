package com.bagipakai.bagigunapakai.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionUpdateRequest {
    @Size(max = 1000, message = "Catatan maksimal 1000 karakter")
    private String pickupNote;
}

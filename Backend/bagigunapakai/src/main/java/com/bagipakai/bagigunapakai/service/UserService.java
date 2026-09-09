package com.bagipakai.bagigunapakai.service;

import com.bagipakai.bagigunapakai.entity.User;
import com.bagipakai.bagigunapakai.dto.ProfileRequest;

public interface UserService {
    User me(String username);

    User update(String username, ProfileRequest r);
}

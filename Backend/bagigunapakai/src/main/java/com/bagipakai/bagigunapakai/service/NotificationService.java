package com.bagipakai.bagigunapakai.service;

import com.bagipakai.bagigunapakai.entity.Notification;
import com.bagipakai.bagigunapakai.entity.User;

public interface NotificationService {
    Notification create(User recipient, String title, String message, String type, Long referenceId);
}

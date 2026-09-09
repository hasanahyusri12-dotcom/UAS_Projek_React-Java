package com.bagipakai.bagigunapakai.service.implementation;

import com.bagipakai.bagigunapakai.entity.Notification;
import com.bagipakai.bagigunapakai.entity.User;
import com.bagipakai.bagigunapakai.repository.NotificationRepository;
import com.bagipakai.bagigunapakai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification create(User recipient, String title, String message, String type, Long referenceId) {
        if (recipient == null)                              // [+] BARU — null guard
            throw new IllegalArgumentException("Recipient wajib diisi");

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }
}

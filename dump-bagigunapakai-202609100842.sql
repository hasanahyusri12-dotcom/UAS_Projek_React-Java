-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: bagigunapakai
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `claim_requests`
--

DROP TABLE IF EXISTS `claim_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claim_requests` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `decided_at` datetime(6) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('ACCEPTED','CANCELLED','PENDING','REJECTED') DEFAULT NULL,
  `item_id` bigint(20) NOT NULL,
  `requester_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8hol4srqihflmtyjt5v1jc5s5` (`item_id`,`requester_id`),
  KEY `FKkgh8hee1ff2bg0cm94n02j1fj` (`requester_id`),
  CONSTRAINT `FK4n0609h5wpcjoxjx4a1xdf2q9` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `FKkgh8hee1ff2bg0cm94n02j1fj` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `claim_requests`
--

LOCK TABLES `claim_requests` WRITE;
/*!40000 ALTER TABLE `claim_requests` DISABLE KEYS */;
INSERT INTO `claim_requests` VALUES (1,'2026-09-03 13:23:22.000000','2026-09-03 13:28:05.000000','Saya berminat, bisa ambil besok sore?','ACCEPTED',2,4),(2,'2026-09-06 00:45:00.000000','2026-09-06 00:51:29.000000','hallo mas saya butuh barang ini untuk kantor baru saya semoga masih bisa di pakai','REJECTED',1,2),(3,'2026-09-06 00:49:59.000000','2026-09-06 00:51:29.000000','hallo kebetulan saya baru buka usaha sangat membutuhkan meja kerja kalau kak berkenan saya mau ambil meja kaka','ACCEPTED',1,3);
/*!40000 ALTER TABLE `claim_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  `giver_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp9l5q0v2t8a5o5axxhrlqqb0w` (`giver_id`),
  KEY `FKqb8tegie17jcwh02q5aj1x3ys` (`item_id`),
  KEY `FKfs4apdd01nmuvo9mfag6ycwml` (`receiver_id`),
  CONSTRAINT `FKfs4apdd01nmuvo9mfag6ycwml` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKp9l5q0v2t8a5o5axxhrlqqb0w` FOREIGN KEY (`giver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqb8tegie17jcwh02q5aj1x3ys` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
INSERT INTO `conversation` VALUES (1,'2026-09-03 13:28:05.000000','2026-09-04 17:16:34.000000',3,2,4),(2,'2026-09-05 14:42:47.000000','2026-09-05 22:58:06.000000',1,1,6),(3,'2026-09-05 14:43:36.000000','2026-09-05 14:43:36.000000',3,2,6),(4,'2026-09-06 00:42:05.000000','2026-09-09 00:10:54.000000',1,1,2),(5,'2026-09-06 00:51:29.000000','2026-09-06 01:05:46.000000',1,1,3);
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `deskripsi` varchar(255) DEFAULT NULL,
  `kategori` varchar(255) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `owner_username` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Meja kayu jati, kondisi bagus','Furniture','Jakarta Barat','Meja Kantor','Hasbalah17','SELESAI',NULL),(2,'Kondisi bagus','Furniture','Jakarta Timur','Rak buku kayu','Albian','SELESAI',NULL),(3,'[Kondisi: 90% Seperti Baru]\n\nini masih bagus kok kalau ada yang mau bisa hubungi ajah\n\n[Catatan Penjemputan Privat untuk Penerima: asrama baru putri]','Rumah Tangga','bandung,sukaraja,dakota,cicendo • [Ambil di Tempat (COD)]','Kipas Angin','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-3-110303b0-f703-47c8-b36e-901de9ba323b.jpg'),(4,'[Kondisi: 90% Seperti Baru]\n\nIni baru apke sekali buat pindahan doang tapi karna di kosan penuh jadi kalau ada yang mau hubungin ajah yah\n\n[Catatan Penjemputan Privat untuk Penerima: margondah]','Rumah Tangga','depok • [Ambil di Tempat (COD)]','Container','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-4-7a7b71c2-4906-47f3-8e8a-ca4b04fe8062.jpeg'),(5,'[Kondisi: 90% Seperti Baru]\n\naku punya 2 jadi satunya mau aku kasih ke yang mau\n\n[Catatan Penjemputan Privat untuk Penerima: jl.ahmad dahlan]','Fashion','Kebayoran • [Keduanya (COD / Ekspedisi)]','Meja Setrika','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-5-24d1de6a-1531-4a8f-9d8e-510978f8f3b8.jpeg'),(6,'[Kondisi: 90% Seperti Baru]\n\nItu barang punya mantan aku jadi mau aku kasih ajah ke yang mau\n\n[Catatan Penjemputan Privat untuk Penerima: Alun-alun Cimalaka]','Rumah Tangga','Cimalaka, sumedang • [Keduanya (COD / Ekspedisi)]','Mesin Coffe','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-6-d9e7187e-ed7a-42c9-8df7-22217ae0288f.jpeg'),(7,'[Kondisi: 90% Seperti Baru]\n\nmasih bagus pemakaian 2 tahun\n\n[Catatan Penjemputan Privat untuk Penerima: Jatinangor (jatos)]','Rumah Tangga','Cimarias, pamulihan, sumedang • [Keduanya (COD / Ekspedisi)]','Blender paket 3','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-7-465a1084-d7c8-45f2-ac19-afc9e38018a5.jpeg'),(8,'[Kondisi: 90% Seperti Baru]\n\nKursinya baru di pake 3 bulan tapi mau aku ganti soalnya kegedean di rumah\n\n[Catatan Penjemputan Privat untuk Penerima: Depan Mesjid agung Tanjungsari]','Rumah Tangga','Sukasari, Tanjungsari, Sumedang • [Keduanya (COD / Ekspedisi)]','Sopa','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-8-1c513bdc-08c5-47ad-a86c-c517db9d9a0c.jpeg'),(9,'[Kondisi: 90% Seperti Baru]\n\nini kaos bahanya dingin , ukuranya oversize\n\n[Catatan Penjemputan Privat untuk Penerima: Pinggir toko baju Balerina Cikarang]','Fashion','Cikarang, • [Keduanya (COD / Ekspedisi)]','baju kaos oversize','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-9-3d6c7669-d85a-4399-bd56-d4dedad61560.jpeg'),(10,'[Kondisi: 90% Seperti Baru]\n\nWarna coklat Pemakaian 2 bulan\n\n[Catatan Penjemputan Privat untuk Penerima: Jl.Mentor no 1]','Fashion','Cicendo, Sukaraja • [Keduanya (COD / Ekspedisi)]','Tas Balenana','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-10-a4d2d4b7-d2f7-495b-819d-aff70b8e5388.jpeg'),(11,'[Kondisi: 90% Seperti Baru]\n\nAku udah baca Bukunya Bagus semoga bermnfaat juga\n\n[Catatan Penjemputan Privat untuk Penerima: Mall Botanica]','Buku','Dakota, Pasteur • [Keduanya (COD / Ekspedisi)]','Buku Referensi','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-11-e8e5c685-478c-4967-946c-0ab984e9e0ac.jpeg'),(12,'[Kondisi: 90% Seperti Baru]\n\nAku udah bosen bacanya udah hampir 3 kali heheh kalo ada yang minat japri ajah\n\n[Catatan Penjemputan Privat untuk Penerima: Di stasiun Kereta Ciminta]','Fashion','Cimindi • [Keduanya (COD / Ekspedisi)]','Novel hope it will be','Hasbalah17','MENUNGGU_REVIEW','/uploads/items/item-12-fbaa7738-1841-45d7-a46b-836fa7e8c7f6.jpeg');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `conversation_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6yskk3hxw5sklwgi25y6d5u1l` (`conversation_id`),
  KEY `FKbi5avhe69aol2mb1lnm6r4o2p` (`sender_id`),
  CONSTRAINT `FK6yskk3hxw5sklwgi25y6d5u1l` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  CONSTRAINT `FKbi5avhe69aol2mb1lnm6r4o2p` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'Halo, kapan bisa diambil?',_binary '\0','2026-09-03 13:34:19.000000',1,3),(2,'bisanya kapan ka?',_binary '\0','2026-09-04 17:16:34.000000',1,4),(3,'hallo mas , selamat siang boleh saya tau tentang barang yang mas upload?',_binary '\0','2026-09-05 14:43:17.000000',2,6),(4,'p',_binary '\0','2026-09-05 22:57:16.000000',2,6),(5,'iyah kak ada apa?',_binary '\0','2026-09-05 22:58:06.000000',2,1),(6,'haloo mas',_binary '\0','2026-09-06 00:42:20.000000',4,2),(7,'hallo kak ada yang bisa saya bantu?',_binary '\0','2026-09-06 00:43:08.000000',4,1),(8,'Lokasi sudah sesuai ya kak?',_binary '\0','2026-09-06 00:51:59.000000',5,1),(9,'iya kak lokasi sesuai titik yang saya kasih',_binary '\0','2026-09-06 01:04:46.000000',5,3),(10,'kalaua gitu saya cek dulu yah alamatnya',_binary '\0','2026-09-06 01:05:46.000000',5,1),(11,'maaf',_binary '\0','2026-09-06 01:36:49.000000',4,1),(12,'malam sarah..',_binary '\0','2026-09-09 00:10:54.000000',4,1);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `reference_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `recipient_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfcyn9rsga73dqnorl7owfyl4a` (`recipient_id`),
  CONSTRAINT `FKfcyn9rsga73dqnorl7owfyl4a` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'2026-09-06 01:36:50.000000','maaf',_binary '',4,'Pesan baru dari @Hasbalah17','CHAT',2),(2,'2026-09-09 00:10:54.000000','malam sarah..',_binary '',4,'Pesan baru dari @Hasbalah17','CHAT',2);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `confirmed_at` datetime(6) DEFAULT NULL,
  `pickup_note` varchar(255) DEFAULT NULL,
  `received_at` datetime(6) DEFAULT NULL,
  `selected_at` datetime(6) DEFAULT NULL,
  `status` enum('ARRANGING_PICKUP','CANCELLED','COMPLETED','DISPUTED','ON_DELIVERY','RECEIVED') DEFAULT NULL,
  `giver_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeyfurpfol3p35gs4c8wlgaqo5` (`item_id`),
  KEY `FKi9ytcmhcs4yaov1rmdxgw66k1` (`giver_id`),
  KEY `FK5nn8ird7idyxyxki68gox2wbx` (`receiver_id`),
  CONSTRAINT `FK5nn8ird7idyxyxki68gox2wbx` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKi9ytcmhcs4yaov1rmdxgw66k1` FOREIGN KEY (`giver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKq9uhpbfe5lk2mc79uwsk2ng83` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'2026-09-03 13:31:39.000000',NULL,'2026-09-03 13:30:47.000000','2026-09-03 13:28:05.000000','COMPLETED',3,2,4),(2,'2026-09-06 01:06:36.000000',NULL,'2026-09-06 01:06:32.000000','2026-09-06 00:51:29.000000','COMPLETED',1,1,3);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hasbalah1702@mail.com','$2a$10$7PdFgDZl.gNdX3s.Q1lpnOBU4fzdSt7oXlRw3EBXwHAHG61V4PuR.','ADMIN','Hasbalah17',_binary '','2026-09-06 00:06:17.000000','Hasbalah17',NULL),(2,'sarah@mail.com','$2a$10$pGVR29X0E7B7ZlKUNtbu/uIZ999BDTekVuY4CtFIFAlfD.OOSP/0S','USER','sarah22',_binary '','2026-09-06 00:06:17.000000','sarah22','0822256789'),(3,'albianmaulana@email.com','$2a$10$yQP06riy9rTvIQIPz0VFOeX/An27yuyq/KsxUxmQDKk6W6FI4yxc.','USER','Albian',_binary '','2026-09-03 01:28:12.000000','Albian Maulana','081234567890'),(4,'alukard123@mail.com','$2a$10$J3xeLd2LN1y0Ay5T4Mh0Fu9XoxhwuZuCi0VnUFfmKdINPR4yefMg2','USER','Alukard',_binary '','2026-09-03 13:11:15.000000','Alukard',NULL),(5,'warga@bagipakai.id','$2a$10$HsVboSGkUcr.v5pl3cISDucB7nukCeRu.QJYGAIvjExA6W3K1j1c2','USER','wargabaik',_binary '','2026-09-04 17:10:34.000000','wargabaik',NULL),(6,'kauki@gmail.com','$2a$10$o18yoNuyy.VUMF5t/KmXEuUsLuDhYSKTMXxgJZH6IgeTaVDLxxoLC','USER','kukikauki',_binary '','2026-09-05 01:26:17.000000','kukikauki',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bagigunapakai'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10  8:42:44

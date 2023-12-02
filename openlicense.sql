CREATE DATABASE  IF NOT EXISTS `soenproj-users` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `soenproj-users`;
-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: soenproj-server.mysql.database.azure.com    Database: soenproj-users
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `clientlicenses`
--

DROP TABLE IF EXISTS `clientlicenses`;
/*!50001 DROP VIEW IF EXISTS `clientlicenses`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `clientlicenses` AS SELECT 
 1 AS `license_key`,
 1 AS `softwareId`,
 1 AS `status`,
 1 AS `activationDate`,
 1 AS `expiryDate`,
 1 AS `userID`,
 1 AS `softwareName`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `licensekeys`
--

DROP TABLE IF EXISTS `licensekeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licensekeys` (
  `license_key` varchar(32) NOT NULL,
  `softwareId` int DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  `creationDate` date DEFAULT NULL,
  `activationDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `userID` int DEFAULT NULL,
  PRIMARY KEY (`license_key`),
  UNIQUE KEY `OneKeyPerUserPerSoftware` (`softwareId`,`userID`),
  KEY `userID` (`userID`),
  CONSTRAINT `licensekeys_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`user_id`),
  CONSTRAINT `licensekeys_ibfk_2` FOREIGN KEY (`softwareId`) REFERENCES `software` (`software_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `provider_users_view`
--

DROP TABLE IF EXISTS `provider_users_view`;
/*!50001 DROP VIEW IF EXISTS `provider_users_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `provider_users_view` AS SELECT 
 1 AS `user_id`,
 1 AS `firstName`,
 1 AS `lastName`,
 1 AS `email_address`,
 1 AS `phone_number`,
 1 AS `status`,
 1 AS `provider_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `software`
--

DROP TABLE IF EXISTS `software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `software` (
  `software_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `version_number` varchar(16) DEFAULT NULL,
  `executable_link` varchar(32) DEFAULT NULL,
  `icon_url` varchar(32) DEFAULT NULL,
  `price` float(10,2) DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  PRIMARY KEY (`software_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `software_licensekeys_view`
--

DROP TABLE IF EXISTS `software_licensekeys_view`;
/*!50001 DROP VIEW IF EXISTS `software_licensekeys_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `software_licensekeys_view` AS SELECT 
 1 AS `license_key`,
 1 AS `status`,
 1 AS `creationDate`,
 1 AS `activationDate`,
 1 AS `expiryDate`,
 1 AS `user_id`,
 1 AS `software_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `software_users_view`
--

DROP TABLE IF EXISTS `software_users_view`;
/*!50001 DROP VIEW IF EXISTS `software_users_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `software_users_view` AS SELECT 
 1 AS `user_id`,
 1 AS `firstName`,
 1 AS `lastName`,
 1 AS `email_address`,
 1 AS `phone_number`,
 1 AS `status`,
 1 AS `software_id`,
 1 AS `provider_id`,
 1 AS `license_key`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email_address` varchar(64) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('provider','client') NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `customer_notes` text,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `clientlicenses`
--

/*!50001 DROP VIEW IF EXISTS `clientlicenses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`soenproj`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `clientlicenses` AS select `licensekeys`.`license_key` AS `license_key`,`licensekeys`.`softwareId` AS `softwareId`,`licensekeys`.`status` AS `status`,`licensekeys`.`activationDate` AS `activationDate`,`licensekeys`.`expiryDate` AS `expiryDate`,`licensekeys`.`userID` AS `userID`,`software`.`name` AS `softwareName` from (`licensekeys` left join `software` on((`licensekeys`.`softwareId` = `software`.`software_id`))) where (`licensekeys`.`status` = 'active') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `provider_users_view`
--

/*!50001 DROP VIEW IF EXISTS `provider_users_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`soenproj`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `provider_users_view` AS select `u`.`user_id` AS `user_id`,`u`.`firstName` AS `firstName`,`u`.`lastName` AS `lastName`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`status` AS `status`,`s`.`provider_id` AS `provider_id` from ((`users` `u` join `licensekeys` `lk` on((`u`.`user_id` = `lk`.`userID`))) join `software` `s` on((`lk`.`softwareId` = `s`.`software_id`))) group by `u`.`user_id`,`s`.`provider_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `software_licensekeys_view`
--

/*!50001 DROP VIEW IF EXISTS `software_licensekeys_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`soenproj`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `software_licensekeys_view` AS select `lk`.`license_key` AS `license_key`,`lk`.`status` AS `status`,`lk`.`creationDate` AS `creationDate`,`lk`.`activationDate` AS `activationDate`,`lk`.`expiryDate` AS `expiryDate`,`u`.`user_id` AS `user_id`,`s`.`software_id` AS `software_id` from ((`licensekeys` `lk` join `users` `u` on((`u`.`user_id` = `lk`.`userID`))) join `software` `s` on((`lk`.`softwareId` = `s`.`software_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `software_users_view`
--

/*!50001 DROP VIEW IF EXISTS `software_users_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`soenproj`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `software_users_view` AS select `u`.`user_id` AS `user_id`,`u`.`firstName` AS `firstName`,`u`.`lastName` AS `lastName`,`u`.`email_address` AS `email_address`,`u`.`phone_number` AS `phone_number`,`u`.`status` AS `status`,`s`.`software_id` AS `software_id`,`s`.`provider_id` AS `provider_id`,`lk`.`license_key` AS `license_key` from ((`users` `u` join `licensekeys` `lk` on((`u`.`user_id` = `lk`.`userID`))) join `software` `s` on((`lk`.`softwareId` = `s`.`software_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-01 23:02:57

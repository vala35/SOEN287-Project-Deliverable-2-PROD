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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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


CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `soenproj`@`%` 
    SQL SECURITY DEFINER
VIEW `clientlicenses` AS
    SELECT 
        `licensekeys`.`license_key` AS `license_key`,
        `licensekeys`.`softwareId` AS `softwareId`,
        `licensekeys`.`status` AS `status`,
        `licensekeys`.`activationDate` AS `activationDate`,
        `licensekeys`.`expiryDate` AS `expiryDate`,
        `licensekeys`.`userID` AS `userID`,
        `software`.`name` AS `softwareName`
    FROM
        (`licensekeys`
        LEFT JOIN `software` ON ((`licensekeys`.`softwareId` = `software`.`software_id`)))
    WHERE
        (`licensekeys`.`status` = 'active')

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `soenproj`@`%` 
    SQL SECURITY DEFINER
VIEW `provider_users_view` AS
    SELECT 
        `u`.`user_id` AS `user_id`,
        `u`.`firstName` AS `firstName`,
        `u`.`lastName` AS `lastName`,
        `u`.`email_address` AS `email_address`,
        `u`.`phone_number` AS `phone_number`,
        `u`.`status` AS `status`,
        `s`.`provider_id` AS `provider_id`
    FROM
        ((`users` `u`
        JOIN `licensekeys` `lk` ON ((`u`.`user_id` = `lk`.`userID`)))
        JOIN `software` `s` ON ((`lk`.`softwareId` = `s`.`software_id`)))
    GROUP BY `u`.`user_id` , `s`.`provider_id`


CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `soenproj`@`%` 
    SQL SECURITY DEFINER
VIEW `software_licensekeys_view` AS
    SELECT 
        `lk`.`license_key` AS `license_key`,
        `lk`.`status` AS `status`,
        `lk`.`creationDate` AS `creationDate`,
        `lk`.`activationDate` AS `activationDate`,
        `lk`.`expiryDate` AS `expiryDate`,
        `u`.`user_id` AS `user_id`,
        `s`.`software_id` AS `software_id`
    FROM
        ((`licensekeys` `lk`
        JOIN `users` `u` ON ((`u`.`user_id` = `lk`.`userID`)))
        JOIN `software` `s` ON ((`lk`.`softwareId` = `s`.`software_id`)))


CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `soenproj`@`%` 
    SQL SECURITY DEFINER
VIEW `software_users_view` AS
    SELECT 
        `u`.`user_id` AS `user_id`,
        `u`.`firstName` AS `firstName`,
        `u`.`lastName` AS `lastName`,
        `u`.`email_address` AS `email_address`,
        `u`.`phone_number` AS `phone_number`,
        `u`.`status` AS `status`,
        `s`.`software_id` AS `software_id`,
        `s`.`provider_id` AS `provider_id`,
        `lk`.`license_key` AS `license_key`
    FROM
        ((`users` `u`
        JOIN `licensekeys` `lk` ON ((`u`.`user_id` = `lk`.`userID`)))
        JOIN `software` `s` ON ((`lk`.`softwareId` = `s`.`software_id`)))
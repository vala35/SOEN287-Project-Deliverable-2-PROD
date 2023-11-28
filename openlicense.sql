/* Start of table structure setup */

CREATE TABLE Software(
	software_id int NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,
	status varchar(32),
	version_number varchar(16),
	executable_link varchar(32),
	icon_url varchar(32),
	price FLOAT(10, 2),
	
	PRIMARY KEY(software_id)
);

CREATE TABLE Users(
	user_id int NOT NULL AUTO_INCREMENT,
	firstName varchar(255) NOT NULL,
	lastName varchar(255) NOT NULL,
	email_address varchar(64),
	phone_number varchar(16),
	address varchar(100),
	password_hash varchar(255) NOT NULL,
	user_type ENUM('provider','client') NOT NULL,
	status varchar(32),
	customer_notes TEXT,
	
	PRIMARY KEY(user_id)
);

CREATE TABLE LicenseKeys(
	license_key varchar(32),
	softwareId int NULL,
	status varchar(32),
	creationDate DATE,
	activationDate DATE,
	expiryDate DATE,
	userID int NULL,
	
	PRIMARY KEY(license_key),
	FOREIGN KEY(userId) REFERENCES Users(user_id),
	FOREIGN KEY(softwareId) REFERENCES Software(software_id),
	
	CONSTRAINT OneKeyPerUserPerSoftware UNIQUE(softwareId, userID)
	
);



CREATE VIEW software_users_view AS
	SELECT u.user_id, u.firstName, u.lastName, u.email_address, u.phone_number
		FROM Users u
	JOIN LicenseKeys lk ON u.user_id = lk.userID
	JOIN Software s ON lk.softwareId = s.software_id;



/* End of table structure setup */



/* Start of sample data insertion */

INSERT INTO Users (user_id, firstName, lastName, email_address, phone_number, password_hash, status, customer_notes) VALUES
(1, 'Paul', 'Hatz', 'paul@hatz.dev', '123456789', 'gg', 'active', NULL),
(2, 'John', 'Smith', 'john@hatz.dev', '1234560000', 'gg', 'active', NULL),
(3, 'Bruce', 'Smith', 'bruce@hatz.dev', '5559920', 'glgrepl;kfe', 'active', NULL);


INSERT INTO Software (software_id, name, status, version_number, executable_link, price) VALUES
(1, 'Allure', 'active', '1.0.0', '/assets/download.exe', 14.99),
(2, 'Cronos', 'active', '1.0.1', 'hh.exe', 10.99),
(3, 'Accel', 'active', '1.5.6', 'e.exe', 99.99);


INSERT INTO LicenseKeys (license_key, softwareId, status, creationDate, activationDate, expiryDate, userID) VALUES
('12345-ABCDE-67890-FGHIJ', 1, 'active', '2023-11-23', NULL, '2023-11-30', 1),
('12345-KLMNO-67890-FGHIJ', 2, NULL, NULL, NULL, NULL, 1),
('VWXYZ-KLMNO-67890-FGHIJ', 1, NULL, NULL, NULL, NULL, 3);


/* End of sample data insertion */


SELECT * FROM software_users_view 
	WHERE software_id = x

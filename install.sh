
mysqladmin -u ol_root -p "tenwSoSVbq11y5fN*" create openlicense

mysql 'CREATE DATABASE openlicense; USE openlicense; SOURCE openlicense.sql;'



CREATE USER 'ol_root'@'localhost' IDENTIFIED BY 'tenwSoSVbq11y5fN*';
GRANT ALL PRIVILEGES ON openlicense.* TO 'ol_root'@'localhost';


ALTER USER 'ol_root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';








ALTER USER 'ol_root'@'localhost' IDENTIFIED BY 'tenwSoSVbq11y5fN*'; 
ALTER USER 'ol_root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tenwSoSVbq11y5fN*';

FLUSH PRIVILEGES;


ALTER USER 'ol_root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'tenwSoSVbq11y5fN*';
FLUSH PRIVILEGES;


ALTER USER 'ol_root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'tenwSoSVbq11y5fN*';

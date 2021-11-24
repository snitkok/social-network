DROP TABLE IF EXISTS password_reset_codes;

 CREATE TABLE password_reset_codes(
     id SERIAL PRIMARY KEY,
     code VARCHAR(255) NOT NULL CHECK (code != ''), 
     email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
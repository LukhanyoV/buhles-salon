-- Add insert scripts here
-- data for treatments
INSERT INTO treatment (type, code, price) VALUES ('Pedicure', 'PED', 175.00); 
INSERT INTO treatment (type, code, price) VALUES ('Manicure', 'MAN', 215.00); 
INSERT INTO treatment (type, code, price) VALUES ('Make up', 'MAK', 185.00); 
INSERT INTO treatment (type, code, price) VALUES ('Brows & Lashes', 'BAL', 240.00);

-- data for clients 
INSERT INTO client (first_name, last_name, phone_number) 
VALUES 
('Lukhanyo', 'Vakele', '0787858920')
, ('Emihle', 'Vakele', '0715354455')
, ('Zeenat', 'Avontuur', '0712345678')
, ('Phumza', 'Kose', '0635249875')
, ('Nonkululeko', 'Nooi', '0845267412')
, ('Fanie', 'Johnson', '0725876479')
, ('Andre', 'Vermeulen', '073669985');

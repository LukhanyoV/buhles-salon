-- Table create scripts here4
CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE treatment  (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    code VARCHAR(3) NOT NULL,
    price DECIMAL NOT NULL
);

CREATE TABLE stylist (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    commission_percentage NUMERIC (3,2)
);

CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    client_id INTEGER NOT NULL,
    treatment_id INTEGER NOT NULL,
    stylist_id INTEGER NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (treatment_id) REFERENCES treatment(id),
    FOREIGN KEY (stylist_id) REFERENCES stylist(id)
);
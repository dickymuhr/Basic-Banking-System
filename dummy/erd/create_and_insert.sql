-- Drop table if exist
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    account_type VARCHAR(255) NOT NULL,
    debit_card_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(account_id),
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT
);

-- Insert dummy data
INSERT INTO customers (fullname, address, email, phone_number)
VALUES 
    ('Budi Santoso', 'Jl. Merdeka No.1, Jakarta', 'budi.santoso@example.com', '081234567890'),
    ('Siti Nurhaliza', 'Jl. Raya Bogor Km. 26, Jakarta', 'siti.nurhaliza@example.com', '081345678901'),
    ('Agus Pranoto', 'Jl. Diponegoro No.99, Surabaya', 'agus.pranoto@example.com', '081456789012'),
    ('Ratna Sari Dewi', 'Jl. Sudirman No.45, Bandung', 'ratna.sari@example.com', '081567890123'),
    ('I Made Wirawan', 'Jl. Raya Ubud, Bali', 'i.made.wirawan@example.com', '081678901234');

INSERT INTO accounts (customer_id, account_type, debit_card_number)
VALUES 
    (1, 'Checking', '1234-5678-9012-3456'),
    (2, 'Savings', '2345-6789-0123-4567'),
    (3, 'Checking', '3456-7890-1234-5678'),
    (4, 'Savings', '4567-8901-2345-6789'),
    (5, 'Checking', '5678-9012-3456-7890');

INSERT INTO transactions (account_id, transaction_date, amount, description)
VALUES 
    (1, '2023-10-01', 1000000.00, 'Deposit'),
    (1, '2023-10-02', -250000.00, 'Withdrawal'),
    (2, '2023-10-01', 2000000.00, 'Deposit'),
    (2, '2023-10-03', -300000.00, 'Withdrawal'),
    (3, '2023-10-04', 1500000.00, 'Deposit'),
    (4, '2023-10-05', 1750000.00, 'Deposit'),
    (5, '2023-10-06', -200000.00, 'Withdrawal');

-- Query table
SELECT * FROM customers;
SELECT * FROM accounts;
SELECT * FROM transactions;
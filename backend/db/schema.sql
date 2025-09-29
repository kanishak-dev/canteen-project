-- This script will completely reset the database and set up initial data.

-- Drop existing tables in reverse order of dependency to avoid errors
DROP TABLE IF EXISTS OrderLineItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS MenuItems;
DROP TABLE IF EXISTS Users;

-- Create Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create MenuItems Table
CREATE TABLE MenuItems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "machineId" INT,
    "clientName" VARCHAR(255),
    "clientPhone" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderLineItems Table
CREATE TABLE OrderLineItems (
    id SERIAL PRIMARY KEY,
    "orderId" INT REFERENCES Orders(id) ON DELETE CASCADE,
    "menuItemId" INT REFERENCES MenuItems(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

---
--- INSERT INITIAL DATA
---

-- IMPORTANT: Replace the password hash below with the one you generate.
INSERT INTO Users (name, email, password, role) VALUES 
('Canteen Owner', 'owner@canteen.com', 'PASTE_YOUR_BCRYPT_HASH_HERE', 'owner');

-- Insert initial menu items
INSERT INTO MenuItems (name, price, stock) VALUES 
('Samosa', 20.00, 50),
('Coffee', 25.00, 100),
('Sandwich', 40.00, 30);

-- Notify that the script is complete
\echo 'Database schema created and initial data inserted successfully.'
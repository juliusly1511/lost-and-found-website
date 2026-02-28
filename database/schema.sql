CREATE DATABASE lost_and_found;

\c lost_and_found;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    location VARCHAR(255),
    date_lost_or_found DATE,
    item_type VARCHAR(10) CHECK (item_type IN ('lost', 'found')),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims table
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    claimant_id INTEGER REFERENCES users(id),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_items_type_status ON items(item_type, status);
CREATE INDEX idx_items_user ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
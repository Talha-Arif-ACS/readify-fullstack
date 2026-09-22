-- Readify Database Schema for Neon (PostgreSQL) - Student 1 (Catalog & Help)

CREATE TABLE readify.users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readify.newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readify.book_reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL, -- Note: This relates to the books table
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    review_body TEXT NOT NULL,
    would_recommend VARCHAR(50) CHECK (would_recommend IN ('Absolutely yes!', 'Yes, with conditions', 'Not sure', 'Probably not')),
    found_page_turner BOOLEAN DEFAULT FALSE,
    found_emotional BOOLEAN DEFAULT FALSE,
    found_insightful BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readify.selling_books (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES readify.users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    book_condition VARCHAR(100),
    proposed_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    admin_notes TEXT
);

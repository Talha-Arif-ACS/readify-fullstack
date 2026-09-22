-- =========================================================================
-- Readify Database Schema for Neon (PostgreSQL)
-- This file contains all tables for the entire team, allowing you to 
-- paste it into the Neon SQL Editor at once.
-- =========================================================================

-- Safely drop the schema and all its contents if it exists, then recreate it.
DROP SCHEMA IF EXISTS readify CASCADE;
CREATE SCHEMA IF NOT EXISTS readify;

-- ==========================================
-- STUDENT 1 TABLES (Hamid Hussaini)
-- ==========================================

CREATE TABLE IF NOT EXISTS readify.users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readify.newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readify.support_tickets (
    ticket_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readify.selling_books (
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

-- ==========================================
-- STUDENT 2 TABLES (Shahadat Hossain)
-- ==========================================

CREATE TABLE IF NOT EXISTS readify.books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    format VARCHAR(50) CHECK (format IN ('physical', 'ebook', 'audio')),
    cover_url VARCHAR(255),
    audio_url VARCHAR(255),
    rating DECIMAL(3, 2),
    genre VARCHAR(100),
    stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS readify.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES readify.users(user_id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readify.order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES readify.orders(order_id) ON DELETE CASCADE,
    book_id INT REFERENCES readify.books(book_id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS readify.wishlists (
    user_id INT REFERENCES readify.users(user_id) ON DELETE CASCADE,
    book_id INT REFERENCES readify.books(book_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id)
);

-- ==========================================
-- STUDENT 3 TABLES (Talha Arif)
-- ==========================================

CREATE TABLE IF NOT EXISTS readify.stores (
    store_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    hours VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS readify.reading_clubs (
    club_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    meeting_time VARCHAR(100) NOT NULL,
    store_id INT REFERENCES readify.stores(store_id) ON DELETE SET NULL,
    current_book_id INT REFERENCES readify.books(book_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS readify.club_memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES readify.users(user_id) ON DELETE CASCADE,
    club_id INT REFERENCES readify.reading_clubs(club_id) ON DELETE CASCADE,
    user_notes TEXT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, club_id)
);

-- =========================================================================
-- INITIAL DATA POPULATION (INSERTS)
-- Based on the existing Readify Front-end
-- =========================================================================

-- Insert test users
INSERT INTO readify.users (first_name, last_name, email, password_hash) VALUES
('Jane', 'Reader', 'jane@example.com', 'hashed_pw_placeholder_1'),
('John', 'Bookworm', 'john@example.com', 'hashed_pw_placeholder_2');

-- Insert Stores
INSERT INTO readify.stores (store_id, name, address, city, phone_number, hours) VALUES
(1, 'Readify Brussels', 'Rue Neuve 100', 'Brussels', '+32 2 123 45 67', 'Mon - Sat 09:00 - 19:00'),
(2, 'Readify Antwerpen', 'Meir 50', 'Antwerpen', '+32 3 987 65 43', 'Mon - Sat 10:00 - 18:00'),
(3, 'Readify Gent', 'Veldstraat 12', 'Gent', '+32 9 456 12 34', 'Mon - Sat 09:30 - 18:30');

-- Reset Store ID sequence
SELECT setval('readify.stores_store_id_seq', (SELECT MAX(store_id) FROM readify.stores));

-- Insert Books (Extracted comprehensively from UI Pages)
INSERT INTO readify.books (book_id, title, author, isbn, description, price, format, cover_url, rating, genre, stock) VALUES
-- Physical Books from Catalog Page (id 1-27)
(1, 'The Diary of a Young Girl', 'Anne Frank', '9780553296983', 'Physical book from Catalog', 12.99, 'physical', 'image/b1.jpeg', 4.8, 'Biography', 20),
(2, 'The Library of Intertwined Selves', 'James Thomson', '9781234567897', 'Physical book from Catalog', 14.99, 'physical', 'image/b2.jpeg', 4.5, 'Fiction', 15),
(3, 'Steve Jobs', 'Walter Isaacson', '9781451648539', 'Physical book from Catalog', 18.20, 'physical', 'image/b3.jpeg', 4.7, 'Biography', 10),
(4, 'The Story of My Experiments with Truth', 'Mahatma Gandhi', '9780807059098', 'Physical book from Catalog', 11.99, 'physical', 'image/b4.jpeg', 4.6, 'Biography', 30),
(5, 'Leonardo da Vinci', 'Walter Isaacson', '9781501139154', 'Physical book from Catalog', 20.00, 'physical', 'image/b5.jpeg', 4.9, 'Biography', 25),
(6, 'I Know Why the Caged Bird Sings', 'Maya Angelou', '9780345514400', 'Physical book from Catalog', 13.99, 'physical', 'image/b6.jpeg', 4.8, 'Biography', 50),
(7, 'Sapiens', 'Yuval Noah Harari', '9780062316097', 'Physical book from Catalog', 20.00, 'physical', 'image/b7.jpeg', 4.9, 'History', 25),
(8, 'A Brief History of Time', 'Stephen Hawking', '9780553380163', 'Physical book from Catalog', 15.99, 'physical', 'image/b8.jpeg', 4.8, 'Science', 20),
(9, 'The Republic', 'Plato', '9780140455113', 'Physical book from Catalog', 10.50, 'physical', 'image/b9.jpeg', 4.5, 'Philosophy', 15),
(10, 'Guns, Germs, and Steel', 'Jared Diamond', '9780393354324', 'Physical book from Catalog', 18.20, 'physical', 'image/b10.jpeg', 4.7, 'History', 10),
(11, 'Meditations', 'Marcus Aurelius', '9780140449334', 'Physical book from Catalog', 8.99, 'physical', 'image/b11.jpeg', 4.6, 'Philosophy', 30),
(12, 'The Art of War', 'Sun Tzu', '9781590302255', 'Physical book from Catalog', 10.99, 'physical', 'image/b12.jpeg', 4.8, 'Philosophy', 40),
(13, 'On the Origin of Species', 'Charles Darwin', '9780451529060', 'Physical book from Catalog', 12.99, 'physical', 'image/b13.jpeg', 4.7, 'Science', 45),
(14, 'Pride and Prejudice', 'Jane Austen', '9780141439518', 'Physical book from Catalog', 12.50, 'physical', 'image/b14.jpeg', 4.7, 'Romance', 50),
(15, 'The Key', 'John Orwell', '9789876543210', 'Physical book from Catalog', 14.50, 'physical', 'image/b15.jpeg', 4.2, 'Mystery', 12),
(16, 'The Silken', 'Scott Roberts', '9781230984567', 'Physical book from Catalog', 13.50, 'physical', 'image/b16.jpeg', 4.3, 'Fiction', 18),
(17, 'Frankenstein', 'Mary Shelley', '9780486282114', 'Physical book from Catalog', 9.99, 'physical', 'image/b17.jpeg', 4.6, 'Horror', 30),
(18, 'Jane Eyre', 'Charlotte Brontë', '9780141441146', 'Physical book from Catalog', 11.99, 'physical', 'image/b18.jpeg', 4.7, 'Romance', 35),
(19, 'Wuthering Heights', 'Emily Brontë', '9780141439556', 'Physical book from Catalog', 10.99, 'physical', 'image/b19.jpeg', 4.5, 'Romance', 40),
(20, 'Animal Farm', 'George Orwell', '9780451526342', 'Physical book from Catalog', 8.99, 'physical', 'image/b20.jpeg', 4.8, 'Fiction', 50),
(21, 'The Uncharted Life', 'Evelyn Reed', '9781112223334', 'Physical book from Catalog', 15.00, 'physical', 'image/b21.jpeg', 4.4, 'Biography', 15),
(22, 'Crime and Punishment', 'Fyodor Dostoevsky', '9780140449136', 'Physical book from Catalog', 14.50, 'physical', 'image/b22.jpeg', 4.8, 'Classic', 25),
(23, 'Don Quixote', 'Miguel de Cervantes', '9780142437230', 'Physical book from Catalog', 16.50, 'physical', 'image/b23.jpeg', 4.7, 'Classic', 20),
(24, 'Beloved', 'Toni Morrison', '9781400033416', 'Physical book from Catalog', 13.99, 'physical', 'image/b24.jpeg', 4.9, 'Fiction', 30),
(25, 'One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', 'Physical book from Catalog', 15.99, 'physical', 'image/b25.jpeg', 4.8, 'Fiction', 35),
(26, 'The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 'Physical book from Catalog', 10.99, 'physical', 'image/b26.jpeg', 4.5, 'Fiction', 40),
(27, 'Middlemarch', 'George Eliot', '9780141439549', 'Physical book from Catalog', 12.99, 'physical', 'image/b27.jpeg', 4.6, 'Classic', 20),

-- eBooks from eBooks Page (id 28-37)
(28, 'The Picture of Dorian Gray', 'Oscar Wilde', '9780141439570', 'Philosophical novel', 7.99, 'ebook', 'student2/image/book1.jpeg', 4.6, 'Classic', 100),
(29, 'Siddhartha', 'Hermann Hesse', '9780553208849', 'Journey of self-discovery', 12.00, 'ebook', 'student2/image/book2.jpeg', 4.7, 'Fiction', 100),
(30, 'Anna Karenina', 'Leo Tolstoy', '9780143035008', 'Tragic Russian novel', 14.50, 'ebook', 'student2/image/book3.jpeg', 4.5, 'Classic', 100),
(31, 'Emma', 'Jane Austen', '9780141439587', 'Romantic comedy', 9.99, 'ebook', 'student2/image/book4.jpeg', 4.4, 'Romance', 100),
(32, 'Frankenstein', 'Mary Shelley', '9780486282114', 'Gothic classic', 10.00, 'ebook', 'student2/image/book5.jpeg', 4.6, 'Horror', 100),
(33, 'The Art of War', 'Sun Tzu', '9781590302255', 'Ancient military treatise', 8.99, 'ebook', 'student2/image/book6.jpeg', 4.8, 'Philosophy', 100),
(34, 'The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', '9780553212419', 'Detectives mysteries', 11.99, 'ebook', 'student2/image/book7.jpeg', 4.8, 'Mystery', 100),
(35, 'The Metamorphosis', 'Franz Kafka', '9780553213690', 'Existential exploration', 6.99, 'ebook', 'student2/image/book8.jpeg', 4.5, 'Fiction', 100),
(36, 'The Republic', 'Plato', '9780140455113', 'Philosophical dialogue', 10.50, 'ebook', 'student2/image/book9.jpeg', 4.5, 'Philosophy', 100),
(37, 'Moby-Dick', 'Herman Melville', '9780142437247', 'Epic tale of obsession', 13.99, 'ebook', 'student2/image/book10.jpeg', 4.4, 'Classic', 100),

-- Audio Books from Audiobooks Page (id 38-47)
(38, 'Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romantic fiction', 19.99, 'audio', 'student2/image/abook1.jpeg', 4.7, 'Romance', 100),
(39, 'Alice''s Adventures in Wonderland', 'Lewis Carroll', '9780141439761', 'Whimsical fantasy', 25.00, 'audio', 'student2/image/abook2.jpeg', 4.8, 'Fantasy', 100),
(40, 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Story of the jazz age', 9.99, 'audio', 'student2/image/abook3.jpeg', 4.6, 'Classic', 100),
(41, 'A Tale of Two Cities', 'Charles Dickens', '9780141439600', 'Drama of sacrifice', 14.99, 'audio', 'student2/image/abook4.jpeg', 4.5, 'Historical Fiction', 100),
(42, 'Heart of Darkness', 'Joseph Conrad', '9780141441672', 'Colonial Africa voyage', 29.99, 'audio', 'student2/image/abook5.jpeg', 4.3, 'Classic', 100),
(43, 'The Time Machine', 'H.G. Wells', '9780451530707', 'Sci-fi adventure', 35.00, 'audio', 'student2/image/abook6.jpeg', 4.6, 'Sci-Fi', 100),
(44, 'The Secret Garden', 'Frances Hodgson Burnett', '9780141321066', 'Healing and friendship', 23.00, 'audio', 'student2/image/abook7.jpeg', 4.7, 'Children''s', 100),
(45, 'Grimms'' Fairy Tales', 'Brothers Grimm', '9780140446494', 'Timeless stories of magic', 24.99, 'audio', 'student2/image/abook8.jpeg', 4.5, 'Fairy Tales', 100),
(46, 'Frankenstein', 'Mary Shelley', '9780486282114', 'Gothic classic', 31.50, 'audio', 'student2/image/abook9.jpeg', 4.6, 'Horror', 100),
(47, 'Siddhartha', 'Hermann Hesse', '9780553208849', 'Journey of self-discovery', 12.00, 'audio', 'student2/image/abook10.jpeg', 4.7, 'Fiction', 100);

-- Reset Book ID sequence
SELECT setval('readify.books_book_id_seq', (SELECT MAX(book_id) FROM readify.books));

-- Insert Reading Clubs
-- Links proper store_id and current_book_id
INSERT INTO readify.reading_clubs (name, genre, meeting_time, store_id, current_book_id) VALUES
('Fantasy Club', 'Fantasy', 'Tuesday at 18:00', 1, 39), -- Reads Alice's Adventures in Wonderland
('Mystery Club', 'Mystery', 'Thursday at 19:00', 2, 34), -- Reads The Adventures of Sherlock Holmes
('Sci-Fi Club', 'Sci-Fi', 'Saturday at 16:00', 3, 43), -- Reads The Time Machine
('Non-Fiction Club', 'Non-Fiction', 'Friday at 18:30', 1, 7); -- Reads Sapiens

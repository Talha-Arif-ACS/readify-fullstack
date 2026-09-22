-- Readify Database Schema - Student 3 (Shops & Reading Clubs)

CREATE TABLE IF NOT EXISTS reading_clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    meeting_day VARCHAR(20) NOT NULL,
    meeting_time VARCHAR(20) NOT NULL,
    meeting_place VARCHAR(150) NOT NULL,
    description TEXT
);

INSERT INTO reading_clubs (name, genre, meeting_day, meeting_time, meeting_place, description) VALUES
('Mystery Club', 'Mystery', 'Monday', '18:00', 'Brussels - Floor 2', 'We dive deep into whodunits and crime fiction.'),
('Fantasy Club', 'Fantasy', 'Wednesday', '17:30', 'Antwerp - Reading Lounge', 'From Tolkien to Sanderson, all fantasy welcome.'),
('Sci-Fi Club', 'Science Fiction', 'Thursday', '19:00', 'Ghent - Room A', 'Exploring the futures imagined by the greatest sci-fi authors.'),
('Romance Readers', 'Romance', 'Tuesday', '16:00', 'Brussels - Floor 1', 'Celebrating love stories across all subgenres.'),
('Classic Lit Circle', 'Classic', 'Friday', '18:30', 'Antwerp - Reading Lounge', 'Revisiting the timeless works of literary history.'),
('Thriller Squad', 'Thriller', 'Saturday', '11:00', 'Ghent - Room B', 'For readers who like their pages unputdownable.');

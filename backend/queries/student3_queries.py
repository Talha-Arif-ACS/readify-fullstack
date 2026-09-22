get_all_clubs_query = "SELECT id, name, genre, meeting_day, meeting_time, meeting_place, description FROM reading_clubs;"

get_clubs_by_genre_query = "SELECT id, name, genre, meeting_day, meeting_time, meeting_place, description FROM reading_clubs WHERE genre ILIKE %s;"

insert_club_query = "INSERT INTO reading_clubs (name, genre, meeting_day, meeting_time, meeting_place, description) VALUES (%s, %s, %s, %s, %s, %s);"
from fastapi import APIRouter
import database
from queries import student3_queries as queries
from models import student3_models as models

router = APIRouter()

@router.get("/reading-clubs")
def get_all_clubs():
    results = database.execute_sql_query(queries.get_all_clubs_query)
    return {"reading_clubs": results}

@router.get("/reading-clubs/filter")
def get_clubs_by_genre(genre: str):
    results = database.execute_sql_query(queries.get_clubs_by_genre_query, (genre,))
    return {"reading_clubs": results}

@router.post("/reading-clubs")
def add_club(club: models.ReadingClub):
    database.execute_sql_query(queries.insert_club_query, (
        club.name, club.genre, club.meeting_day,
        club.meeting_time, club.meeting_place, club.description
    ))
    return club
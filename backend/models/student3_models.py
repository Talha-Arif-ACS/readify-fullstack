from pydantic import BaseModel
from typing import Optional

class ReadingClub(BaseModel):
    name: str
    genre: str
    meeting_day: str
    meeting_time: str
    meeting_place: str
    description: Optional[str] = None
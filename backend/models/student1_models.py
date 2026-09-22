from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# for post 1
class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password_hash: str
    created_at: Optional[datetime] = None

# for post 2
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# for post 3
class SellingBook(BaseModel):
    user_id: int
    title: str
    author: str
    isbn: str
    book_condition: Optional[str] = None
    proposed_price: Optional[float] = None
    cover_url: str
    description: str
    status: Optional[str] = 'pending'
    created_at: Optional[datetime] = None

# for post 4
class NewsletterSubscriber(BaseModel):
    email: EmailStr
    subscribed_at: Optional[datetime] = None

# haven't used in JS
class BookReview(BaseModel):
    book_id: int
    name: str
    email: EmailStr
    review_body: str
    would_recommend: str
    found_page_turner: bool = False
    found_emotional: bool = False
    found_insightful: bool = False
    created_at: Optional[datetime] = None


from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Data model representing the inventory details for a specific book
class Book(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    description: Optional[str] = None
    price: float
    format: Optional[str] = None
    cover_url: Optional[str] = None
    audio_url: Optional[str] = None
    rating: Optional[float] = None
    genre: Optional[str] = None
    stock: Optional[int] = 0


# Schema for tracking high-level order information and transaction status
# to match the DB schema — the orders table has no NOT NULL on user_id
class Order(BaseModel):
    user_id: Optional[int] = None
    total_amount: float
    status: Optional[str] = 'pending'
    created_at: Optional[datetime] = None


# Represents individual line items within an order to link books and quantities
class OrderItem(BaseModel):
    order_id: Optional[int] = None
    book_id: Optional[int] = None
    quantity: int = 1
    unit_price: float


# Manages the relationship between users and books they intend to purchase later
class Wishlist(BaseModel):
    user_id: int
    book_id: int
    added_at: Optional[datetime] = None


# Review model for the new student2 review endpoints (Part 3)
# Writes to the existing readify.book_reviews table — no new table needed
# would_recommend maps from star rating: 5★ → "Absolutely yes!" … 1★ → "Probably not"
class Review(BaseModel):
    book_id: int
    name: str
    email: EmailStr
    review_body: str
    would_recommend: str  # "Absolutely yes!" | "Yes, with conditions" | "Not sure" | "Probably not"
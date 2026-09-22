from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import execute_sql_query
import queries.student2_queries as queries
import models.student2_models as models

router = APIRouter()


# ── GET ENDPOINTS ─────────────────────────────────────────────────

@router.get("/books")
def get_all_books(
    format: Optional[str] = Query(
        default=None,
        description="Filter books by format. Accepted values: 'ebook', 'audio', 'physical'. "
                    "Example: GET /student2/books?format=ebook"
    )
):
    """
    Returns all books, optionally filtered by the 'format' query parameter.

    """
    if format:
        results = execute_sql_query(queries.get_books_by_format_query, (format,))
        msg = f"Successfully retrieved all books with format '{format}'."
    else:
        results = execute_sql_query(queries.get_all_books_query)
        msg = "Successfully retrieved all books."

    if results:
        return {"books": results, "message": msg}
    # return {"books": [], "message": f"No books found{f\" with format '{format}'\" if format else ''}."}
    return {"books": [], "message": f"No books found{f' with format {format}' if format else ''}."}


@router.get("/books/{book_id}")
def get_book_by_id(book_id: int):
    """Returns a single book by its ID (path parameter)."""
    results = execute_sql_query(queries.get_book_by_id_query, (book_id,))
    if results:
        return {"book": results[0], "message": f"Successfully retrieved book with ID {book_id}."}
    else:
        raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found!")


@router.get("/wishlists/{user_id}")
def get_wishlist(user_id: int):
    """Returns all wishlist items for a given user."""
    results = execute_sql_query(queries.get_wishlist_query, (user_id,))
    if results is not None:
        return {"wishlist": results, "message": f"Successfully retrieved wishlist for user {user_id}."}
    else:
        raise HTTPException(status_code=404, detail="Wishlist not found!")


@router.get("/orders/{user_id}")
def get_orders(user_id: int):
    """Returns all orders placed by a given user."""
    results = execute_sql_query(queries.get_orders_by_user_query, (user_id,))
    if results is not None:
        return {"orders": results, "message": f"Successfully retrieved orders for user {user_id}."}
    else:
        raise HTTPException(status_code=404, detail="Orders not found!")


@router.get("/reviews/{book_id}")
def get_reviews(book_id: int):
    """
    Returns the 5 most recent reviews for a given book.
    Reads from the shared readify.book_reviews table.
    Part 3 — GET 3 requirement (both ebooks and audiobooks pages).
    No new table or columns — uses existing infrastructure.
    """
    results = execute_sql_query(queries.get_reviews_by_book_query, (book_id,))
    return {
        "reviews": results or [],
        "message": f"Successfully retrieved reviews for book {book_id}."
    }


# ── POST ENDPOINTS ────────────────────────────────────────────────

@router.post("/books")
def add_book(book: models.Book):
    """Adds a new book to the catalog."""
    success = execute_sql_query(queries.insert_book_query, (
        book.title, book.author, book.isbn, book.description,
        book.price, book.format, book.cover_url, book.audio_url,
        book.rating, book.genre, book.stock
    ))
    if success:
        return {"message": f"Successfully added book: '{book.title}' to the catalog.", "book": book}
    else:
        raise HTTPException(status_code=500, detail="Failed to add book.")


@router.post("/wishlists")
def add_to_wishlist(wishlist_item: models.Wishlist):
    """Adds a book to a user's wishlist."""
    success = execute_sql_query(queries.insert_wishlist_query, (
        wishlist_item.user_id, wishlist_item.book_id
    ))
    if success:
        return {
            "message": f"Successfully added book ID {wishlist_item.book_id} to user {wishlist_item.user_id}'s wishlist.",
            "wishlist_item": wishlist_item
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to add to wishlist.")


@router.post("/orders")
def create_order(order: models.Order):
    """
    Creates a new order.
    Part 3 — POST 2 requirement: used as 'Add to Cart' on ebooks and audiobooks pages.
    """

    status = order.status if order.status else 'pending'   # tenary operator
    success = execute_sql_query(queries.insert_order_query, (
        order.user_id, order.total_amount, status
    ))
    if success:
        return {
            "message": f"Successfully created order with total amount \u20ac{order.total_amount}.",
            "order": order
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to create order.")


@router.post("/reviews")
def submit_review(review: models.Review):
    """
    Submits a review for a book.
    Writes to the shared readify.book_reviews table.
    Part 3 — POST 1 requirement (both ebooks and audiobooks pages).
    No new table or columns — uses existing infrastructure.
    """
    success = execute_sql_query(queries.insert_review_query, (
        review.book_id, review.name, review.email,
        review.review_body, review.would_recommend
    ))
    if success:
        return {"message": "Review submitted successfully.", "review": review}
    else:
        raise HTTPException(status_code=500, detail="Failed to submit review.")

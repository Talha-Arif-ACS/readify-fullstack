# Store your SQL queries as simple string variables
# Part 2 Fix: removed all SELECT * — explicit column names throughout


# ── Reusable column list (avoids repetition) ──────────────────────
_BOOK_COLS = """
    book_id, title, author, description, price, format,
    cover_url, audio_url, rating, genre, stock
"""


# ── GET Queries ───────────────────────────────────────────────────

# All books (no filter)
get_all_books_query = f"""
    SELECT {_BOOK_COLS}
    FROM readify.books
    ORDER BY book_id;
"""

# Books filtered by format — used with query parameter ?format=ebook / ?format=audio
# Part 2 Fix: adds the query-parameter endpoint requirement
get_books_by_format_query = f"""
    SELECT {_BOOK_COLS}
    FROM readify.books
    WHERE format = %s
    ORDER BY book_id;
"""

# Single book by ID (path parameter)
get_book_by_id_query = f"""
    SELECT {_BOOK_COLS}
    FROM readify.books
    WHERE book_id = %s;
"""

# Wishlist — explicit columns only
get_wishlist_query = """
    SELECT w.user_id, w.added_at,
           b.book_id, b.title, b.author, b.price, b.format, b.cover_url, b.genre
    FROM readify.wishlists w
    JOIN readify.books b ON w.book_id = b.book_id
    WHERE w.user_id = %s
    ORDER BY w.added_at DESC;
"""

# Orders — explicit columns only
get_orders_by_user_query = """
    SELECT order_id, user_id, total_amount, status, created_at
    FROM readify.orders
    WHERE user_id = %s
    ORDER BY created_at DESC;
"""

# Reviews for a specific book (reads existing readify.book_reviews table)
# NEW — added for Part 3 GET 3 requirement (no new table, no new columns)
get_reviews_by_book_query = """
    SELECT review_id, book_id, name, review_body, would_recommend, created_at
    FROM readify.book_reviews
    WHERE book_id = %s
    ORDER BY created_at DESC
    LIMIT 5;
"""


# ── POST Queries ──────────────────────────────────────────────────

insert_book_query = """
    INSERT INTO readify.books
        (title, author, isbn, description, price, format, cover_url, audio_url, rating, genre, stock)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

insert_wishlist_query = """
    INSERT INTO readify.wishlists (user_id, book_id)
    VALUES (%s, %s);
"""

insert_order_query = """
    INSERT INTO readify.orders (user_id, total_amount, status)
    VALUES (%s, %s, %s);
"""

# Insert a review into the existing readify.book_reviews table
# NEW — added for Part 3 POST 1 requirement (no new table, no new columns)
insert_review_query = """
    INSERT INTO readify.book_reviews
        (book_id, name, email, review_body, would_recommend)
    VALUES (%s, %s, %s, %s, %s);
"""

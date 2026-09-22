
# Get 1️⃣: Getting books for populating Catalog page
catalog_books_query = """
    SELECT book_id, title, author, cover_url, price, rating, genre, category, stock
    FROM readify.books
    WHERE format = 'physical'
    ORDER BY category, genre, title;
"""

#  Get 2️⃣ to get book based on id
book_details_query = """
    SELECT title, author, description, cover_url, price, format, rating, stock 
    FROM readify.books 
    WHERE book_id = %s;
"""


#Get 3️⃣ Getting Books User Listed
user_selling_request_query = """
    SELECT title, author, isbn, cover_url, book_condition, proposed_price, status  
    FROM readify.selling_books  
    WHERE user_id = %s;
"""


#  Get 4️⃣ Getting Books for Wishlist
user_wishlist_query =  """
    SELECT b.title, b.author, b.price, b.cover_url
    FROM readify.wishlists AS w
    JOIN readify.books AS b ON w.book_id = b.book_id
    WHERE w.user_id = %s;
"""

# Not used

# 5 Getting books based on Genre
books_genre = """
    SELECT book_id, title, author, isbn, description, cover_url, price, rating, genre, category, stock
    FROM readify.books 
    WHERE genre = %s;
    
"""
#6  Getting books based on the format = Physical
book_physical_format = """
    SELECT book_id, title, author, isbn, description, cover_url, price, rating, genre, category, stock
    FROM readify.books 
    WHERE format = 'physical';

"""


"""
#####
post endpoints
#####
"""

#  post ️ 1️⃣: adding new user
insert_new_user = "INSERT INTO readify.users (first_name, last_name, email, password_hash)  VALUES (%s, %s, %s, %s);"

# post ️ 2️⃣: logging the user in
login_query = "SELECT user_id, first_name, last_name, email, password_hash FROM readify.users WHERE email = %s;"


#  post 3️⃣: selling used books by user
insert_used_book_query = "INSERT INTO readify.selling_books (user_id, title, author, isbn, book_condition, proposed_price, cover_url, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"

# post 4️⃣: subscribing to newsletter
insert_new_subscirber = " INSERT INTO readify.newsletter_subscribers (email) VALUES (%s);"


# post: adding book reviews
insert_book_review = "INSERT INTO readify.book_reviews (book_id, name, email, review_body,  would_recommend, found_page_turner, found_emotional, found_insightful)  VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"


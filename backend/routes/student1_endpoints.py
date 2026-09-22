from fastapi import APIRouter, HTTPException
from database import execute_sql_query
import queries.student1_queries as qf
from models import student1_models as md

router = APIRouter()



# ✅ Get 1️⃣ all books return JSON not list to populate catalog page
@router.get("/catalog/allbooks")
def get_all_books():
    query = qf.catalog_books_query
    booksReturned = execute_sql_query(query)

    if not booksReturned:
        raise HTTPException(404, "Not found")

    booksReturnedCount = len(booksReturned)

    return {
        "booksReturnedCount": booksReturnedCount,
        "booksReturned": booksReturned
    }


#✅ Get 2️⃣ path parameter: update the modal view for each book
@router.get("/catalog/book-details/{book_id}")
def get_book_details(book_id: int):
    query = qf.book_details_query
    books4modal = execute_sql_query(query, (book_id,))

    if not books4modal:
        raise HTTPException(status_code=404, detail="Book not found")

    book = books4modal[0]

    return {
        "title": book["title"],
        "author": book["author"],
        "description": book["description"],
        "cover_url": book["cover_url"],
        "price": book["price"],
        "format": book["format"],
        "rating": book["rating"],
        "stock": book["stock"]
    }


#✅ Get 3️⃣ query parameter: to get books from user listed books
@router.get("/help/selling-request")
def get_selling_request(user_id: int):
    query = qf.user_selling_request_query
    selling_request = execute_sql_query(query, (user_id,))

    if not selling_request:
        raise HTTPException(404, "Not Found")

    return {
        "listedBooksCount": len(selling_request),
        "listedUserBooks": selling_request
    }


# ❌ Get 4️ query parameter: get books from a specific user whishlist
@router.get("/catalog/wishlist/")
def get_wishlist(user_id: int = 1):
    query = qf.user_wishlist_query
    wishlist = execute_sql_query(query, (user_id,))

    if not wishlist:
        raise HTTPException(404, "Not found")

    return {
        "bookInWishListCount" : len(wishlist),
        "allBooksInWishList" : wishlist
    }

# Have not used the bellow get points in JavaScript

# ❌ get 5: retrieve books based on the genre
@router.get("/catalog/book-genre")
def get_book_genre(genre_name: str = "Classic"):
    query = qf.books_genre
    booksGenreBased = execute_sql_query(query, (genre_name,))

    if not booksGenreBased:
        raise HTTPException(404, "Not Found")


    return {
        "GenreName": genre_name,
        "InThisGenreCount": len(booksGenreBased),
        "BookList": booksGenreBased
    }


# ❌ get 6: get all the physical book
@router.get("/catalog/book-format/physical")
def get_book_physical():
    query = qf.book_physical_format
    physical_format = execute_sql_query(query)

    if not physical_format:
        raise HTTPException(404, "Not Found")

    return {
        "physicalBookCount": len(physical_format),
        "allPhysicalBooks": physical_format
    }



"""
#####
post endpoints
#####
"""


# ✅ post ️ 1️⃣: adding new users to the db
@router.post("/user")
def adding_new_user(newUser: md.User):
    query = qf.insert_new_user
    success = execute_sql_query(query, (newUser.first_name, newUser.last_name, newUser.email, newUser.password_hash))

    if success:
        return newUser

    raise HTTPException(
        status_code=400,
        detail="Failed to create an account. Please verify your information and try again."
    )



# ✅ post ️ 2️⃣: logging the user in
@router.post("/user/login")
def login_request(loginReq: md.LoginRequest):
    query = qf.login_query
    result = execute_sql_query(query, (loginReq.email,))

    if result:
        user = result[0]

        if user["password_hash"] != loginReq.password:
            raise HTTPException(status_code=401, detail="Wrong password")

        return {
            "user_id": user["user_id"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"]
        }
    else:
        raise HTTPException(404, "Not Found")
        #I don't know why I here instead of returning error I raise HTTPException


# ✅ post 3️⃣: selling used books by user

@router.post("/help/selling-book")
def create_used_book(usedBk: md.SellingBook):
    # it expects an object in the shape found in the SellingBook model. If it is the same shape, create a var usedBk.
    # Then pass it to the function.
    query = qf.insert_used_book_query
    success = execute_sql_query(query, (
        usedBk.user_id,
        usedBk.title,
        usedBk.author,
        usedBk.isbn,
        usedBk.book_condition,
        usedBk.proposed_price,
        usedBk.cover_url,
        usedBk.description
    ))

    if success == True:
        return usedBk
    else:
        raise HTTPException(status_code=400,
                            detail="Failed to create the book listing. Please verify your information and try again.")

# ✅ post 4️⃣: subscribing to newsletter
@router.post("/newsletter")
def adding_to_newsletter(newSubscriber: md.NewsletterSubscriber):
    query = qf.insert_new_subscirber
    # Added a comma to make it a valid Python tuple!
    success = execute_sql_query(query, (newSubscriber.email,))

    if success == True:
        return newSubscriber

    raise HTTPException(
        status_code=400,
        detail="Failed to add you in our newsletter subscribers. Please verify your information and try again."
    )


# ❌ post 5️⃣: adding review for books
@router.post("/catalog/book-review")
def adding_review(BKReview: md.BookReview):
    query = qf.insert_book_review
    success = execute_sql_query(query, (
        BKReview.book_id,
        BKReview.name,
        BKReview.email,
        BKReview.review_body,
        BKReview.would_recommend,
        BKReview.found_page_turner,
        BKReview.found_emotional,
        BKReview.found_insightful
    ))

    if success:
        return BKReview

    raise HTTPException(
        status_code=400,
        detail="Failed to save your book review. Please verify your information and try again."
    )


















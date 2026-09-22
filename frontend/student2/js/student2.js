// ============================================================
// STUDENT2.JS — Student 2 (Shahadat Hossain)
// Handles both ebooks.html and audiobooks.html pages
// Written following teacher's zoo.js pattern
// ============================================================

// -- Shared state --
let cartCount = 0;

// Toast notification helper (shared by both pages)
function showToast(message, type) {
    let container = document.getElementById("toastContainer");
    let icons = {success: "bi-check-circle-fill", danger: "bi-x-circle-fill", warning: "bi-exclamation-circle-fill"};
    let colors = {success: "text-success", danger: "text-danger", warning: "text-warning"};

    let el = document.createElement("div");
    el.className = "toast show align-items-center border-0 mb-2";
    el.setAttribute("role", "alert");
    el.innerHTML = `<div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${icons[type] || icons.success} ${colors[type] || colors.success}"></i>
            ${message}
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
    container.appendChild(el);
    setTimeout(function () {
        el.remove();
    }, 4000);
}


// ============================================================
//  EBOOKS PAGE
// ============================================================

let allEbooks = [];
let filteredEbooks = [];
let currentBookId = null;
let previewedBooks = new Set();

function getBooksByFormat(data, format) {
    let books = Array.isArray(data.books) ? data.books : [];
    return books.filter((book) => (book.format || "").toLowerCase() === format);
}

// GET 1 — fetch all ebooks and build the carousel
function getEbooks() {
    fetch("https://readify-backend-team102.vercel.app/student2/books?format=ebook").then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch ebooks");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Ebooks:", data);

            allEbooks = getBooksByFormat(data, "ebook");
            filteredEbooks = [...allEbooks];

            // update stats strip
            document.getElementById("ebookCount").innerText = allEbooks.length;

            let totalPrice = 0;
            allEbooks.forEach((book) => {
                totalPrice += parseFloat(book.price);
            });
            let avg = allEbooks.length > 0 ? (totalPrice / allEbooks.length).toFixed(2) : "—";
            document.getElementById("ebookAvgPrice").innerText = "€" + avg;

            // update subtitle
            document.getElementById("collectionSubtitle").innerText =
                "Browse " + allEbooks.length + " classic titles — preview a chapter, then buy the full edition.";

            updateEbookFilterCount();
            buildEbookCarousel(filteredEbooks);
        }
    ).catch(
        (error) => {
            console.log(error);
            document.getElementById("carouselInner").innerHTML =
                `<div class="carousel-item active">
                    <div class="text-center py-5">
                        <p class="text-danger">Could not load the collection. Please try again later.</p>
                    </div>
                </div>`;
        }
    );
}

// Build carousel slides — 4 cards per slide (like teacher builds animal cards)
function buildEbookCarousel(books) {
    let inner = document.getElementById("carouselInner");

    if (books.length === 0) {
        inner.innerHTML =
            `<div class="carousel-item active">
                <div class="text-center py-5">
                    <p class="text-muted">No books match this filter.</p>
                </div>
            </div>`;
        return;
    }

    let slides = "";

    for (let i = 0; i < books.length; i += 4) {
        let batch = books.slice(i, i + 4);
        let active = i === 0 ? "active" : "";
        let cards = "";

        batch.forEach((book) => {
            let idx = allEbooks.findIndex((b) => b.book_id === book.book_id);
            // cover image: use cover_url from DB, fallback to local file
            let img = book.cover_url
                ? book.cover_url.replace("student2/", "")
                : "image/book" + (idx + 1) + ".jpeg";
            let genre = (book.genre || "other").toLowerCase();
            let safe = book.title.replace(/'/g, "\\'");

            cards += `<div class="col-6 col-md-4 col-lg-3" data-genre="${genre}" data-book-id="${book.book_id}">
                <div class="book-card" id="card-${book.book_id}">
                    <img alt="${book.title}" class="book-img" src="${img}"/>
                    <h5 class="book-title">${book.title}</h5>
                    <div class="book-btn-group">
                        <button class="btn btn-ghost" onclick="openPreview(${book.book_id}, '${safe}', ${idx >= 0 ? idx : 0})">
                            <i class="bi bi-eye me-1"></i>Preview
                        </button>
                        <button class="btn btn-prim" onclick="openBuyModal(${book.book_id})">
                            <i class="bi bi-bag me-1"></i>Buy
                        </button>
                    </div>
                </div>
            </div>`;
        });

        slides += `<div class="carousel-item ${active}">
            <div class="row justify-content-center g-4">${cards}</div>
        </div>`;
    }

    inner.innerHTML = slides;

    // re-apply previewed badges
    previewedBooks.forEach((id) => {
        markPreviewed(id);
    });
}

function updateEbookFilterCount() {
    let el = document.getElementById("filterCount");
    if (!el) return;
    if (filteredEbooks.length === allEbooks.length) {
        el.innerText = "Showing all " + allEbooks.length + " titles";
    } else {
        el.innerText = "Showing " + filteredEbooks.length + " of " + allEbooks.length + " titles";
    }
}

// Genre filter pills for ebooks
function initEbookGenreFilter() {
    document.querySelectorAll(".genre-pill").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".genre-pill").forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            let genre = this.dataset.genre;
            if (genre === "all") {
                filteredEbooks = [...allEbooks];
            } else {
                filteredEbooks = allEbooks.filter((b) => (b.genre || "").toLowerCase() === genre);
            }

            updateEbookFilterCount();
            buildEbookCarousel(filteredEbooks);
        });
    });
}

// Preview offcanvas — opens PDF with toolbar hidden
function openPreview(bookId, title, index) {
    let offcanvas = document.getElementById("bookPreview");
    let iframe = document.getElementById("previewIframe");
    let label = document.getElementById("bookPreviewLabel");

    label.innerText = title;

    // Anna Karenina (index 2) uses book1.pdf
    let pdfPath = index === 2 ? "books/book1.pdf" : "books/book" + (index + 1) + ".pdf";
    iframe.src = pdfPath + "#toolbar=0";

    previewedBooks.add(bookId);
    markPreviewed(bookId);

    bootstrap.Offcanvas.getOrCreateInstance(offcanvas).show();
}

// Add "Previewed ✓" badge to the card
function markPreviewed(bookId) {
    let card = document.getElementById("card-" + bookId);
    if (!card || card.querySelector(".previewed-badge")) return;
    let badge = document.createElement("span");
    badge.className = "previewed-badge";
    badge.innerText = "Previewed ✓";
    card.appendChild(badge);
}

// GET 2 — fetch single book details for buy modal
function openBuyModal(bookId) {
    currentBookId = bookId;

    let modal = document.getElementById("bookBuyModal");
    let loader = document.getElementById("bookModalLoader");
    let content = document.getElementById("bookModalContent");

    // show loader, hide content (teacher pattern: classList add/remove d-none)
    loader.classList.remove("d-none");
    content.classList.add("d-none");
    document.getElementById("bookBuyModalLabel").innerText = "Loading…";
    document.getElementById("ebookReviewForm").reset();
    document.getElementById("bookReviewsList").innerHTML = "";

    bootstrap.Modal.getOrCreateInstance(modal).show();

    fetch("https://readify-backend-team102.vercel.app/student2/books/" + bookId).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch book details");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Book details:", data);
            let book = data.book;

            let idx = allEbooks.findIndex((b) => b.book_id === bookId);
            let img = book.cover_url
                ? book.cover_url.replace("student2/", "")
                : "image/book" + (idx + 1) + ".jpeg";

            document.getElementById("bookModalImg").src = img;
            document.getElementById("bookModalImg").alt = book.title;
            document.getElementById("bookBuyModalLabel").innerText = book.title;
            document.getElementById("bookModalPrice").innerText = "€" + parseFloat(book.price).toFixed(2);
            document.getElementById("bookModalDesc").innerText =
                book.description || "A classic title in our digital collection.";

            document.getElementById("bookAddToCartBtn").onclick = function () {
                addToCart(bookId, parseFloat(book.price), book.title);
            };

            // hide loader, show content
            loader.classList.add("d-none");
            content.classList.remove("d-none");

            // GET 3 — load reviews
            getBookReviews(bookId);
        }
    ).catch(
        (error) => {
            console.log(error);
            loader.innerHTML = `<p class="text-danger small">
                <i class="bi bi-exclamation-circle me-1"></i>Could not load book details.</p>`;
        }
    );
}

// GET 3 — load reviews for a book
function getBookReviews(bookId) {
    let container = document.getElementById("bookReviewsList");
    container.innerHTML = '<p class="text-muted small">Loading reviews…</p>';

    let starMap = {
        "Absolutely yes!": 5,
        "Yes, with conditions": 4,
        "Not sure": 3,
        "Probably not": 2
    };

    fetch("https://readify-backend-team102.vercel.app/student2/reviews/" + bookId).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch reviews");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Reviews:", data);
            let reviews = data.reviews || [];

            if (reviews.length === 0) {
                container.innerHTML = '<p class="text-muted small fst-italic">No reviews yet — be the first!</p>';
                return;
            }

            // calculate average stars
            let totalStars = 0;
            reviews.forEach((r) => {
                totalStars += starMap[r.would_recommend] || 3;
            });
            let avgStars = Math.round(totalStars / reviews.length);

            // build review HTML
            let html = `<div class="mb-2">
                <span class="text-warning">${"★".repeat(avgStars)}${"☆".repeat(5 - avgStars)}</span>
                <span class="text-muted small ms-1">
                    ${avgStars}/5 avg (${reviews.length} review${reviews.length > 1 ? "s" : ""})
                </span>
            </div>`;

            reviews.slice(0, 3).forEach((r) => {
                let s = starMap[r.would_recommend] || 3;
                html += `<div class="review-item border-bottom pb-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong class="small">${r.name}</strong>
                        <span class="text-warning small">${"★".repeat(s)}${"☆".repeat(5 - s)}</span>
                    </div>
                    <p class="small mb-0 text-muted">${r.review_body}</p>
                </div>`;
            });

            container.innerHTML = html;
        }
    ).catch(
        (error) => {
            console.log(error);
            container.innerHTML = '<p class="text-muted small">Could not load reviews.</p>';
        }
    );
}

// POST 1 — submit ebook review (teacher pattern: separate options object)
const postEbookReview = (body) => {
    const url = "https://readify-backend-team102.vercel.app/student2/reviews";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };

    fetch(url, options).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not submit review");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Review submitted:", data);
            showToast("Review submitted — thank you!", "success");
            document.getElementById("ebookReviewForm").reset();
            getBookReviews(currentBookId);
        }
    ).catch(
        (error) => {
            console.log(error);
            showToast("Could not submit review. Please try again.", "danger");
        }
    );
};

// POST 2 — add ebook to cart
const addToCart = (bookId, price, title) => {
    const url = "https://readify-backend-team102.vercel.app/student2/orders";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: 1,
            total_amount: price,
            status: "pending"
        })
    };

    let btn = document.getElementById("bookAddToCartBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding…';

    fetch(url, options).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not add to cart");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Added to cart:", data);
            cartCount++;
            document.querySelectorAll(".cart-badge").forEach((el) => {
                el.innerText = cartCount;
            });
            showToast('"' + title + '" added to cart!', "success");
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-bag me-2"></i>Add to Cart';
        }
    ).catch(
        (error) => {
            console.log(error);
            showToast("Could not add to cart. Please try again.", "danger");
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-bag me-2"></i>Add to Cart';
        }
    );
};


// ============================================================
//  AUDIOBOOKS PAGE
// ============================================================

let allAudiobooks = [];
let filteredAudiobooks = [];
let currentAudiobookId = null;

// GET 1 — fetch all audiobooks and build the grid
function getAudiobooks() {
    fetch("https://readify-backend-team102.vercel.app/student2/books?format=audio").then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch audiobooks");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Audiobooks:", data);

            allAudiobooks = getBooksByFormat(data, "audio");
            filteredAudiobooks = [...allAudiobooks];

            // update stats
            document.getElementById("audioCount").innerText = allAudiobooks.length;
            document.getElementById("audioHours").innerText = (allAudiobooks.length * 8) + "+";
            document.getElementById("audioNarrators").innerText = "10";

            // update subtitle
            document.getElementById("audioCollectionSubtitle").innerText =
                allAudiobooks.length + " classic titles — sample the narration free, then purchase the full recording.";

            updateAudioFilterCount();
            buildAudioGrid(filteredAudiobooks);
        }
    ).catch(
        (error) => {
            console.log(error);
            document.getElementById("audiobookGrid").innerHTML =
                `<div class="col-12 text-center py-5">
                    <p class="text-danger">Could not load audiobooks. Please try again later.</p>
                </div>`;
        }
    );
}

// Build audiobook grid cards (like teacher builds animal cards with forEach)
function buildAudioGrid(books) {
    let grid = document.getElementById("audiobookGrid");

    if (books.length === 0) {
        grid.innerHTML =
            `<div class="col-12 text-center py-5">
                <p class="text-muted">No audiobooks match this filter.</p>
            </div>`;
        return;
    }

    let cards = "";

    books.forEach((book) => {
        let idx = allAudiobooks.findIndex((b) => b.book_id === book.book_id);
        // cover image: use cover_url from DB, fallback to local file
        // Grimms' Fairy Tales (index 7) uses abook1.jpeg
        let img = book.cover_url
            ? book.cover_url.replace("student2/", "")
            : (idx === 7 ? "image/abook1.jpeg" : "image/abook" + (idx + 1) + ".jpeg");
        let audioSrc = "audio/ab" + (idx + 1) + ".mp3";

        cards += `<div class="col" data-genre="${(book.genre || "other").toLowerCase()}">
            <div class="card audio-book-card"
                 data-book-id="${book.book_id}"
                 data-title="${book.title}"
                 data-author="${book.author || ""}">
                <img alt="${book.title}"
                     class="img-fluid w-50 mx-auto d-block mt-3 audio-cover"
                     src="${img}"/>
                <div class="card-body text-center">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">By ${book.author}</p>
                    <div class="audio-player-wrap">
                        <audio controls>
                            <source src="${audioSrc}" type="audio/mpeg"/>
                            Your browser does not support audio.
                        </audio>
                    </div>
                    <div class="d-grid">
                        <button class="btn btn-prim" onclick="openAudioBuyModal(${book.book_id})">
                            <i class="bi bi-bag me-1"></i>Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    // overwrite the grid innerHTML with all the cards (teacher pattern)
    grid.innerHTML = cards;

    // set up exclusive playback and now-playing bar
    initExclusivePlayback();
    initNowPlayingBar();
}

function updateAudioFilterCount() {
    let el = document.getElementById("audioFilterCount");
    if (!el) return;
    if (filteredAudiobooks.length === allAudiobooks.length) {
        el.innerText = "Showing all " + allAudiobooks.length + " titles";
    } else {
        el.innerText = "Showing " + filteredAudiobooks.length + " of " + allAudiobooks.length + " titles";
    }
}

// Genre filter pills for audiobooks
function initAudioGenreFilter() {
    document.querySelectorAll(".genre-pill").forEach((btn) => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".genre-pill").forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            let genre = this.dataset.genre;
            if (genre === "all") {
                filteredAudiobooks = [...allAudiobooks];
            } else {
                filteredAudiobooks = allAudiobooks.filter((b) => (b.genre || "").toLowerCase() === genre);
            }

            updateAudioFilterCount();
            buildAudioGrid(filteredAudiobooks);
        });
    });
}

// Exclusive playback: playing one audio pauses all others
function initExclusivePlayback() {
    document.querySelectorAll(".audio-player-wrap audio").forEach((audio) => {
        let fresh = audio.cloneNode(true);
        audio.replaceWith(fresh);

        fresh.addEventListener("play", function () {
            document.querySelectorAll(".audio-player-wrap audio").forEach((other) => {
                if (other !== fresh) other.pause();
            });
        });
    });
}

// Now Playing sticky bar at the bottom
function initNowPlayingBar() {
    let bar = document.getElementById("nowPlayingBar");
    let barTitle = document.getElementById("nowPlayingTitle");

    document.querySelectorAll(".audio-player-wrap audio").forEach((audio) => {
        let card = audio.closest(".card.audio-book-card");
        let title = card ? card.dataset.title : "Unknown";
        let author = card ? card.dataset.author : "";

        audio.addEventListener("play", function () {
            barTitle.innerText = title + "  —  " + author;
            bar.style.display = "block";
        });
        audio.addEventListener("pause", function () {
            bar.style.display = "none";
        });
        audio.addEventListener("ended", function () {
            bar.style.display = "none";
        });
    });
}

// GET 2 — fetch single audiobook details for buy modal
function openAudioBuyModal(bookId) {
    currentAudiobookId = bookId;

    let modal = document.getElementById("audioBuyModal");
    let loader = document.getElementById("audioModalLoader");
    let content = document.getElementById("audioModalContent");

    // show loader, hide content
    loader.classList.remove("d-none");
    content.classList.add("d-none");
    document.getElementById("audioBuyModalLabel").innerText = "Loading…";
    document.getElementById("audioReviewForm").reset();
    document.getElementById("audioReviewsList").innerHTML = "";

    bootstrap.Modal.getOrCreateInstance(modal).show();

    fetch("https://readify-backend-team102.vercel.app/student2/books/" + bookId).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch audiobook details");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Audiobook details:", data);
            let book = data.book;

            let idx = allAudiobooks.findIndex((b) => b.book_id === bookId);
            let img = book.cover_url
                ? book.cover_url.replace("student2/", "")
                : (idx === 7 ? "image/abook1.jpeg" : "image/abook" + (idx + 1) + ".jpeg");

            document.getElementById("audioModalCoverImg").src = img;
            document.getElementById("audioModalCoverImg").alt = book.title;
            document.getElementById("audioBuyModalLabel").innerText = book.title;
            document.getElementById("audioModalTitle").innerText = book.title;
            document.getElementById("audioModalPrice").innerText = "€" + parseFloat(book.price).toFixed(2);
            document.getElementById("audioModalDesc").innerText =
                book.description || "A classic audiobook in our digital collection.";

            document.getElementById("audioAddToCartBtn").onclick = function () {
                addAudioToCart(bookId, parseFloat(book.price), book.title);
            };

            // hide loader, show content
            loader.classList.add("d-none");
            content.classList.remove("d-none");

            // GET 3 — load reviews
            getAudioReviews(bookId);
        }
    ).catch(
        (error) => {
            console.log(error);
            loader.innerHTML = `<p class="text-danger small">
                <i class="bi bi-exclamation-circle me-1"></i>Could not load audiobook details.</p>`;
        }
    );
}

// GET 3 — load reviews for an audiobook
function getAudioReviews(bookId) {
    let container = document.getElementById("audioReviewsList");
    container.innerHTML = '<p class="text-muted small">Loading reviews…</p>';

    let starMap = {
        "Absolutely yes!": 5,
        "Yes, with conditions": 4,
        "Not sure": 3,
        "Probably not": 2
    };

    fetch("https://readify-backend-team102.vercel.app/student2/reviews/" + bookId).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not fetch reviews");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Audio reviews:", data);
            let reviews = data.reviews || [];

            if (reviews.length === 0) {
                container.innerHTML = '<p class="text-muted small fst-italic">No reviews yet — be the first!</p>';
                return;
            }

            let totalStars = 0;
            reviews.forEach((r) => {
                totalStars += starMap[r.would_recommend] || 3;
            });
            let avgStars = Math.round(totalStars / reviews.length);

            let html = `<div class="mb-2">
                <span class="text-warning">${"★".repeat(avgStars)}${"☆".repeat(5 - avgStars)}</span>
                <span class="text-muted small ms-1">
                    ${avgStars}/5 avg (${reviews.length} review${reviews.length > 1 ? "s" : ""})
                </span>
            </div>`;

            reviews.slice(0, 3).forEach((r) => {
                let s = starMap[r.would_recommend] || 3;
                html += `<div class="review-item border-bottom pb-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong class="small">${r.name}</strong>
                        <span class="text-warning small">${"★".repeat(s)}${"☆".repeat(5 - s)}</span>
                    </div>
                    <p class="small mb-0 text-muted">${r.review_body}</p>
                </div>`;
            });

            container.innerHTML = html;
        }
    ).catch(
        (error) => {
            console.log(error);
            container.innerHTML = '<p class="text-muted small">Could not load reviews.</p>';
        }
    );
}

// POST 1 — submit audiobook review (teacher pattern: separate options object)
const postAudioReview = (body) => {
    const url = "https://readify-backend-team102.vercel.app/student2/reviews";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };

    fetch(url, options).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not submit review");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Audio review submitted:", data);
            showToast("Review submitted — thank you!", "success");
            document.getElementById("audioReviewForm").reset();
            getAudioReviews(currentAudiobookId);
        }
    ).catch(
        (error) => {
            console.log(error);
            showToast("Could not submit review. Please try again.", "danger");
        }
    );
};

// POST 2 — add audiobook to cart
const addAudioToCart = (bookId, price, title) => {
    const url = "https://readify-backend-team102.vercel.app/student2/orders";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: 1,
            total_amount: price,
            status: "pending"
        })
    };

    let btn = document.getElementById("audioAddToCartBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding…';

    fetch(url, options).then(
        (response) => {
            if (!response.ok) {
                throw Error("Could not add to cart");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("Added to cart:", data);
            cartCount++;
            document.querySelectorAll(".cart-badge").forEach((el) => {
                el.innerText = cartCount;
            });
            showToast('"' + title + '" added to cart!', "success");
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-bag me-2"></i>Add to Cart';
        }
    ).catch(
        (error) => {
            console.log(error);
            showToast("Could not add to cart. Please try again.", "danger");
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-bag me-2"></i>Add to Cart';
        }
    );
};


// ============================================================
//  PAGE DETECTION & INITIALIZATION
//  (teacher pattern: detect elements and call functions directly)
// ============================================================

// reset cart badge (shared)
document.querySelectorAll(".cart-badge").forEach((el) => {
    el.innerText = "0";
});

// ---------- Ebooks page ----------
if (document.getElementById("bookCarousel")) {

    // fetch and display all ebooks
    getEbooks();

    // wire up genre filter pills
    initEbookGenreFilter();

    // wire up the review form submit button (teacher pattern: addEventListener on click)
    let ebookSubmitBtn = document.querySelector("#ebookReviewForm button[type='submit']");
    if (ebookSubmitBtn) {
        ebookSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // get values from the form
            let starInput = document.querySelector('input[name="ebookStars"]:checked');
            let name = document.getElementById("ebookReviewName").value;
            let reviewBody = document.getElementById("ebookReviewText").value;

            if (!starInput || !name.trim() || !reviewBody.trim()) {
                showToast("Please fill in all fields and pick a star rating.", "warning");
                return;
            }

            let recommendMap = {
                5: "Absolutely yes!",
                4: "Yes, with conditions",
                3: "Not sure",
                2: "Probably not",
                1: "Probably not"
            };

            // create the json body to send
            let jsonBody = {
                "book_id": currentBookId,
                "name": name.trim(),
                "email": "reader@readify.com",
                "review_body": reviewBody.trim(),
                "would_recommend": recommendMap[parseInt(starInput.value)]
            };

            postEbookReview(jsonBody);
        });
    }

    // clear PDF iframe when offcanvas closes
    let bookPreview = document.getElementById("bookPreview");
    if (bookPreview) {
        bookPreview.addEventListener("hidden.bs.offcanvas", function () {
            document.getElementById("previewIframe").src = "";
        });
    }
}

// ---------- Audiobooks page ----------
if (document.getElementById("audiobookGrid")) {

    // fetch and display all audiobooks
    getAudiobooks();

    // wire up genre filter pills
    initAudioGenreFilter();

    // wire up the review form submit button (teacher pattern: addEventListener on click)
    let audioSubmitBtn = document.querySelector("#audioReviewForm button[type='submit']");
    if (audioSubmitBtn) {
        audioSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // get values from the form
            let starInput = document.querySelector('input[name="audioStars"]:checked');
            let name = document.getElementById("audioReviewName").value;
            let reviewBody = document.getElementById("audioReviewText").value;

            if (!starInput || !name.trim() || !reviewBody.trim()) {
                showToast("Please fill in all fields and pick a star rating.", "warning");
                return;
            }

            let recommendMap = {
                5: "Absolutely yes!",
                4: "Yes, with conditions",
                3: "Not sure",
                2: "Probably not",
                1: "Probably not"
            };

            // create the json body to send
            let jsonBody = {
                "book_id": currentAudiobookId,
                "name": name.trim(),
                "email": "listener@readify.com",
                "review_body": reviewBody.trim(),
                "would_recommend": recommendMap[parseInt(starInput.value)]
            };

            postAudioReview(jsonBody);
        });
    }
}

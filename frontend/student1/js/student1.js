// ======================
//Get Points
//=======================


//Get 1️⃣
//Function 1: template card for one book
function createSingleBookCard(book) {
    return `
        <div class="book-col flex-shrink-0">
            <div class="book-card card h-100 border-0" onclick="openBookModal(${book.book_id})">
                <div class="book-cover-wrap position-relative overflow-hidden">
                    <img class="w-100 d-block" src="${book.cover_url}" alt="${book.title}" loading="lazy"/>

                    <span class="badge badge-overlay bg-primary text-uppercase">${book.genre}</span>
                    <button class="wishlist-btn btn rounded-circle p-0" type="button">
                        <i class="bi bi-heart"></i>
                    </button>
                </div>
                <div class="card-body d-flex flex-column text-center px-3 py-3">
                    <div class="book-title">${book.title}</div>
                    <p class="book-author mt-auto mb-0">${book.author}</p>
                </div>
            </div>
        </div>
    `;
}

//Function 2: function for using the createSingleBookCar function to sort the books under one Genre - then using  template for genre-row
function createGenreSection(genreName, booksOnly4ThisGenre) {

    //Loping through all the books in booksOnly4ThisGenre and creating a card for them. Store all the created card in cardsHtml
    let cardsHtml = "";

    booksOnly4ThisGenre.forEach(bookGenre => {
        cardsHtml += createSingleBookCard(bookGenre);
    });

    // Create a safe ID from the genre name (lowercase, no spaces)
    const genreId = genreName.toLowerCase().replace(/\s+/g, '-');

    // Wrap cards in the carousel shell and return
    return `
            <div id="${genreId}">
                <div class="sub-heading d-flex align-items-center gap-3 mt-5 mb-4">
                    <h4 class="mb-0">${genreName}</h4>
                </div>
                <div class="books-carousel-outer position-relative px-5 pb-4">
                    <button aria-label="Scroll left" class="carousel-ctrl position-absolute top-50 start-0 translate-middle-y"
                        onclick="document.getElementById('row-${genreId}').scrollBy({left:-380,behavior:'smooth'})">
                        <i class="bi bi-chevron-left"></i>
                    </button>
    
                    <div class="books-row d-flex flex-nowrap gap-3 overflow-auto" id="row-${genreId}">
                        ${cardsHtml}
                    </div>
    
                    <button aria-label="Scroll right" class="carousel-ctrl position-absolute top-50 end-0 translate-middle-y"
                        onclick="document.getElementById('row-${genreId}').scrollBy({left:380,behavior:'smooth'})">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
    `;
}

//Function 3: Filter the books passed by function 4 by creating a set of genres - use createGenreSection to create HTML genre rows - insert into HTML
function filterGenre(allBooksInCategory, categoryId) {
    // =====================================================
    // JOB A: Find all unique genre names. We need a list of genres like: ["Biography", "History", "Science"]
    // =====================================================

    let genreList = [];

    allBooksInCategory.forEach(bookInCategory => {

        let genreExists = false;


        genreList.forEach(eachGenre => {
            if (eachGenre === bookInCategory.genre) {
                genreExists = true;
            }
        });

        if (genreExists === false) {
            genreList.push(bookInCategory.genre);
        }
    });


    // After this loop, genreList might be: ["Biography", "History", "Science", "Philosophy"]
    // Each genre appears only ONCE, no matter how many books have that genre
    console.log("Genres found:", genreList);


    // =====================================================
    // JOB B: For each genre, collect matching books and build the section
    // =====================================================

    let allSectionsHtml = "";

    genreList.forEach(currentGenre => {
        let booksForThisGenre = [];

        allBooksInCategory.forEach(currentBook => {
            if (currentGenre === currentBook.genre) {
                booksForThisGenre.push(currentBook);
            }
        });

        let oneSectionHtml = createGenreSection(currentGenre, booksForThisGenre);

        allSectionsHtml += oneSectionHtml;
    });

    document.getElementById(categoryId).innerHTML = allSectionsHtml;

}

//FUNCTION 4: fetch all the books - save based on 2 categories - call function3 filterGenre to filter based on genre & insert using categoryId
//function3 filterGenre will ue function2 createGenreSection to create the HTML for each genre using template
function loadCatalog() {
    // Local: http://127.0.0.1:8000/student1/catalog/allbooks
    fetch("https://readify-backend-team102.vercel.app/student1/catalog/allbooks").then(
        (response) => {
            if (!response.ok) {
                throw Error("Request failed");
            }

            return response.json();
        }
    ).then(
        (allBooks) => {
            console.log("Amounts of books returned", allBooks.booksReturnedCount);

            //split into two categories:

            const nonFictionBooks = allBooks.booksReturned.filter(book => book.category === "Nonfiction");
            const fictionBooks = allBooks.booksReturned.filter(book => book.category === "Fiction");


            filterGenre(nonFictionBooks, "nonfiction-content");
            filterGenre(fictionBooks, "fiction-content");

        }
    ).catch(
        (error) => {
            console.log(error);
        }
    )
}


if (document.getElementById("fiction") && document.getElementById("nonfiction")) {
    loadCatalog();
}


//Get point 2️⃣ functions
function openBookModal(bookId) {
    // ❓where do you get the bookid? whenever a book is cliked this function is triggered automatically?
    // Local: http://127.0.0.1:8000/student1/catalog/book-details/${bookId}
    fetch(`https://readify-backend-team102.vercel.app/student1/catalog/book-details/${bookId}`).then(
        (response) => {
            if (!response.ok) {
                throw Error("Request failed");
            }

            return response.json();
        }
    ).then(
        (book) => {
            // ❓ is the book a list or dictionary?
            //Get the
            console.log("book info for modal", book)
            document.getElementById("modal-title").innerText = book.title;
            document.getElementById("modal-author").innerText = book.author;
            document.getElementById("modal-cover").src = book.cover_url;
            document.getElementById("modal-price").innerText = "$" + book.price;
            document.getElementById("modal-rating").innerText = book.rating ? `${book.rating} / 5.0` : "0.0";
            // 2 new added in the last time
            document.getElementById("modal-description").innerText = book.description || "No description available.";

            document.getElementById("modal-stock").innerText =
                book.stock > 0 ? `${book.stock} in stock` : "Out of stock";

            // Open the modal using Bootstrap's JavaScript API
            //Learn how this one is done.
            const modal = new bootstrap.Modal(document.getElementById("bookModal"));
            modal.show();
        }
    ).catch(
        (error) => {
            console.log(error);
        }
    )
}


// ======================
//Post Points
//=======================

//post 1️⃣ endpoint for sining up.

// these two buttons is needed for the new user sign up:

//Grab the Button & element to update
const singUpMessageBox = document.getElementById("signUpMessage");
const singUpButton = document.getElementById("signUpBtn");

const postNewUser = (body) => {
    // const url = "http://127.0.0.1:8000/student1/user";
    const url = "https://readify-backend-team102.vercel.app/student1/user";

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
                //Error:
                singUpMessageBox.classList.remove("d-none", "readify-alert-success");
                singUpMessageBox.classList.add("readify-alert-error");
                singUpMessageBox.innerText = "Error: That email might already be registered.";

                //Reset the button for loading to
                singUpButton.innerHTML = `<i class="bi bi-person-plus me-2"></i>Create Account`
                singUpButton.disabled = false;

                throw Error("Request failed.")
            }

            return response.json();
        }
    ).then(
        (userPost) => {
            console.log("User signed up.")

            // Steps after user saved successfully in the db.
            //Displaying Success
            singUpMessageBox.classList.remove("d-none", "readify-alert-error");
            singUpMessageBox.classList.add("readify-alert-success");
            singUpMessageBox.innerHTML = `
                    <i class="bi bi-check-circle-fill me-2"></i>
                    Account created successfully. You can now log in.`;

            //Reset the inputs
            document.getElementById("signUpFirstName").value = "";
            document.getElementById("signUpLastName").value = "";
            document.getElementById("signUpEmail").value = "";
            document.getElementById("signUpPassword").value = "";


            //Reset the button for loading to tell the user then can loggin now

            singUpButton.innerHTML = `<i class="bi bi-person-plus me-2"></i>Create Account`;
            singUpButton.disabled = false;

            /*hide singup and show login*/
            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById("signUpModal")).hide();
                new bootstrap.Modal(document.getElementById("loginModal")).show();
            }, 1000);
        }
    ).catch(
        (error) => {
            singUpMessageBox.classList.remove("d-none", "readify-alert-success");
            singUpMessageBox.classList.add("readify-alert-error");
            singUpMessageBox.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Signup failed. Please try again later.`;

            setTimeout(() => {
                singUpMessageBox.classList.add("d-none")
            }, 3000)

            singUpButton.innerHTML = `<i class="bi bi-person-plus me-2"></i>Create Account`;
            singUpButton.disabled = false;

            console.log(error);
        }
    )
}

//using the above function when the user click


if (singUpButton) {
    singUpButton.addEventListener("click", (e) => {
        e.preventDefault();

        //check if the input are filled


        const first_name = document.getElementById("signUpFirstName").value;
        const last_name = document.getElementById("signUpLastName").value;
        const email = document.getElementById("signUpEmail").value;
        const password_hash = document.getElementById("signUpPassword").value;


        if (!first_name || !last_name || !email || !password_hash) {
            singUpMessageBox.classList.remove("d-none", "readify-alert-success");
            singUpMessageBox.classList.add("readify-alert-error");
            singUpMessageBox.innerText = "Please fill in all the necessary information";

            //It stops the code from going any further. why not break just empty return to stop from going further
            return;
        }


        //once clciked the creatAccount button will be displayed Loading and can't be clicked.
        singUpButton.innerHTML = `
                <span class="readify-loader d-inline-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating account...
                </span>`;
        singUpButton.disabled = true;


        const jsonBody = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password_hash': password_hash
        }

        //calling the postUser function
        postNewUser(jsonBody);


    })
}


//post 2️⃣: login request

function student1Path(pagePath) {
    const path = window.location.pathname;
    const onHomePage = path.endsWith("/") || path.endsWith("/index.html");

    return onHomePage ? `student1/${pagePath}` : pagePath;
}

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    // as localStorage store text string (JSON-formatted string) & JSON.parse converts it to JS object
    const accountBtn = document.querySelector(".btn-account");
    const dropDownMenu = document.getElementById("accountDropdownMenu");


    if (user) {
        // User IS logged in
        // 1. Change the button text to show user's first name
        accountBtn.innerHTML = `<i class="bi bi-person-check me-1"></i>` + user.first_name;

        // 2. Replace the dropdown items with: Wishlist, My Listings, Log Out
        dropDownMenu.innerHTML = `
                    <li><a class="dropdown-item" href="#" data-bs-toggle="" data-bs-target="#">
                        <i class="bi bi-heart dropdown-icon me-2"></i>Wishlist</a></li>
                        
                    <li><a class="dropdown-item" href="${student1Path('help.html#bookListed')}" data-bs-toggle="" data-bs-target="#">
                        <i class="bi bi-tags dropdown-icon me-2"></i>My Listings</a></li>
                        
                    <li><hr class="dropdown-divider"></li>
                                        <!-- Recall the logout function                   -->
                    <li><a class="dropdown-item" href="#" onclick="logOut()">
                        <i class="bi bi-box-arrow-right dropdown-icon me-2"></i>Log Out </a> </li>`;
    } else {
        // User is NOT logged in — show the original Login/Sign Up
        accountBtn.innerHTML = '<i class="bi bi-person me-1"></i>Account';
        dropDownMenu.innerHTML = `
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
                        <i class="bi bi-box-arrow-in-right dropdown-icon me-2"></i>Login</a></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">
                        <i class="bi bi-person-plus dropdown-icon me-2"></i>Sign Up</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">
                        <i class="bi bi-heart dropdown-icon me-2"></i>Wishlist</a></li>
                `;
    }
}


const loginButton = document.getElementById("loginBtn");
const loginMessageBox = document.getElementById("loginMessage");

const postLogin = (body) => {
    // const url = "http://127.0.0.1:8000/student1/user/login";
    const url = "https://readify-backend-team102.vercel.app/student1/user/login";

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


                loginMessageBox.classList.remove("d-none", "readify-alert-success");
                loginMessageBox.classList.add("readify-alert-error");
                loginMessageBox.innerText = "The entered password is incorrect."

                //Update the login button
                loginButton.innerHTML = " <i class=\"bi bi-box-arrow-in-right me-2\"></i>Log In";
                loginButton.disabled = false;

                throw Error("Request failed");
            }

            return response.json();
        }
    ).then(
        (userLoginData) => {
            console.log("User logged in");


            // 1. Update the notification
            loginMessageBox.classList.remove("d-none", "readify-alert-error");
            loginMessageBox.classList.add("readify-alert-success");
            loginMessageBox.innerText = "Logged in successfully!";

            // 2. Save data in localStorage
            //localStorage is a built-in browser feature that lets you save data as key-value pairs. It survives page refreshes and navigation
            //JSON.stringify() converts a JavaScript object into a text string (localStorage can only save text).
            // JSON.parse() converts it back into an object.

            localStorage.setItem("user", JSON.stringify(userLoginData));
            // Refresh the page to apply all changes: close the login modal, update nav bar
            location.reload();

        }
    ).catch(
        (error) => {
            loginMessageBox.classList.remove("d-none", "readify-alert-success");
            loginMessageBox.classList.add("readify-alert-error");
            loginMessageBox.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Login failed. Please try again later.`;

            setTimeout(() => {
                loginMessageBox.classList.add("d-none")
            }, 3000)

            loginButton.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i>Log In`;
            loginButton.disabled = false;


            console.log(error);
        }
    )

}


//Recall all the postLogin function while the login button is clicked.
if (loginButton) {
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();


        //storing the values:
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;


        if (!email || !password) {
            loginMessageBox.classList.remove("d-none", "readify-alert-success");
            loginMessageBox.classList.add("readify-alert-error");
            loginMessageBox.innerText = "Please fill in all the necessary information";

            return;
        }


        loginButton.innerHTML = `
                 <span class="readify-loader d-inline-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                </span>`;

        loginButton.disabled = true;

        const jsonBody = {
            'email': email,
            'password': password
        }

        postLogin(jsonBody);


    })
}

// when page refreshes, the nav bar is load from the HTML code. Even if the user logged in the nav bar code will be fom the HTML.
updateNavbar();


// you don't have to call this action, in html you used onclick function
function logOut() {
    localStorage.removeItem("user");
    // Refresh the page to apply all changes
    location.reload();
}


// Get 3️⃣ : showing the user listed books


function singleListedBookCard(book) {
    return ` 
            <!--Single card book-->
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card listed-book-card h-100">
                    <div class="row g-0 h-100">
                        <div class="col-4">
                            <img class="listed-book-cover w-100 h-100" src="${book.cover_url}" alt="${book.title}" loading="lazy"/>
                        </div>
                        <div class="col-8">
                            <div class="card-body d-flex flex-column h-100 p-3">
                                <div>
                                    <h6 class="book-title text-start mb-0">${book.title}</h6>
                                    <p class="book-author text-start mt-0 mb-3">${book.author}</p>
                                    <span class="listed-status-pill mb-3">
                                        <i class="bi ${book.status === 'approved' ? 'bi-check-circle-fill' : 'bi-hourglass-split'} me-1"></i>${book.status}
                                    </span>
                                </div>

                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <span class="modal-price">$ ${book.proposed_price}</span>
                                    <span class="modal-section-label">${book.book_condition}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!--End of Single card book-->
    
    `;
}


function getListedBook(user_id) {
    document.getElementById("listed-book-rows").innerHTML = `
            <div class="col-12">
                <div class="card listed-book-card p-4 text-center">
                    <div class="spinner-border readify-loader" role="status"></div>
                    <p class="mt-3 mb-0">Loading your listed books...</p>
                </div>
            </div>
    `;

    // Local: http://127.0.0.1:8000/student1/help/selling-request?user_id=${user_id}
    fetch(`https://readify-backend-team102.vercel.app/student1/help/selling-request?user_id=${user_id}`).then(
        (response) => {
            return response.json();
        }
    ).then(
        (bookListedInfo) => {

            let allCard = "";


            // Inside the returned JSON must be looped through this key listedUserBooks cut it holds all the books.
            bookListedInfo.listedUserBooks.forEach(eachBook => {

                let singleCard = singleListedBookCard(eachBook);

                allCard += singleCard

            })
            document.getElementById("listed-book-rows").innerHTML = allCard;

        }
    ).catch(
        (error) => {

            document.getElementById("listed-book-rows").innerHTML = `
                  <div class="col-12">
                    <div class="card listed-book-card p-4 p-lg-5 text-center">
                        <div class="card-body">
                            <i class="bi bi-journal-bookmark banner-icon"></i>
                            <h5 class="book-title mt-3">No Listed Books Yet</h5>
                            <p class="mb-3 readify-muted">
                                You haven't listed any books for sale. Use the form above to get started!
                            </p>
                            <a href="#sell" class="btn btn-ghost">
                                <i class="bi bi-tags me-2"></i>Sell Your First Book
                            </a>
                        </div>
                    </div>
                </div>
            `;
            console.log(error);
        }
    )
}


//Calling the function:
//Step 1: Checking  if the user is logged in:
const userString = localStorage.getItem("user");
const listedBookRows = document.getElementById("listed-book-rows");

if (listedBookRows) {
    if (userString && userString !== "null" && userString !== "undefined") {

        // Only parse AFTER we know userString is not null
        const userIdObject = JSON.parse(userString);
        const userId = userIdObject.user_id;
        // JSON.parse(null) returns null, and line 688 tries to read null.user_id — which crashes your entire script before it even reaches the if check!
        getListedBook(userId);
    } else {

        document.getElementById("listed-book-rows").innerHTML = `
            <div class="col-12">
                <div class="card listed-book-card p-4 p-lg-5 text-center">
                    <div class="card-body">
                        <i class="bi bi-person-lock banner-icon"></i>
                        <h5 class="book-title mt-3">Log in to view your listings</h5>
                        <p class="mb-3 readify-muted">
                            Your listed books will appear here after you log in.
                        </p>
                        <button class="btn btn-prim" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Log In
                        </button>
                    </div>
                </div>
            </div>
    `;

    }

}


//Post 3️⃣: Saving Listed books for sale by user
const listingMessageBox = document.getElementById("listingMessage");
const submitBookBtn = document.getElementById("submit-book");

const postUsedBook = (body) => {
    // const url = "http://127.0.0.1:8000/student1/help/selling-book";
    const url = "https://readify-backend-team102.vercel.app/student1/help/selling-book";

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
                throw Error("Request failed");
            }

            return response;
        }
    ).then(
        (bookPost) => {
            console.log("Book Listed:", bookPost);

            //Steps after the books is successfully posted:
            // Step 1: Resetting the inputs
            document.getElementById("bookTitle").value = "";
            document.getElementById("bookAuthor").value = "";
            document.getElementById("bookPrice").value = "";
            document.getElementById("bookIsbn").value = "";
            document.getElementById("bookDesc").value = "";

            //Step 2: Update the List My Book button
            submitBookBtn.innerHTML = `<i class="bi bi-tags me-2"></i>List My Book`;
            submitBookBtn.disabled = false;


            //Step 3: Display the success message:
            listingMessageBox.classList.remove("d-none", "readify-alert-error");
            listingMessageBox.classList.add("readify-alert-success");
            listingMessageBox.innerHTML = `
                    <i class="bi bi-check-circle-fill me-2"></i>
                    Your book is listed successfully.`;
            setTimeout(() => {
                listingMessageBox.classList.add("d-none");
            }, 3000)

            //Update the listed book to show the new book
            // you don't have to parse the User string in local storage cuz  in the post JSON body you have userID
            getListedBook(body.user_id);


        }
    ).catch(
        (error) => {
            //catches an error in case the server is down
            submitBookBtn.innerHTML = `<i class="bi bi-tags me-2"></i>List My Book`;
            submitBookBtn.disabled = false;

            //Don't you need to display error message here!

            listingMessageBox.classList.remove("d-none", "readify-alert-success");
            listingMessageBox.classList.add("readify-alert-error");
            listingMessageBox.innerHTML = ` 
                <i class="bi bi-exclamation-circle-fill me-2"></i>Request failed. Please try again later.`;

            setTimeout(() => {
                listingMessageBox.classList.add("d-none");
            }, 3000)

            console.log(error);
        }
    )
}


//while loading the catalog page, it gives error because submit-book doesn't exists.
if (submitBookBtn) {
    submitBookBtn.addEventListener("click", (e) => {
        e.preventDefault();

        //Step 1: Checking  if the user is logged in:
        const userString = localStorage.getItem("user");

        console.log("The hidden user data is:" + userString);

        if (!userString || userString === "null" || userString === "undefined") {


            listingMessageBox.innerHTML = ` <p>Please first <a class="readify-link" href="#" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign up</a> or
                                    <a class="readify-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a></p>`

            listingMessageBox.classList.remove("d-none");
            listingMessageBox.classList.add("readify-alert-error");

            return;

            //Fail rate:
            //Smt it fails because even in case of logout, the data of user is stored in the localStorage.
        }


        //If the user is logged in
        // Step 2: Get the book info entered:

        //Getting user_id. User text string is already retrieved only need to convert it to JS objects.
        const userInfoLocalStorage = JSON.parse(userString);

        const user_id = userInfoLocalStorage.user_id;
        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;
        const proposed_price = document.getElementById("bookPrice").value;
        const isbn = document.getElementById("bookIsbn").value;
        const cover_url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

        //Problem 1: I don't know how to check which condition is checked?
        const book_condition = document.querySelector('input[name="condition"]:checked').value;
        const description = document.getElementById("bookDesc").value;


        //Step 3: If book form input is empty.
        if (!title || !author || !proposed_price || !isbn) {
            listingMessageBox.innerHTML = ` <p>Please first fill all the necessary information.</p>`
            listingMessageBox.classList.remove("d-none", "readify-alert-success");
            listingMessageBox.classList.add("readify-alert-error");

            //to d-none after 3 sec
            setTimeout(() => {
                listingMessageBox.classList.add("d-none");
            }, 3000)

            return;
        }

        submitBookBtn.innerHTML = `
            <div class="readify-loader">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Listing book...
                </div>
        `;
        submitBookBtn.disabled = true;

        //Step 4: Sending data to neon
        const jsonBody = {
            'user_id': user_id,
            'title': title,
            'author': author,
            'description': description,
            'proposed_price': parseFloat(proposed_price),
            'book_condition': book_condition,
            'isbn': isbn,
            'cover_url': cover_url
        }

        postUsedBook(jsonBody);

        //Step 5: Resetting the inputs
        //this  = ""; will reset. Since you don't have a form tag, the easiest and safest way to reset the inputs is to just clear them manually after a successful submission:
        //above in the  postUsedBook function after response.ok


        //Step 6: Adding success message
        //It is in the postUsedBook function to be shown only when the book is successfully posted (response.ok)

    })

}


// Post 4️⃣ : newsletter post

function showSubscribedNewsletter() {
    const nlSection = document.querySelector(".newsletter-inner");
    if (nlSection) {
        nlSection.innerHTML = `
            <h2><i class="bi bi-check-circle me-2 readify-link"></i>
            You're <em>subscribed!</em></h2>
            <p class="newsletter-body-text">We'll send you weekly picks and deals. Stay tuned!</p>
        `;
    }
}

//buttons required for this post:
const newsLetterButton = document.getElementById("nl-btn");
const nlMessageBox = document.getElementById("nl-message");

const postNewsLetter = (body) => {
    // const url = "http://127.0.0.1:8000/student1/newsletter";
    const url = "https://readify-backend-team102.vercel.app/student1/newsletter";

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

                nlMessageBox.innerHTML = ` <p>The email already exists or is not valid.</p>`
                nlMessageBox.classList.remove("d-none", "readify-alert-success");
                nlMessageBox.classList.add("readify-alert-error");
                setTimeout(() => {
                    nlMessageBox.classList.add("d-none")
                }, 3000)

                throw Error("Request failed");
            }

            return response.json();
        }
    ).then(
        (newSubscriber) => {
            console.log("Added to the news letter subscribers");

            //Steps do after successful post:
            //Step 1: clean the input &  save in localStorage that has been added to newsletter
            document.getElementById("nlEmail").value = "";


            //Step 2: display success message & replace then newsletter input
            localStorage.setItem("nlsubscribed", "true");
            //calling the  showSubscribedNewsletter() function to update the newsletter section
            showSubscribedNewsletter();

        }
    ).catch(
        (error) => {
            console.log(error);
        }
    )

}

//News Letter button


if (newsLetterButton) {
    newsLetterButton.addEventListener("click", (e) => {
        e.preventDefault();


        //Step 1: take the email value

        const email = document.getElementById("nlEmail").value;

        //Step 2: Check if an email is entered. If not, display a message to  enter a valid email then click

        if (!email) {
            nlMessageBox.innerHTML = ` <p>Please enter a valid email.</p>`
            nlMessageBox.classList.remove("d-none", "readify-alert-success");
            nlMessageBox.classList.add("readify-alert-error");

            setTimeout(() => {
                nlMessageBox.classList.add("d-none");
            }, 3000)

            return;
        }

        //step 3: change the email to JS object

        const jsonBody = {
            'email': email
        }

        //step 4 give it to the function.

        postNewsLetter(jsonBody);

    })
}

if (localStorage.getItem("nlsubscribed") === "true") {
    showSubscribedNewsletter();
}


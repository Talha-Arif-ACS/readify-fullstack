// ── GET 1: Load all clubs on page load ───────────────────────────────────────

function loadAllClubs() {
    const container = document.getElementById("clubs-container");

    // Show spinner while loading
    container.innerHTML = `
        <div class="col-12 text-center py-4" id="clubs-preloader">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading reading clubs...</p>
        </div>`;

    // fetch("http://127.0.0.1:8000/student3/reading-clubs").then(
    fetch("https://readify-backend-team102.vercel.app/student3/reading-clubs").then(
        (response) => {
            if (!response.ok) {
                throw Error("Request was not successful.");
            }
            return response.json();
        }
    ).then(
        (data) => {
            let cards = "";

            data.reading_clubs.forEach(
                (club) => {
                    const genreClass = club.genre.toLowerCase().replace(/[^a-z]/g, "");
                    cards += `
                        <div class="col-12 col-md-6">
                            <div class="club-card">
                                <span class="genre-badge genre-badge--${genreClass}">
                                    <i class="bi bi-book me-1"></i>${club.genre}
                                </span>
                                <h5 class="club-card-title">${club.name}</h5>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-clock me-1"></i>Meets</span>
                                    <span class="club-meta-value">${club.meeting_day} at ${club.meeting_time}</span>
                                </div>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-geo-alt me-1"></i>Location</span>
                                    <span class="club-meta-value">${club.meeting_place}</span>
                                </div>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-chat-text me-1"></i>About</span>
                                    <span class="club-meta-value">${club.description || ""}</span>
                                </div>
                            </div>
                        </div>`;
                }
            );

            container.innerHTML = cards;
        }
    ).catch(
        (error) => {
            console.log(error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Could not load reading clubs. Please try again later.
                    </div>
                </div>`;
        }
    )
}

loadAllClubs();


// ── GET 2: Filter clubs by genre ─────────────────────────────────────────────

function filterClubs() {
    const genre = document.getElementById("genre-filter").value.trim();
    const container = document.getElementById("clubs-container");

    if (!genre) {
        loadAllClubs();
        return;
    }

    container.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Filtering clubs...</p>
        </div>`;

    // fetch("http://127.0.0.1:8000/student3/reading-clubs/filter?genre=" + encodeURIComponent(genre)).then(
    fetch("https://readify-backend-team102.vercel.app/student3/reading-clubs/filter?genre=" + encodeURIComponent(genre)).then(
        (response) => {
            if (!response.ok) {
                throw Error("Request was not successful.");
            }
            return response.json();
        }
    ).then(
        (data) => {
            let cards = "";

            if (data.reading_clubs.length === 0) {
                container.innerHTML = `
                    <div class="col-12">
                        <p class="text-muted">No clubs found for genre "<strong>${genre}</strong>".</p>
                    </div>`;
                return;
            }

            data.reading_clubs.forEach(
                (club) => {
                    const genreClass = club.genre.toLowerCase().replace(/[^a-z]/g, "");
                    cards += `
                        <div class="col-12 col-md-6">
                            <div class="club-card">
                                <span class="genre-badge genre-badge--${genreClass}">
                                    <i class="bi bi-book me-1"></i>${club.genre}
                                </span>
                                <h5 class="club-card-title">${club.name}</h5>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-clock me-1"></i>Meets</span>
                                    <span class="club-meta-value">${club.meeting_day} at ${club.meeting_time}</span>
                                </div>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-geo-alt me-1"></i>Location</span>
                                    <span class="club-meta-value">${club.meeting_place}</span>
                                </div>
                                <div class="club-meta">
                                    <span class="club-meta-label"><i class="bi bi-chat-text me-1"></i>About</span>
                                    <span class="club-meta-value">${club.description || ""}</span>
                                </div>
                            </div>
                        </div>`;
                }
            );

            container.innerHTML = cards;
        }
    ).catch(
        (error) => {
            console.log(error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Could not filter clubs. Please try again later.
                    </div>
                </div>`;
        }
    )
}

document.getElementById("filter-btn").addEventListener("click", () => {
    filterClubs();
});

document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("genre-filter").value = "";
    loadAllClubs();
});


// ── POST: Propose a new club ──────────────────────────────────────────────────

const proposeSubmitBtn = document.getElementById("propose-submit");

proposeSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name        = document.getElementById("clubName").value;
    const genre       = document.getElementById("clubGenre").value;
    const day         = document.getElementById("clubDay").value;
    const time        = document.getElementById("clubTime").value;
    const place       = document.getElementById("clubPlace").value;
    const description = document.getElementById("clubDescription").value;

    if (!name || !genre || !day || !time || !place) {
        document.getElementById("propose-feedback").innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-circle me-2"></i>
                Please fill in all required fields.
            </div>`;
        return;
    }

    const jsonBody = {
        'name': name,
        'genre': genre,
        'meeting_day': day,
        'meeting_time': time,
        'meeting_place': place,
        'description': description
    };

    // const url = "http://127.0.0.1:8000/student3/reading-clubs";
    const url = "https://readify-backend-team102.vercel.app/student3/reading-clubs";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonBody)
    };

    fetch(url, options).then(
        (response) => {
            if (!response.ok) {
                throw Error("Request was not successful.");
            }
            return response.json();
        }
    ).then(
        (data) => {
            console.log("data:", data);

            document.getElementById("propose-feedback").innerHTML = `
                <div class="alert alert-success" role="alert">
                    <i class="bi bi-check-circle me-2"></i>
                    Your club proposal has been submitted successfully!
                </div>`;

            // Clear form fields (propose-form is a div, not a <form>, so reset each input)
            document.getElementById("clubName").value = "";
            document.getElementById("clubGenre").value = "";
            document.getElementById("clubDay").value = "";
            document.getElementById("clubTime").value = "";
            document.getElementById("clubPlace").value = "";
            document.getElementById("clubDescription").value = "";

            // Reload the clubs list so the new club appears immediately
            loadAllClubs();
        }
    ).catch(
        (error) => {
            console.log(error);

            document.getElementById("propose-feedback").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Something went wrong. Please try again later.
                </div>`;
        }
    )
});
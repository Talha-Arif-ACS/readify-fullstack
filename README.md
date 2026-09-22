# 📚 Readify

A digital reading platform offering e-books, audiobooks, reading clubs, and a used-book marketplace — built as a full-stack team project for the *Full Stack Essentials* course (1ITF, Thomas More) by **Team 102**.

**Live app:** [readifybooks.netlify.app](https://readifybooks.netlify.app/)
**Live API:** [readify-backend-team102.vercel.app](https://readify-backend-team102.vercel.app/)

> This is a monorepo combining what were originally two separate repos (frontend on Netlify, backend on Vercel) so the full project is easy to browse in one place.

---

## Team 102

| Section | Contributor | GitHub |
|:--|:--|:--|
| student1 — Catalog, Help | Hamid Hussaini | [@Hamid-Mk](https://github.com/Hamid-Mk) |
| student2 — eBooks, Audiobooks | Shahadat Hossain | [@anthossain](https://github.com/anthossain) |
| **student3 — Reading Clubs, Shops** | **Talha Arif** | [@Talha-Arif-ACS](https://github.com/Talha-Arif-ACS) |

This repo is maintained here by Talha Arif. All three sections below are credited to their original author; **the Reading Clubs and Shops pages, and their backend endpoints, are my own work** (see [Individual Contributions](#individual-contributions)).

---

## Repo structure

```
readify/
├── frontend/          # Static HTML/CSS/JS site, deployed on Netlify
│   ├── common/         # Shared navbar, footer, hero, global CSS/JS used across all pages
│   ├── student1/        # Catalog + Help pages
│   ├── student2/        # eBooks + Audiobooks pages
│   ├── student3/        # Reading Clubs + Shops pages  ← my pages
│   └── index.html
└── backend/            # FastAPI + PostgreSQL (Neon) REST API, deployed on Vercel
    ├── models/          # Pydantic models, one file per student
    ├── queries/         # SQL query strings, one file per student
    ├── routes/          # FastAPI routers, one file per student
    ├── sql_files/       # Table definitions
    └── main.py
```

Each student's frontend pages and backend routes are namespaced (`/student1`, `/student2`, `/student3`) so the three of us could build independently against a shared database and a shared FastAPI app.

---

## Tech stack

- **Frontend:** HTML5, CSS3 (custom properties + nesting), vanilla JavaScript (`fetch`, no framework), Bootstrap 5
- **Backend:** Python, FastAPI, `psycopg` (raw SQL, no ORM), Pydantic for validation
- **Database:** PostgreSQL, hosted on Neon
- **Hosting:** Netlify (frontend), Vercel (backend)
- **Auth:** email/password, session state kept in `localStorage`

---

## Brand & design

The team designed a cohesive "New Heritage" visual identity — bridging traditional-library warmth with modern digital UI — applied consistently across all pages:

- **Colors:** a warm, coffee-toned dark (`Ink #1A0F09`) and off-white "parchment" (`#F8F5EF`) as the 60% neutral base, chestnut/ivory for depth, and a crimson (`#B5332A`) + warm ochre (`#CFA05A`) accent pair for calls to action, following a 60-30-10 color split.
- **Type:** `Fraunces` (serif) for headings for a literary feel, `Plus Jakarta Sans` (sans-serif) for body copy for on-screen clarity.
- **Components:** a consistent 4px-radius "soft-square" style for buttons/cards, elevated parchment-colored cards, line-art Bootstrap Icons, and a shared navbar/hero/footer (built by Hamid Hussaini) reused across every page.
- **Logo & favicon:** a minimal open-book SVG mark, kept deliberately simple so it stays legible at favicon scale.

---

## Individual Contributions

### 🔹 Talha Arif — Reading Clubs & Shops *(this maintainer)*

**Frontend**
- Built `reading-clubs.html` and `shops.html` from scratch, including all custom CSS (club cards, genre badges, store info cards, tab-based store/map navigation).
- Customized the Bootstrap accordion (FAQ section) with a custom SVG chevron to match the brand instead of the default icon.
- Built a tabbed store locator (Brussels / Antwerp / Ghent) with deep-linkable tabs from the navbar.

**Backend** — all endpoints under `/student3`, backed by a `reading_clubs` table I designed:
- `GET /student3/reading-clubs` — list all reading clubs
- `GET /student3/reading-clubs/filter?genre=...` — case-insensitive genre filter
- `POST /student3/reading-clubs` — propose a new club (validated with a Pydantic model)

**JavaScript**
- `loadAllClubs()` — fetches and renders all clubs as cards on page load, with a loading spinner and error state
- `filterClubs()` — live genre filtering against the API, with a "no results" state and reset
- A form handler for the "Propose a New Reading Club" form, with client-side validation and success/error alerts
- Dynamic genre-badge coloring: genre strings are normalized into CSS-safe class names so each genre gets consistent styling with zero hardcoded conditionals

**Notable challenges:** connecting to a shared FastAPI app/database with limited team coordination — figuring out the `/student3` router prefix convention, the shared Neon connection, and debugging a `422` caused by a request body that didn't exactly match my Pydantic model. Also learned to work through protected-branch Pull Requests rather than pushing directly to the dev branch.

### 🔹 Hamid Hussaini — Catalog & Help

Built the catalog browsing page (with a nested review form + accordion inside a Bootstrap modal) and the Help/sell-your-books page. Beyond his own pages, Hamid designed the shared navbar/hero/footer used site-wide, largely built the homepage, set up the backend foundation (`main.py`, `config.py`, Neon schema), and owned the Vercel deployment end-to-end. Backend endpoints cover browsing, book detail lookups, listing used books for sale, sign-up/login, and newsletter signup.

### 🔹 Shahadat Hossain — eBooks & Audiobooks

Built the eBooks and Audiobooks pages, including a book carousel, an offcanvas preview panel for sample chapters, and audio-sample playback with an exclusive "now playing" state. Backend endpoints cover fetching/filtering books by format, wishlists, orders (used as "add to cart"), and reviews with average-rating calculation.

---

## Running locally

**Frontend** — static site, no build step:
```bash
cd frontend
# open index.html directly, or serve it:
npx serve .
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# create a .env file with your own Neon/Postgres connection string
# (see config.py / database.py for the expected variable name)
uvicorn main:app --reload
```

---

## Notes

- No secrets are committed. The database connection is loaded from a `.env` file (gitignored) in the backend; the `.env` itself was never part of this codebase.
- Book covers are hotlinked from the [Open Library Covers API](https://covers.openlibrary.org/) rather than stored in the repo.
- This was originally graded as two separate repositories (frontend/backend, each deployed independently); they're combined here purely for a cleaner portfolio presentation. Deployment configs (`vercel.json`, Netlify build settings) are kept as-is from the original setup.

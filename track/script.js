/* =========================================
   blegh.art - track page
========================================= */

let currentTrack = null;
let currentAlbum = null;
let trackDatabase = null;


/* =========================================
   URL
========================================= */

function getTrackSlug() {

    const params = new URLSearchParams(window.location.search);
    return params.get("s");

}


/* =========================================
   LOAD TRACKLIST
========================================= */

async function loadTrackDatabase() {

    const response =
        await fetch("../tracklist.json");

    trackDatabase =
        await response.json();

}


/* =========================================
   FIND TRACK
========================================= */

function findTrack(trackName) {

    const query = decodeURIComponent(trackName)
        .replace(/-/g, " ")
        .trim()
        .toLowerCase();

    for (const album of trackDatabase.albums) {

        const found = album.tracks.find(track =>
            track.title.toLowerCase() === query
        );

        if (found) {

            currentAlbum = album;
            currentTrack = found;

            return true;

        }

    }

    return false;

}


/* =========================================
   PAGE TITLE
========================================= */

function updateTitle() {

    document.title =
        `${currentTrack.title} - blegh.art`;

}


/* =========================================
   COVER
========================================= */

function loadCover() {

    document.getElementById("cover").src =
        `../images/albums/${currentAlbum.id}.jpg`;

}


/* =========================================
   META
========================================= */

function loadMeta() {

    document.getElementById("track-title").textContent =
        currentTrack.title;

    document.getElementById("album-title").innerHTML =
        `${currentAlbum.title} (${currentAlbum.year})`;

}

/* =========================================
   QUOTE
========================================= */

async function loadQuote() {

    const response =
        await fetch("../quotes.json");

    const data =
        await response.json();

    const quotes =
        data.quotes.filter(q =>
            q.track === currentTrack.title
        );

    if (!quotes.length) {

        document.getElementById("quote").textContent =
            "";

        return;

    }

    const random =
        quotes[Math.floor(Math.random() * quotes.length)];

    document.getElementById("quote").textContent =
        random.text;

}


/* =========================================
   SHORT DESCRIPTION
========================================= */

function loadShortDescription() {

    document.getElementById("track-short").textContent =
        currentTrack.short;

}


/* =========================================
   DESCRIPTION
========================================= */

function loadDescription() {

    const container =
        document.getElementById("track-description");

    container.innerHTML = "";

    currentTrack.description.forEach(paragraph => {

        const p =
            document.createElement("p");

        p.textContent =
            paragraph;

        p.style.marginBottom = "22px";

        container.appendChild(p);

    });

}


/* =========================================
   LINKS
========================================= */

function loadLinks() {

    const query =
        encodeURIComponent(
            `Architects ${currentTrack.title}`
        );

    document.getElementById("spotify-link").href =
        `https://open.spotify.com/search/${query}`;

    document.getElementById("youtube-link").href =
        `https://www.youtube.com/results?search_query=${query}`;

    document.getElementById("lyrics-link").href =
        `https://genius.com/search?q=${query}`;

}


/* =========================================
   RIGHT WALL
========================================= */

function createWall() {

    const wall =
        document.getElementById("track-wall");

    wall.textContent =
        `${currentTrack.title.replace(/\s+/g, "").toUpperCase()}${currentAlbum.id.toUpperCase()}${currentTrack.title.replace(/\s+/g, "").toUpperCase()}${currentAlbum.id.toUpperCase()}${currentTrack.title.replace(/\s+/g, "").toUpperCase()}${currentAlbum.id.toUpperCase()}`;

}


/* =========================================
   PARALLAX
========================================= */

function initParallax() {

    const wall =
        document.getElementById("track-wall");

    window.addEventListener("scroll", () => {

        wall.style.transform =
            `translateY(${window.scrollY * 0.25}px)`;

    });

}


/* =========================================
   NOT FOUND
========================================= */

function showNotFound() {

    document.querySelector(".track-layout").innerHTML =
    `
    <h1>

        Track not found.

    </h1>

    <br>

    <p>

        The requested track doesn't exist in tracklist.json.

    </p>

    <br>

    <a href="../">

        Return to homepage

    </a>
    `;

}

/* =========================================
   REFERENCES
========================================= */

let referencesDatabase = null;


/* =========================================
   LOAD REFERENCES
========================================= */

async function loadReferencesDatabase() {

    const response =
        await fetch("../references.json");

    referencesDatabase =
        await response.json();

}


/* =========================================
   SLUG
========================================= */

function createSlug(name) {

    return name
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/\/+/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-");

}


/* =========================================
   CREATE REFERENCE CARD
========================================= */

function createReference(reference) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "reference";



    /* button */

    const button =
        document.createElement("div");

    button.className =
        "reference-button";

    button.textContent =
        reference.toQuote;



    /* content */

    const content =
        document.createElement("div");

    content.className =
        "reference-content";



    content.innerHTML = `

        <div class="reference-row">

            <div>

                <a class="reference-track"

                   href="?s=${createSlug(reference.fromTrack)}">

                    ${reference.fromTrack}

                </a>

                <br>

                <span class="reference-lyrics">

                    "${reference.fromQuote}"

                </span>

            </div>

        </div>



        <div class="reference-arrow">

            ↓

        </div>



        <div class="reference-row">

            <div>

                <a class="reference-track"

                   href="?s=${createSlug(reference.toTrack)}">

                    ${reference.toTrack}

                </a>

                <br>

                <span class="reference-lyrics">

                    "${reference.toQuote}"

                </span>

            </div>

        </div>

    `;



    button.addEventListener("click", () => {

        document
            .querySelectorAll(".reference-content")
            .forEach(item =>
                item.classList.remove("active"));

        document
            .querySelectorAll(".reference-button")
            .forEach(item =>
                item.classList.remove("active"));

        button.classList.add("active");

        content.classList.add("active");

    });



    wrapper.appendChild(button);

    wrapper.appendChild(content);

    return wrapper;

}


/* =========================================
   BUILD REFERENCES
========================================= */

function loadReferences() {

    const container =
        document.getElementById("references-list");

    container.innerHTML = "";



    if (!referencesDatabase.tracks[currentTrack.title]) {

        container.innerHTML =
            "<p>No references found.</p>";

        return;

    }



    const trackReferences =
        referencesDatabase.tracks[currentTrack.title];



    trackReferences.quotes.forEach(quote => {

        const reference =
            referencesDatabase.references.find(ref =>

                ref.id === quote.referenceId

            );



        if (!reference) return;



        container.appendChild(

            createReference(reference)

        );

    });



    /* open first */

    const firstButton =
        container.querySelector(".reference-button");

    if (firstButton) {

        firstButton.click();

    }

}

/* =========================================
   INIT
========================================= */

async function init() {

    try {
        console.log(getTrackSlug());
        const slug = getTrackSlug();

        if (!slug) {

            showNotFound();
            return;

        }

        await loadTrackDatabase();

        if (!findTrack(slug)) {

            showNotFound();
            return;

        }

        updateTitle();

        loadCover();

        loadMeta();

        loadQuote();

        loadShortDescription();

        loadDescription();

        loadLinks();

        createWall();

        initParallax();

        try {

           await loadReferencesDatabase();
           loadReferences();

        }
        catch(e){

           console.warn("References not loaded.");

        }

    }

    catch(error) {

        console.error(error);

        showNotFound();

    }

}

document.addEventListener(
    "DOMContentLoaded",
    init
);


/* =========================================
   YEAR
========================================= */

document.getElementById("copyright-year").textContent =
    new Date().getFullYear();

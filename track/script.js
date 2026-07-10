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

function findTrack(slug) {

    for (const album of trackDatabase.albums) {

        for (const track of album.tracks) {

            if (track.slug === slug) {

                currentTrack = track;

                currentAlbum = album;

                return true;

            }

        }

    }

    return false;

}


/* =========================================
   PAGE TITLE
========================================= */

function updateTitle() {

    document.title =
        `${currentTrack.title} • blegh.art`;

}


/* =========================================
   COVER
========================================= */

function loadCover() {

    document.getElementById("track-cover").src =
        `../images/albums/${currentAlbum.id}.jpg`;

}


/* =========================================
   META
========================================= */

function loadMeta() {

    document.getElementById("track-title").textContent =
        currentTrack.title;

    document.getElementById("track-album").innerHTML =
        `${currentAlbum.title}
        <span class="track-year">
            • ${currentAlbum.year}
        </span>`;

    document.getElementById("track-length").textContent =
        currentTrack.length;

}


/* =========================================
   QUOTE
========================================= */

function loadQuote() {

    document.getElementById("track-quote").textContent =
        currentTrack.quote;

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

    const container =
        document.getElementById("track-links");

    container.innerHTML = "";

    if (currentTrack.spotify) {

        container.innerHTML +=
        `
        <a href="${currentTrack.spotify}"
           target="_blank">

            Spotify

        </a>
        `;
    }

    if (currentTrack.youtube) {

        container.innerHTML +=
        `
        <a href="${currentTrack.youtube}"
           target="_blank">

            YouTube

        </a>
        `;
    }

    if (currentTrack.lyrics) {

        container.innerHTML +=
        `
        <a href="${currentTrack.lyrics}"
           target="_blank">

            Lyrics

        </a>
        `;
    }

}


/* =========================================
   RIGHT WALL
========================================= */

function createWall() {

    const wall =
        document.getElementById("track-wall");

    const text =
        (
            currentTrack.title.replaceAll(" ", "")
            +
            currentAlbum.id.toUpperCase()
        ).toUpperCase();

    let result = "";

    for (let i = 0; i < 30; i++) {

        result += text;

    }

    wall.textContent =
        result;

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

        await loadReferencesDatabase();

        loadReferences();

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

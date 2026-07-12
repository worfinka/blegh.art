const albums = [
    {
        name: "Nightmares",
        year: 2006,
        slug: "nightmares",
        color: "#EEA42B"
    },
    {
        name: "Ruin",
        year: 2007,
        slug: "ruin",
        color: "#C6C982"
    },
    {
        name: "Hollow Crown",
        year: 2009,
        slug: "hollowcrown",
        color: "#C5B97D"
    },
    {
        name: "The Here And Now",
        year: 2011,
        slug: "than",
        color: "#9DA192"
    },
    {
        name: "Daybreaker",
        year: 2012,
        slug: "daybreaker",
        color: "#EDEEDC"
    },
    {
        name: "Lost Forever // Lost Together",
        year: 2014,
        slug: "lflt",
        color: "#808080"
    },
    {
        name: "All Our Gods Have Abandoned Us",
        year: 2016,
        slug: "aoghau",
        color: "#F8F8F8"
    },
    {
        name: "Holy Hell",
        year: 2018,
        slug: "holyhell",
        color: "#9B9B9B"
    },
    {
        name: "For Those That Wish To Exist",
        year: 2021,
        slug: "fttwte",
        color: "#878C81"
    },
    {
        name: "The Classic Symptoms Of A Broken Spirit",
        year: 2022,
        slug: "tcsoabs",
        color: "#F6F5F0"
    },
    {
        name: "The Sky, The Earth & All Between",
        year: 2025,
        slug: "tste&ab",
        color: "#94A7B6"
    }
];
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

/* =========================================
   LOAD DESCRIPTION with formatting
========================================= */

function loadDescription() {

    const container =
        document.getElementById("track-description");

    container.innerHTML = "";

    currentTrack.description.forEach(paragraph => {

        const p =
            document.createElement("p");

        p.style.marginBottom = "22px";

        // Форматируем текст
        let formattedText = paragraph;

        // 1. Обработка **жирный текст**
        formattedText = formattedText.replace(
            /\*\*(.*?)\*\*/g,
            '<strong>$1</strong>'
        );

        // 2. Обработка *курсив*
        formattedText = formattedText.replace(
            /\*(.*?)\*/g,
            '<em>$1</em>'
        );

        // 3. Обработка _название_трека_ (гиперссылка)
        formattedText = formattedText.replace(
            /_(.*?)_/g,
            (match, trackName) => {
                const slug = createSlug(trackName);
                const color = getAlbumColorByTrack(trackName);
                return `<a href="/track?s=${slug}" style="color: ${color}; font-weight: 600;">${trackName}</a>`;
            }
        );

        // Устанавливаем HTML
        p.innerHTML = formattedText;

        container.appendChild(p);

    });

}

/* =========================================
   HELPER: GET ALBUM COLOR BY TRACK NAME
========================================= */

function getAlbumColorByTrack(trackName) {

    // Ищем трек в trackDatabase
    for (const album of trackDatabase.albums) {

        const found = album.tracks.find(track =>
            track.title.toLowerCase() === trackName.toLowerCase()
        );

        if (found) {

            // Находим цвет альбома
            const albumData = albums.find(a =>
                a.name === album.title
            );

            return albumData ? albumData.color : "#ffffff";

        }

    }

    // Если трек не найден, используем цвет текущего альбома
    const currentAlbumData = albums.find(a =>
        a.name === currentAlbum.title
    );

    return currentAlbumData ? currentAlbumData.color : "#ffffff";

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
        .replace(/&/g, "and")              // & → and
        .replace(/[^a-z0-9,'./? ]/g, "")   // разрешаем запятые, апострофы, точки, слеши и вопросительные знаки
        .trim()
        .replace(/\s+/g, "-")              // пробелы → -
        .replace(/--+/g, "-");             // убираем множественные дефисы

}

function findAlbumId(trackTitle) {

    for (const album of trackDatabase.albums) {

        if (album.tracks.some(track => track.title === trackTitle)) {

            return album.id;

        }

    }

    return "placeholder";

}
/* =========================================
   CREATE REFERENCE CARD
========================================= */

function createReference(reference) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "reference";

    /* Определяем, какая цитата принадлежит текущему треку */
    let currentQuote = "";

    if (reference.fromTrack === currentTrack.title) {
        // Текущий трек - источник (исходящая отсылка)
        currentQuote = reference.fromQuote;
    } else if (reference.toTrack === currentTrack.title) {
        // Текущий трек - цель (входящая отсылка)
        currentQuote = reference.toQuote;
    } else {
        // На всякий случай
        currentQuote = reference.fromQuote;
    }

    /* button - показывает цитату из текущего трека */
    const button =
        document.createElement("div");

    button.className =
        "reference-button";

    button.textContent =
        currentQuote;

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

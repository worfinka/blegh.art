/* blegh.art - main script */

const albums = [
    {
        name: "Nightmares",
        year: 2006,
        slug: "nightmares"
    },
    {
        name: "Ruin",
        year: 2007,
        slug: "ruin"
    },
    {
        name: "Hollow Crown",
        year: 2009,
        slug: "hollowcrown"
    },
    {
        name: "The Here And Now",
        year: 2011,
        slug: "than"
    },
    {
        name: "Daybreaker",
        year: 2012,
        slug: "daybreaker"
    },
    {
        name: "Lost Forever // Lost Together",
        year: 2014,
        slug: "lflt"
    },
    {
        name: "All Our Gods Have Abandoned Us",
        year: 2016,
        slug: "aoghau"
    },
    {
        name: "Holy Hell",
        year: 2018,
        slug: "holyhell",
        highlight: true
    },
    {
        name: "For Those That Wish To Exist",
        year: 2021,
        slug: "fttwte"
    },
    {
        name: "The Classic Symptoms Of A Broken Spirit",
        year: 2022,
        slug: "tcsoabs"
    },
    {
        name: "The Sky, The Earth & All Between",
        year: 2025,
        slug: "tste&ab"
    }
];


/* random quote */

async function loadQuotes() {

    try {

        const response = await fetch("quotes.json");
        const data = await response.json();

        const random =
            data.quotes[Math.floor(Math.random() * data.quotes.length)];

        document.getElementById("quote").textContent = random;

    }

    catch {

        document.getElementById("quote").textContent =
            "We are the architects of our own destruction.";

    }

}


/* date */

function getDaySuffix(day) {

    if (day % 10 === 1 && day !== 11) return "st";
    if (day % 10 === 2 && day !== 12) return "nd";
    if (day % 10 === 3 && day !== 13) return "rd";

    return "th";

}


function generateToday() {

    const today = new Date();

    const day = today.getDate();

    const month = today.toLocaleString("en", {
        month: "long"
    });

    const year = today.getFullYear();

    document.getElementById("today-date").textContent =
        `${day}${getDaySuffix(day)} ${month} ${year}`;

    document.getElementById("copyright-year").textContent =
        year;

    return {

        month:
            String(today.getMonth() + 1).padStart(2, "0"),

        day:
            String(day).padStart(2, "0")

    };

}


/* news */

async function loadNews(today) {

    try {

        const response = await fetch("info.json");
        const data = await response.json();

        const events = data.events.filter(event => {

            return event.date === `${today.month}-${today.day}`;

        });

        if (!events.length) {

            showNoNews();
            return;

        }

        const news =
            events[Math.floor(Math.random() * events.length)];

        renderNews(news);

    }

    catch {

        showNoNews();

    }

}


async function showNoNews() {

    const response = await fetch("tracklist.json");
    const data = await response.json();

    const albums = data.albums;

    const album =
        albums[Math.floor(Math.random() * albums.length)];

    const track =
        album.tracks[Math.floor(Math.random() * album.tracks.length)];

    document.getElementById("news-image").src =
        `images/albums/${album.id}.jpg`;

    document.getElementById("news-years").textContent =
        "No anniversary today.";

    document.getElementById("news-description").innerHTML =
        `But you should listen to <strong>${track}</strong> from <strong>${album.title}</strong>.`;

    document.getElementById("news-links").innerHTML = "";
}


function renderNews(news) {

    const image = document.getElementById("news-image");

    if (news.type === "custom") {

        image.src = `images/${news.image}`;

    } else {

        image.src = `images/albums/${news.album}.jpg`;

    }

    const yearsAgo =
        new Date().getFullYear() - news.year;

    document.getElementById("news-years").textContent =
        `${yearsAgo} years ago`;

    document.getElementById("news-description").textContent =
        news.description;

    const links = document.getElementById("news-links");

    links.innerHTML = "";

    if (!news.links) return;

    Object.entries(news.links).forEach(link => {

        const a = document.createElement("a");

        a.href = link[1];

        a.target = "_blank";

        a.textContent = link[0];

        links.appendChild(a);

    });

}


/* album list */

function createAlbumList() {

    const container =
        document.getElementById("albums-container");

    albums.forEach(album => {

        const row = document.createElement("div");

        row.className = "album-row";

        const link = document.createElement("a");

        link.href = `${album.slug}/`;

        link.className = "album-link";

        if (album.highlight) {

            link.classList.add("highlight");

        }

        link.innerHTML =
            `${album.name} <span class="album-year">: ${album.year}</span>`;

        row.appendChild(link);

        container.appendChild(row);

    });

}


/* init */

document.addEventListener("DOMContentLoaded", () => {

    const today = generateToday();

    loadQuotes();

    loadNews(today);

    createAlbumList();

});

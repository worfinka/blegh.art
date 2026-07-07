let quotesArray = [];

async function loadQuotes() {
    try {

        const response = await fetch("quotes.json?v=" + Date.now());
        const data = await response.json();

        quotesArray = data.quotes;

        return true;

    } catch (error) {

        console.error("Failed to load quotes:", error);

        quotesArray = [
            {
                text: "We are the architects of our own destruction.",
                track: "Unknown",
                album: "Unknown"
            },
            {
                text: "Lost forever // lost together.",
                track: "Unknown",
                album: "Unknown"
            }
        ];

        return false;

    }
}

function getRandomQuote() {
    if (!quotesArray.length) return "building something permanent.";
    return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

function displayQuote(quote) {

    const quoteElement = document.getElementById("quote");
    const quoteBlock = document.getElementById("quote-block");

    if (quoteElement) {

        quoteElement.textContent = quote.text;

    }

    if (quoteBlock) {

        quoteBlock.title =
            `Quote from ${quote.track} (${quote.album})`;

    }

}

async function init() {
    await loadQuotes();
    const quote = getRandomQuote();
    displayQuote(quote);
}

document.addEventListener('DOMContentLoaded', init);

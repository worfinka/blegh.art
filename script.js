let quotesArray = [];

async function loadQuotes() {
    try {
        const response = await fetch('quotes.json?v=' + Date.now());
        const data = await response.json();
        quotesArray = data.quotes;
        return true;
    } catch (error) {
        console.error('Failed to load quote:', error);
        quotesArray = [
            "We are the architects of our own destruction.",
            "Lost forever // lost together."
        ];
        return false;
    }
}

function getRandomQuote() {
    if (!quotesArray.length) return "building something permanent.";
    return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

function displayQuote(quote) {
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
        quoteElement.textContent = quote;
    }
}

async function init() {
    await loadQuotes();
    const quote = getRandomQuote();
    displayQuote(quote);
}

document.addEventListener('DOMContentLoaded', init);
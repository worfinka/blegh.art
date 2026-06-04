let quotesArray = [];
let currentTimeout = null;

async function loadQuotes() {
    try {
        const response = await fetch('quotes.json?v=' + Date.now());
        const data = await response.json();
        quotesArray = data.quotes;
        return true;
    } catch (error) {
        console.error('Ошибка загрузки цитат:', error);
        quotesArray = [
            "Сайт скоро откроется...",
            "А пока добавьте цитаты в quotes.json",
            "Формат: строка в массиве \"quotes\""
        ];
        return false;
    }
}

function getRandomQuote() {
    if (!quotesArray.length) return "Нет цитат :(";
    return quotesArray[Math.floor(Math.random() * quotesArray.length)];
}

function displayQuote(quote) {
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.textContent = quote;
            quoteElement.style.opacity = '1';
        }, 150);
    }
}

function updateQuote() {
    const quote = getRandomQuote();
    displayQuote(quote);
}

async function init() {
    await loadQuotes();
    
    const loader = document.querySelector('.quote-loader');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateQuote();
            
            if (loader) {
                loader.style.display = 'block';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        });
    }
    
    updateQuote();
}

document.addEventListener('DOMContentLoaded', init);

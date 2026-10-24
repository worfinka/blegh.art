
const translations = {
    ru: {
        imageCaption: "это я ♡",
        eyebrow: "немного обо мне",
        subtitle: "можешь звать меня Саби",

        ageLabel: "Возраст:",
        ageValue: "16 лет",

        musicLabel: "Музыка:",
        musicValue: "pop & rock",

        hobbiesLabel: "Увлечения:",
        hobbiesValue: "Рисование, мода",

        bornLabel: "Родилась:",
        bornValue: "в России",

        liveLabel: "Сейчас живу:",
        liveValue: "в Испании 🇪🇸",

        animalLabel: "Любимое животное:",
        animalValue: "попугай 🦜",

        stickersButton: "♡ Мои стикеры",
        homeButton: "⌂ Дом Сабины",

        stickerKicker: "маленькая частичка меня",
        stickerTitle: "Стикерпак Сабины",
        stickerDescription:
            "Немного Сабины для твоих повседневных переписок ♡",

        packHeading: "Твоя ежедневная порция Саби ♡",
        packText:
            "Знакомься с Сабиной в Telegram! Милые реакции, разные настроения и немного индивидуальности для твоих чатов.",

        tagOne: "♡ милые реакции",
        tagTwo: "✦ сделано с любовью",

        popularHeading: "Любимые стикеры Саби",
        stickerOne: "привет ♡",
        stickerTwo: "peace!",
        stickerThree: "думает...",

        openPackButton: "Открыть стикерпак ↗",

        homeKicker: "тебе здесь рады",
        homeTitle: "Заходи в гости ♡",
        homeDescription:
            "Маленький уголок интернета, где можно найти Сабину. Буду рада видеть тебя!",

        fanartButton: "♡ Галерея фан-арта — скоро",
        footerNote: "Сделано с любовью."
    },

    en: {
        imageCaption: "that's me ♡",
        eyebrow: "a little introduction",
        subtitle: "you can call me Sabi",

        ageLabel: "Age:",
        ageValue: "16",

        musicLabel: "Music:",
        musicValue: "pop & rock",

        hobbiesLabel: "Hobbies:",
        hobbiesValue: "Drawing, fashion",

        bornLabel: "Born in:",
        bornValue: "Russia",

        liveLabel: "Living in:",
        liveValue: "Spain 🇪🇸",

        animalLabel: "Favourite animal:",
        animalValue: "parrot 🦜",

        stickersButton: "♡ My stickers",
        homeButton: "⌂ Sabina's home",

        stickerKicker: "little pieces of me",
        stickerTitle: "Sabina's sticker pack",
        stickerDescription:
            "A little bit of Sabina for your everyday conversations ♡",

        packHeading: "Your daily dose of Sabi ♡",
        packText:
            "Meet Sabina on Telegram! Cute reactions, little moods and a bit of personality for your chats.",

        tagOne: "♡ cute reactions",
        tagTwo: "✦ made with love",

        popularHeading: "Sabi's favourite stickers",
        stickerOne: "hello ♡",
        stickerTwo: "peace!",
        stickerThree: "thinking...",

        openPackButton: "Get the sticker pack ↗",

        homeKicker: "you are welcome",
        homeTitle: "Come say hi ♡",
        homeDescription:
            "A little corner of the internet where you can find Sabina. Come visit!",

        fanartButton: "♡ Fanart gallery — soon",
        footerNote: "Made with love."
    },

    es: {
        imageCaption: "¡esa soy yo! ♡",
        eyebrow: "un poquito sobre mí",
        subtitle: "puedes llamarme Sabi",

        ageLabel: "Edad:",
        ageValue: "16 años",

        musicLabel: "Música:",
        musicValue: "pop y rock",

        hobbiesLabel: "Aficiones:",
        hobbiesValue: "Dibujo, moda",

        bornLabel: "Nací en:",
        bornValue: "Rusia",

        liveLabel: "Vivo en:",
        liveValue: "España 🇪🇸",

        animalLabel: "Animal favorito:",
        animalValue: "loro 🦜",

        stickersButton: "♡ Mis stickers",
        homeButton: "⌂ La casa de Sabina",

        stickerKicker: "un pedacito de mí",
        stickerTitle: "El pack de stickers de Sabina",
        stickerDescription:
            "Un poquito de Sabina para tus conversaciones del día a día ♡",

        packHeading: "Tu dosis diaria de Sabi ♡",
        packText:
            "¡Conoce a Sabina en Telegram! Reacciones adorables, diferentes estados de ánimo y un toque de personalidad para tus chats.",

        tagOne: "♡ reacciones bonitas",
        tagTwo: "✦ hecho con cariño",

        popularHeading: "Los stickers favoritos de Sabi",
        stickerOne: "hola ♡",
        stickerTwo: "¡peace!",
        stickerThree: "pensando...",

        openPackButton: "Ver el pack de stickers ↗",

        homeKicker: "aquí eres bienvenido",
        homeTitle: "¡Pasa a saludar! ♡",
        homeDescription:
            "Un pequeño rincón de internet donde puedes encontrar a Sabina. ¡Ven a visitarme!",

        fanartButton: "♡ Galería de fanart — pronto",
        footerNote: "Hecho con cariño."
    }
};

const languageButtons = document.querySelectorAll("[data-lang]");
const translatableElements = document.querySelectorAll("[data-i18n]");

function setLanguage(language) {
    if (!translations[language]) {
        language = "ru";
    }

    document.documentElement.lang = language;

    translatableElements.forEach((element) => {
        const key = element.dataset.i18n;
        const translation = translations[language][key];

        if (translation !== undefined) {
            element.textContent = translation;
        }
    });

    languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === language;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    try {
        localStorage.setItem("sabina-language", language);
    } catch {
        // The language switch still works if storage is unavailable.
    }
}

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.lang);
    });
});

// Restore the previously selected language.
let savedLanguage = "ru";

try {
    const storedLanguage = localStorage.getItem("sabina-language");

    if (storedLanguage && translations[storedLanguage]) {
        savedLanguage = storedLanguage;
    }
} catch {
    // Use Russian as the default language.
}

setLanguage(savedLanguage);

// Update the copyright year automatically.
document.querySelector("#year").textContent = new Date().getFullYear();

// Reveal sections gently when they enter the viewport.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

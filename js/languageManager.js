const STORAGE_KEY = 'preferredLanguage';
const DEFAULT_LANG = 'pt';

const translations = {
    pt: {
        placeholder: 'Meu objetivo hoje é...',
        addButton: 'Adicionar',
        selectDate: 'Selecionar Data',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
    },
    en: {
        placeholder: 'My goal today is...',
        addButton: 'Add',
        selectDate: 'Select Date',
        confirm: 'Confirm',
        cancel: 'Cancel'
    }
};

const quotes = {
    pt: [

        {
            text: "A persistência é o caminho do êxito.",
            author: "Charles Chaplin"
        },
    ],
    en: [

        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        },
    ]
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        this.quotes = null;
        this.setupEventListeners();
        this.loadQuotes().then(() => {
            this.applyLanguage(this.currentLang);
        });
    }

    async loadQuotes() {
        try {
            const response = await fetch('/data/quotes.json');
            if (!response.ok) {
                throw new Error('Failed to load quotes');
            }
            this.quotes = await response.json();
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback para quotes padrão em caso de erro
            this.quotes = quotes; // Mantenha alguns quotes padrão no código
        }
    }

    setupEventListeners() {
        const langButton = document.querySelector('.language-toggle');
        if (langButton) {
            langButton.addEventListener('click', () => this.toggleLanguage());
        }
    }

    updateTexts(lang) {
        document.querySelector('.task-input').placeholder = translations[lang].placeholder;
        document.querySelector('.add-task-btn').textContent = translations[lang].addButton;
        document.querySelector('#dateModal h3').textContent = translations[lang].selectDate;
        document.querySelector('#dateModal .confirm-btn').textContent = translations[lang].confirm;
        document.querySelector('#dateModal .cancel-btn').textContent = translations[lang].cancel;
    }

    updateQuote(lang) {
        if (!this.quotes) return; // Aguarda os quotes serem carregados

        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        
        if (!quoteText || !quoteAuthor) return;

        const quotesForLang = this.quotes[lang];
        const randomIndex = Math.floor(Math.random() * quotesForLang.length);
        const selectedQuote = quotesForLang[randomIndex];

        quoteText.style.animation = 'none';
        quoteAuthor.style.animation = 'none';

        void quoteText.offsetWidth;
        void quoteAuthor.offsetWidth;

        quoteText.textContent = `"${selectedQuote.text}"`;
        quoteAuthor.textContent = `- ${selectedQuote.author}`;

        quoteText.style.animation = 'slideUpFade 0.6s ease forwards';
        quoteAuthor.style.animation = 'slideUpFade 0.6s ease forwards 0.2s';
    }

    applyLanguage(lang) {
        const langButton = document.querySelector('.language-toggle');
        if (langButton) {
            langButton.dataset.lang = lang;
        }
        this.currentLang = lang;
        this.updateTexts(lang);
        this.updateQuote(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'pt' ? 'en' : 'pt';
        this.applyLanguage(newLang);
    }
}

export { LanguageManager }; 
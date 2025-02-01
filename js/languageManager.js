const STORAGE_KEY = 'preferredLanguage';
const DEFAULT_LANG = 'en';

const translations = {
    pt: {
        placeholder: '🤓 hoje pretendo...',
        addButton: 'adicionar',
        selectDate: 'selecionar Data',
        confirm: 'confirmar',
        cancel: 'cancelar',
        // Pomodoro translations
        start: 'iniciar',
        pause: 'pausar',
        reset: 'reiniciar',
        work: 'foco',
        break: 'pausa',
        longBreak: 'pausa longa'
    },
    en: {
        placeholder: "🤔 today's goal is...",
        addButton: 'add',
        selectDate: 'select date',
        confirm: 'confirm',
        cancel: 'cancel',
        // Pomodoro translations
        start: 'start',
        pause: 'pause',
        reset: 'reset',
        work: 'work',
        break: 'break',
        longBreak: 'long break'
    },
    es: {
        placeholder: '🧐 hoy me enfocaré en...',
        addButton: 'agregar',
        selectDate: 'elegir fecha',
        confirm: 'confirmar',
        cancel: 'cancelar',
        // Pomodoro translations
        start: 'iniciar',
        pause: 'pausar',
        reset: 'reiniciar',
        work: 'enfoque',
        break: 'descanso',
        longBreak: 'pausa larga'
    }
};

const quotes = {
    pt: [
        {
            text: "a persistência é o caminho do êxito.",
            author: "charles chaplin"
        },
    ],
    en: [
        {
            text: "the secret of getting ahead is getting started.",
            author: "mark twain"
        },
    ],
    es: [
        {
            text: "la persistencia es el camino al éxito.",
            author: "charles chaplin"
        },
    ]
};

class LanguageManager {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
            this.quotes = null;
            this.setupEventListeners();
            this.loadQuotes().then(() => {
                this.applyLanguage(this.currentLang);
            });
        });

    }

    async loadQuotes() {
        try {
            const response = await fetch('./data/quotes.json');
            if (!response.ok) throw new Error('Failed to load quotes');
            this.quotes = await response.json();
            console.log("Quotes loaded:", this.quotes); // Debug
        } catch (error) {
            this.quotes = quotes;
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

        // Atualizar textos do Pomodoro
        const startBtn = document.querySelector('.start-btn');
        const currentText = startBtn.textContent.toLowerCase();
        startBtn.textContent = currentText === translations[lang].pause ? 
            translations[lang].pause : 
            translations[lang].start;
        
        document.querySelector('.reset-btn').textContent = translations[lang].reset;
        document.querySelector('.work-btn').textContent = translations[lang].work;
        document.querySelector('.short-break-btn').textContent = translations[lang].break;
        document.querySelector('.long-break-btn').textContent = translations[lang].longBreak;
        
        // Lógica explícita para tradução do timer-mode (exclusivamente)
        const timerMode = "work";
        if (timerMode) {
            const currentMode = timerMode.textContent.toLowerCase();
            // Mapeia os modos para as chaves de tradução corretas
            const modeMap = {
                'work': 'work',
                'break': 'break',
                'long break': 'longBreak'
            };
            
            const translationKey = modeMap[currentMode];
            if (translationKey) {
                timerMode.textContent = translations[lang][translationKey];
            }
        }
    }

    updateQuote(lang) {
        if (!this.quotes || !this.quotes[lang] || this.quotes[lang].length === 0) {
            console.error(`No quotes found for language: ${lang}`);
            return;
        }

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
            
            langButton.querySelectorAll('.flag').forEach(flag => {
                flag.removeAttribute('style');
            });
        }
    
        // Se as quotes ainda não foram carregadas, tentar novamente após 100ms
        if (!this.quotes) {
            setTimeout(() => this.applyLanguage(lang), 100);
            return;
        }
    
        this.currentLang = lang;
        this.updateQuote(lang);
        this.updateTexts(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    }    

    toggleLanguage() {
        const languages = ['pt', 'en', 'es'];
        const currentIndex = languages.indexOf(this.currentLang);
        const newLang = languages[(currentIndex + 1) % languages.length];
        this.applyLanguage(newLang);
    }
}

export { LanguageManager }; 
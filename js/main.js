import { LanguageManager } from './languageManager.js';
import { PomodoroTimer } from './pomodoro.js';
import { TaskManager } from './taskManager.js';

// Função para inicializar as animações
function initializeAnimations() {
    const pomodoroSection = document.querySelector('.pomodoro-section');
    const taskBoard = document.querySelector('.task-board');
    
    requestAnimationFrame(() => {
        pomodoroSection?.classList.add('fade-in');
        taskBoard?.classList.add('fade-in');
    });
}

// Função principal de inicialização
function initialize() {
    const taskManager = new TaskManager();
    const pomodoro = new PomodoroTimer();
    const languageManager = new LanguageManager();

    initializeAnimations();

    // Solicitar permissão para notificações
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// Inicializa o aplicativo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
} 
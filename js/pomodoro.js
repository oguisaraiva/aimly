class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60;
        this.isRunning = false;
        this.timerInterval = null;
        this.mode = 'work';
        this.cycles = 0;

        this.times = {
            work: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 15 * 60
        };

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.timeDisplay = document.querySelector('.time');
        this.modeDisplay = document.querySelector('.timer-mode');
        this.startBtn = document.querySelector('.start-btn');
        this.resetBtn = document.querySelector('.reset-btn');
        this.modeButtons = document.querySelectorAll('.mode-btn');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMode(e.target));
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.handleTimerComplete();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.times[this.mode];
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    changeMode(button) {
        const modes = {
            'work-btn': 'work',
            'short-break-btn': 'shortBreak',
            'long-break-btn': 'longBreak'
        };

        this.mode = modes[button.className.split(' ')[1]];
        this.timeLeft = this.times[this.mode];
        this.modeDisplay.textContent = this.mode.replace(/([A-Z])/g, ' $1').toLowerCase();

        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        this.resetTimer();
    }

    handleTimerComplete() {
        this.pauseTimer();
        this.playNotification();

        if (this.mode === 'work') {
            this.cycles++;
            if (this.cycles % 4 === 0) {
                document.querySelector('.long-break-btn').click();
            } else {
                document.querySelector('.short-break-btn').click();
            }
        } else {
            document.querySelector('.work-btn').click();
        }
    }

    playNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: `${this.mode} session completed!`
            });
        }
    }
}

export { PomodoroTimer }; 
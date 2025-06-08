const WORK_TIME = 25 * 60; // 25分
const BREAK_TIME = 5 * 60; // 5分

let timer = WORK_TIME;
let interval = null;
let isWork = true;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
    const min = String(Math.floor(timer / 60)).padStart(2, '0');
    const sec = String(timer % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
    statusDisplay.textContent = isWork ? '作業中' : '休憩中';
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            updateDisplay();
        } else {
            clearInterval(interval);
            isRunning = false;
            isWork = !isWork;
            timer = isWork ? WORK_TIME : BREAK_TIME;
            updateDisplay();
            // 音や通知など追加可能
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    timer = isWork ? WORK_TIME : BREAK_TIME;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();

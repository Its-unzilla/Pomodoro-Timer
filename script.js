// Constants for durations (in seconds)
const WORK_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const POMODOROS_BEFORE_LONG_BREAK = 4;

// State variables
let timer = null;
let remainingTime = WORK_DURATION;
let isRunning = false;
let isWorkSession = true;
let completedPomodoros = 0;

// DOM elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const sessionTypeEl = document.getElementById('session-type');
const sessionCountEl = document.getElementById('session-count');
const alarmSound = document.getElementById('alarm-sound');
const container = document.querySelector('.container');
const body = document.body;

// Format seconds into MM:SS
function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

// Update the timer display
function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingTime);
}

// Start the timer
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timer = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime <= 0) {
      clearInterval(timer);
      isRunning = false;
      alarmSound.play();
      handleSessionEnd();
    }
  }, 1000);
}



// Pause the timer
function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}



// Reset the timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  remainingTime = WORK_DURATION;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  sessionTypeEl.textContent = 'Work';
  updateDisplay();
  updateSessionStyles('Work');
}

// Handle session transitions
function handleSessionEnd() {
  if (isWorkSession) {
    completedPomodoros++;
    sessionCountEl.textContent = completedPomodoros;

    if (completedPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0) {
      remainingTime = LONG_BREAK_DURATION;
      sessionTypeEl.textContent = 'Long Break';
      isWorkSession = false;
      updateSessionStyles('Long Break');
    } else {
      remainingTime = SHORT_BREAK_DURATION;
      sessionTypeEl.textContent = 'Short Break';
      isWorkSession = false;
      updateSessionStyles('Short Break');
    }
  } else {
    remainingTime = WORK_DURATION;
    sessionTypeEl.textContent = 'Work';
    isWorkSession = true;
    updateSessionStyles('Work');
  }

  updateDisplay();
  startTimer();
}



// Apply background and styles based on session type
function updateSessionStyles(sessionType) {
  body.classList.remove('work', 'short-break', 'long-break');
  container.classList.remove('work', 'short-break', 'long-break');

  switch (sessionType) {
    case 'Work':
      body.classList.add('work');
      container.classList.add('work');
      break;
    case 'Short Break':
      body.classList.add('short-break');
      container.classList.add('short-break');
      break;
    case 'Long Break':
      body.classList.add('long-break');
      container.classList.add('long-break');
      break;
  }
}







// Initial setup
updateDisplay();
updateSessionStyles('Work');

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

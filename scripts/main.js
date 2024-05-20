const modeButtonsContainer = document.querySelector('.pomodoro__mode-buttons');
const timerMinutes = document.querySelector('.timer__minutes');
const timerSeconds = document.querySelector('.timer__seconds');
const mainButton = document.querySelector('.pomodoro__main-button');
const mainButtonClue = mainButton.querySelector('span');
const resetButton = document.querySelector('.pomodoro__reset-button');
const form = document.querySelector('.settings__form');
const fields = form.querySelectorAll('.settings__field');
const settingsButton = document.querySelector('.settings__button');
const progress = document.querySelector('.pomodoro__progress');
const counter = document.querySelector('.result__text');

// Аудиофайлы
const buttonSound = new Audio('sounds/click.mp3');
const timerSound = new Audio('sounds/level-up.mp3');

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 30,
  longBreakInterval: 5,
  sessions: 0,
};

let interval;
let currentMode = 'pomodoro';

// Запускает таймер
function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  if (timer.mode === 'pomodoro') timer.sessions++;

  mainButton.dataset.action = 'stop';
  mainButtonClue.textContent = 'Остановить';
  mainButton.classList.add('pomodoro__main-button--active');

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case 'pomodoro':
          counter.textContent = timer.sessions;

          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode('longBreak');
          } else {
            switchMode('shortBreak');
          }
          break;
        default:
          switchMode('pomodoro');
      }

      timerSound.play();
      stopTimer();
    }
  }, 1000);
};

// Останавливает таймер
function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButtonClue.textContent = 'Запустить';
  mainButton.classList.remove('pomodoro__main-button--active');
}

// Вычисляет значения прошедшего времени
function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
};

// Обновляет значения таймера
function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  timerMinutes.textContent = minutes;
  timerSeconds.textContent = seconds;

  const clue = timer.mode === 'pomodoro' ? 'Пора вернуться к работе' : 'Время перерыва';
  document.title = `${minutes}:${seconds} — ${clue}`;

  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
};

// Задаёт режим для таймера
function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  // Задаёт активный класс нажатой кнопке
  document
    .querySelectorAll('button[data-mode]')
    .forEach((button) => button.classList.remove('pomodoro__button--active'));
  document
    .querySelector(`[data-mode="${mode}"]`)
    .classList.add('pomodoro__button--active');

  // Задаёт активный цвет страницы
  document.body.style.setProperty('--current-color', `var(--${mode})`);

  progress.setAttribute('max', timer.remainingTime.total);

  updateClock();
};

// Обработчик клика по контейнеру кнопок
function onModeButtonsContainerClick(event) {
  buttonSound.play();
  const { mode } = event.target.dataset;
  currentMode = mode;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
};

modeButtonsContainer.addEventListener('click', onModeButtonsContainerClick);

mainButton.addEventListener('click', () => {
  buttonSound.play();
  const { action } = mainButton.dataset;

  if (action === 'start') {
    startTimer()
  } else {
    stopTimer();
  }
});

resetButton.addEventListener('click', () => {
  buttonSound.play();
  timer.sessions = 0;
  counter.textContent = timer.sessions;
});

document.addEventListener('DOMContentLoaded', () => {
  switchMode('pomodoro');
});

settingsButton.addEventListener('click', () => {
  fields.forEach((field) => {
    const setting = field.id;
    timer[setting] = field.value;
  });

  switchMode(currentMode);
});

const modal = document.querySelector('.pomodoro__settings');
const showButton = document.querySelector('.pomodoro__settings-button');
const closeButton = modal.querySelector('.settings__close-button');

showButton.addEventListener('click', () => {
  modal.showModal();
});

closeButton.addEventListener('click', () => {
  modal.close();
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const durationForm = document.querySelector('.duration-form');
  const strengthForm = document.querySelector('.strength-form');

  if (durationForm) {
    const list = document.getElementById(durationForm.id.replace('Form', 'RoutineList'));
    const storageKey = durationForm.id;
    loadFromStorage(storageKey, list, 'duration');
    durationForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = durationForm.querySelectorAll('input');
      const routine = {
        interval: inputs[0].value,
        pace: inputs[1].value,
        total: inputs[2].value
      };
      appendDurationEntry(list, routine);
      saveToStorage(storageKey, routine);
      durationForm.reset();
    });
  }

  if (strengthForm) {
    const list = document.getElementById(strengthForm.id.replace('Form', 'RoutineList'));
    const storageKey = strengthForm.id;
    loadFromStorage(storageKey, list, 'strength');
    strengthForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = strengthForm.querySelectorAll('input');
      const routine = {
        name: inputs[0].value,
        reps: inputs[1].value,
        link: inputs[2].value
      };
      appendStrengthEntry(list, routine);
      saveToStorage(storageKey, routine);
      strengthForm.reset();
    });
  }
});

function appendDurationEntry(list, { interval, pace, total }) {
  const div = document.createElement('div');
  div.className = 'routine-entry';
  div.textContent = `Interval: ${interval} min, Pace: ${pace}, Total: ${total} min`;
  list.appendChild(div);
}

function appendStrengthEntry(list, { name, reps, link }) {
  const div = document.createElement('div');
  div.className = 'routine-entry';
  div.innerHTML = `${name} - ${reps} reps <a href="${link}" target="_blank">demo</a>`;
  list.appendChild(div);
}

function saveToStorage(key, routine) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(routine);
  localStorage.setItem(key, JSON.stringify(arr));
}

function loadFromStorage(key, list, type) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.forEach(r => {
    type === 'duration' ? appendDurationEntry(list, r) : appendStrengthEntry(list, r);
  });
}

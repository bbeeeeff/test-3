// Enhanced routine builder allowing multiple steps per routine

document.addEventListener('DOMContentLoaded', () => {
  setupRoutineForm('.duration-form', 'duration');
  setupRoutineForm('.strength-form', 'strength');
});

function setupRoutineForm(selector, type) {
  const form = document.querySelector(selector);
  if (!form) return;

  const list = document.getElementById(form.id.replace('Form', 'RoutineList'));
  const storageKey = form.id;

  loadFromStorage(storageKey, list, type);

  const titleInput = form.querySelector('.routine-title');
  const stepsContainer = form.querySelector('.steps');
  const addStepBtn = form.querySelector('.add-step');

  addStepBtn.addEventListener('click', () => {
    const step = stepsContainer.firstElementChild.cloneNode(true);
    step.querySelectorAll('input').forEach(i => i.value = '');
    stepsContainer.appendChild(step);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value;
    const steps = [...stepsContainer.querySelectorAll('.step')].map(step => {
      const inputs = step.querySelectorAll('input');
      if (type === 'duration') {
        return {
          interval: inputs[0].value,
          pace: inputs[1].value,
          total: inputs[2].value
        };
      } else {
        return {
          name: inputs[0].value,
          reps: inputs[1].value,
          link: inputs[2].value
        };
      }
    });

    const routine = { title, steps };

    if (type === 'duration') {
      appendDurationRoutine(list, routine);
    } else {
      appendStrengthRoutine(list, routine);
    }

    saveToStorage(storageKey, routine);

    while (stepsContainer.children.length > 1) {
      stepsContainer.removeChild(stepsContainer.lastElementChild);
    }
    stepsContainer.querySelectorAll('input').forEach(i => i.value = '');
    titleInput.value = '';
  });
}

function appendDurationRoutine(list, routine) {
  const div = document.createElement('div');
  div.className = 'routine-entry';
  const steps = Array.isArray(routine) ? routine : routine.steps;
  const title = Array.isArray(routine) ? '' : routine.title;
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title;
    div.appendChild(h3);
  }
  const ol = document.createElement('ol');
  steps.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `Interval: ${s.interval} min, Pace: ${s.pace}, Total: ${s.total} min`;
    ol.appendChild(li);
  });
  div.appendChild(ol);
  list.appendChild(div);
}

function appendStrengthRoutine(list, routine) {
  const div = document.createElement('div');
  div.className = 'routine-entry';
  const steps = Array.isArray(routine) ? routine : routine.steps;
  const title = Array.isArray(routine) ? '' : routine.title;
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title;
    div.appendChild(h3);
  }
  const ol = document.createElement('ol');
  steps.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `${s.name} - ${s.reps} reps <a href="${s.link}" target="_blank">demo</a>`;
    ol.appendChild(li);
  });
  div.appendChild(ol);
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
    type === 'duration' ? appendDurationRoutine(list, r) : appendStrengthRoutine(list, r);
  });
}

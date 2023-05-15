import arrow from '../arrow-key.svg';
import dots from '../dots.svg';
import trash from '../trash.svg';
import updateCheckbox, { updateOnload } from './interaction.js';

// selecting the container
const container = document.querySelector('.container');

// selecting the input container
const inputSection = document.querySelector('.inputSection');

// selecting the input field
const inputField = document.getElementById('inputField');

// local storage
const inputStorage = JSON.parse(localStorage.getItem('inputdata')) || {};
inputField.value = inputStorage.inputField || '';

const inputSave = () => {
  inputStorage.inputField = inputField.value;

  localStorage.setItem('inputdata', JSON.stringify(inputStorage));
};

const clearInput = () => {
  inputStorage.inputField = '';

  localStorage.setItem('inputdata', JSON.stringify(inputStorage));
};

// attach an event listener to the input field to listen for changes
inputField.addEventListener('input', inputSave);

// selecting the arrow for entry
const arrowHolder = document.createElement('img');
arrowHolder.classList.add('arrow');
arrowHolder.src = arrow;

inputSection.append(inputField, arrowHolder);

// implementing list functionality

// local storage for array
let taskHolder = JSON.parse(localStorage.getItem('taskList')) || [];

const bookSave = () => {
  localStorage.setItem('taskList', JSON.stringify(taskHolder));
};

class Task {
  constructor(description) {
    this.index = taskHolder.length;
    this.description = description;
    this.completed = false;
  }
}

const taskCreator = () => {
  const newTask = new Task(inputField.value);
  taskHolder.push(newTask);
  inputField.value = '';
};

// selecting the button
const button = document.querySelector('.clearAll');

// create the dom elements to support the array
const taskSection = document.createElement('section');
taskSection.classList.add('taskSection');
container.append(taskSection);
container.insertBefore(taskSection, button);
const tasklist = document.createElement('ul');
tasklist.classList.add('tasklist');
taskSection.append(tasklist);

const addToDom = () => {
  // Clear the list
  tasklist.innerHTML = '';

  taskHolder.forEach((instance) => {
    const { index, description, completed } = instance;

    const taskListItem = document.createElement('li');
    taskListItem.classList.add('listInstance');
    taskListItem.setAttribute('data-index', index);
    taskListItem.innerHTML = `
      <input type="checkbox" name="${index}" id="${index}" class='checkbox' data-index='${index}'>
      <span class='descriptionText' data-index='${index}'>${description}</span>
      <img src=${dots} class='threedots'data-index='${index}'>
      <img src=${trash} class='trash' data-index='${index}'>
      `;
    tasklist.append(taskListItem);
    const listStruc = document.querySelectorAll('.listInstance');
    listStruc.forEach((inst) => {
      // edit description
      const descriptionTexts = inst.querySelectorAll('.descriptionText[data-index]');
      descriptionTexts.forEach((span) => {
        span.addEventListener('click', () => {
          const input = document.createElement('input');
          input.classList.add('input-2');
          input.type = 'text';
          input.value = span.innerText;

          input.addEventListener('blur', () => {
            span.innerText = input.value;
            instance.description = input.value;
            setTimeout(() => {
              input.replaceWith(span);
            }, 0);
            localStorage.setItem('taskList', JSON.stringify(taskHolder));
          });

          input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              span.innerText = input.value;
              instance.description = input.value;
              setTimeout(() => {
                input.replaceWith(span);
              }, 0);
            }
            localStorage.setItem('taskList', JSON.stringify(taskHolder));
          });
          span.replaceWith(input);
          input.focus();
        });
        localStorage.setItem('taskList', JSON.stringify(taskHolder));
      });
    });
    bookSave();
    updateOnload();
    updateCheckbox();
  });
};

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !(inputField.value === '')) {
    taskCreator();
    addToDom();
    clearInput();
  }
});

arrowHolder.addEventListener('click', () => {
  if (!(inputField.value === '')) {
    taskCreator();
    addToDom();
    clearInput();
  }
});

// render list-section dynamically when page loads
window.addEventListener('load', () => {
  addToDom();
});

const listRefresher = () => {
  taskHolder.forEach((item, index) => {
    item.index = index;
  });
  localStorage.setItem('taskList', JSON.stringify(taskHolder));
};

const handleDeleteClick = (event) => {
  const listItem = event.target.closest('li');
  const listItemIndex = parseInt(listItem.dataset.index, 10);

  let indexInTaskHolder = -1;
  taskHolder.forEach((task, index) => {
    if (task.index === listItemIndex) {
      indexInTaskHolder = index;
    } else if (index > indexInTaskHolder) {
      // eslint-disable-next-line no-plusplus
      task.index--;
    }
  });

  if (indexInTaskHolder !== -1) {
    taskHolder.splice(indexInTaskHolder, 1);
    localStorage.setItem('taskList', JSON.stringify(taskHolder));
    listRefresher();
    listItem.remove();
  } else if (indexInTaskHolder === 0) {
    taskHolder = [];
    localStorage.setItem('taskList', JSON.stringify(taskHolder));
    listRefresher();
    listItem.remove();
  }
  location.reload();
};

const handleDotClick = (event) => {
  const dot = event.target;
  const listItem = dot.closest('li');
  const deleteButton = listItem.querySelector('.trash');
  deleteButton.style.display = 'block';
  dot.style.display = 'none';
};

document.addEventListener('click', (event) => {
  const isDot = event.target.classList.contains('threedots');
  const isTrash = event.target.classList.contains('trash');
  if (isDot) {
    handleDotClick(event);
  } else if (isTrash) {
    handleDeleteClick(event);
    // listRefresher();
  }
});

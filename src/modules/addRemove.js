import arrow from '../arrow-key.svg';
import dots from '../dots.svg';
import trash from '../trash.svg';
import updateCheckbox, { updateOnload } from './interaction.js';

// selecting and creating materials
const container = document.querySelector('.container');
const inputSection = document.querySelector('.inputSection');
const inputField = document.getElementById('inputField');
const arrowHolder = document.createElement('img');
arrowHolder.classList.add('arrow');
arrowHolder.src = arrow;
inputSection.append(inputField, arrowHolder);
let taskHolder = JSON.parse(localStorage.getItem('taskList')) || [];
const button = document.querySelector('.clearAll');
const taskSection = document.createElement('section');
taskSection.classList.add('taskSection');
container.append(taskSection);
container.insertBefore(taskSection, button);
const tasklist = document.createElement('ul');
tasklist.classList.add('tasklist');
taskSection.append(tasklist);

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

//attach event listener for input field.
inputField.addEventListener('input', inputSave);

const bookSave = () => {
  localStorage.setItem('taskList', JSON.stringify(taskHolder));
};

const taskCreator = () => {
  const newTask = {
    index: taskHolder.length,
    description: inputField.value,
    completed: false,
  };
  taskHolder.push(newTask);
  inputField.value = '';
};

const addToDom = () => {
  // Clear the list
  tasklist.innerHTML = '';

  taskHolder.forEach((instance) => {
    const { index, description } = instance;

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

    const descriptionTexts = taskListItem.querySelectorAll('.descriptionText[data-index]');
    descriptionTexts.forEach((span) => {
      span.addEventListener('click', () => {
        const input = document.createElement('input');
        input.classList.add('input-2');
        input.type = 'text';
        input.value = span.innerText;

        const onBlur = () => {
          span.innerText = input.value;
          instance.description = input.value;
          input.replaceWith(span);
          localStorage.setItem('taskList', JSON.stringify(taskHolder));
        };

        const onKeyDown = (event) => {
          if (event.key === 'Enter') {
            onBlur();
          }
          localStorage.setItem('taskList', JSON.stringify(taskHolder));
        };

        input.addEventListener('blur', onBlur);
        input.addEventListener('keydown', onKeyDown);

        span.replaceWith(input);
        input.focus();
      });

      localStorage.setItem('taskList', JSON.stringify(taskHolder));
    });
  });

  localStorage.setItem('taskList', JSON.stringify(taskHolder));
  updateOnload();
  updateCheckbox();
}

const listRefresher = () => {
  taskHolder.forEach((item, index) => {
    item.index = index;
  });
  localStorage.setItem('taskList', JSON.stringify(taskHolder));
};

const handleDeleteClick = (event) => {
  const listItem = event.target.closest('li');
  const listItemIndex = parseInt(listItem.dataset.index, 10);

  const indexInTaskHolder = taskHolder.findIndex((task) => task.index === listItemIndex);

  if (indexInTaskHolder !== -1) {
    taskHolder.splice(indexInTaskHolder, 1);
    listRefresher();
    listItem.remove();
  } else if (indexInTaskHolder === 0) {
    taskHolder.length = 0;
    listRefresher();
    listItem.remove();
  }
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
  }
});

const inputSaveAndClear = () => {
  inputSave();
  clearInput();
};

const handleInputFieldEnter = (event) => {
  if (event.key === 'Enter' && inputField.value.trim() !== '') {
    taskCreator();
    addToDom();
    inputSaveAndClear();
  }
};

const handleArrowHolderClick = () => {
  if (inputField.value.trim() !== '') {
    taskCreator();
    addToDom();
    inputSaveAndClear();
  }
};

inputField.addEventListener('input', inputSave);
inputField.addEventListener('keydown', handleInputFieldEnter);
arrowHolder.addEventListener('click', handleArrowHolderClick);

const init = () => {
  inputField.value = inputStorage.inputField;
  taskSection.classList.add('taskSection');
  container.insertBefore(taskSection, button);
  taskSection.append(tasklist);
  window.addEventListener('load', addToDom);
};

init();



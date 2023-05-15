let taskHolder = JSON.parse(localStorage.getItem('taskList')) || [];

const bookSave = () => {
  localStorage.setItem('taskList', JSON.stringify(taskHolder));
};

// checkbox function
const updateCheckbox = () => {
  const checkboxes = document.querySelectorAll('.checkbox');

  checkboxes.forEach((box) => {
    box.addEventListener('change', (event) => {
      const checker = event.target;
      const spanCheck = box.nextElementSibling;

      // acessing the taskholder for changes
      const boxId = parseInt(box.dataset.index, 10);
      taskHolder = JSON.parse(localStorage.getItem('taskList')) || [];

      // edge cases
      if (checker.checked) {
        // add the styles
        spanCheck.classList.add('checked');
        spanCheck.classList.remove('descriptionText');
        box.setAttribute('autocomplete', 'on');
        taskHolder[boxId].completed = true;
        bookSave();
      } else {
        spanCheck.classList.remove('checked');
        spanCheck.classList.add('descriptionText');
        taskHolder[boxId].completed = false;
        bookSave();
      }
    });
  });
};

const updateOnload = () => {
  const checkboxes = document.querySelectorAll('.checkbox');
  taskHolder = JSON.parse(localStorage.getItem('taskList')) || [];

  checkboxes.forEach((box) => {
    const boxId = parseInt(box.dataset.index, 10);
    const spanCheck = box.nextElementSibling;

    if (taskHolder[boxId].completed) {
      spanCheck.classList.add('checked');
      spanCheck.classList.remove('descriptionText');
      box.checked = true;
    } else {
      spanCheck.classList.remove('checked');
      spanCheck.classList.add('descriptionText');
      box.checked = false;
    }
  });
};

// delete button
const bottomButton = document.querySelector('.clearAll');

const deleteTrue = () => {
  if (taskHolder.length === 0) {
    taskHolder = [];
  } else {
    taskHolder = taskHolder.filter((instance) => !instance.completed);

    // update the array after deleting
    const updateIndices = () => {
      taskHolder.forEach((item, index) => {
        item.index = index;
        const checkbox = document.querySelector(`.checkbox[data-index="${index}"]`);
        checkbox.setAttribute('data-index', index);
      });
      localStorage.setItem('taskList', JSON.stringify(taskHolder));
    };

    updateIndices();

    location.reload();
  }
};

bottomButton.addEventListener('click', deleteTrue);
window.addEventListener('load', updateOnload);

export default updateCheckbox;
export { updateOnload };
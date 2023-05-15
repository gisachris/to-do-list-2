import _ from 'lodash';
import './style.css';
import refreshImage from './refresh.png';
import * as functionality from './modules/addRemove.js';
import * as interactions from './modules/interaction.js';

// selecting the header section
const headerSection = document.querySelector('.header');

// making the refresh button image
const refresh = document.createElement('img');
refresh.classList.add('refreshButton');
refresh.src = refreshImage;

headerSection.append(refresh);

const refreshButton = document.querySelector('.refreshButton');
refreshButton.addEventListener('click', () => {
  if (refreshButton.classList.contains('rotate')) {
    refreshButton.classList.toggle('rotate');
    refreshButton.classList.add('rotateBack');
  } else if (refreshButton.classList.contains('rotateBack')) {
    refreshButton.classList.toggle('rotateBack');
    refreshButton.classList.add('rotate');
  } else {
    refreshButton.classList.add('rotate');
  }
});

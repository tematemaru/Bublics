import toggleScroll from './utils/toggleScroll';
import validateEmail from './utils/validation';
import { keyCodes } from './constants/constants';

function handleAndroidAppLinkClick(e) {
  e.preventDefault();

  const modal = document.querySelector('.js-modal');

  toggleScroll(true);
  modal.classList.remove('modal__invisible');
  modal.classList.add('modal__visible');
}

function clearInput() {
  const input = document.querySelector('.js-modal--input');
  const errorMessage = document.querySelector('.js-modal--input-error');

  input.classList.remove('modal--input__invalid');
  errorMessage.classList.remove('modal--input-error__visible');
  input.value = '';
}

function handleCloseBtnClick() {
  const modal = document.querySelector('.js-modal');

  toggleScroll(false);
  modal.classList.remove('modal__visible');
  modal.classList.add('modal__invisible');
  setTimeout(clearInput, 300);
}

function validate() {
  const input = document.querySelector('.js-modal--input');
  const errorMessage = document.querySelector('.js-modal--input-error');
  const isValidEmail = validateEmail(input.value);

  if (!isValidEmail) {
    input.classList.add('modal--input__invalid');
    errorMessage.classList.add('modal--input-error__visible');
  } else {
    input.classList.remove('modal--input__invalid');
    errorMessage.classList.remove('modal--input-error__visible');
  }
}

function handleSubmitClick() {
  validate();
}

function handleBlur() {
  validate();
}

function handleKeyPress(e) {
  if (e.keyCode === keyCodes.ENTER) validate();
}

function addEventListeners() {
  const androidAppLink = document.querySelector(
    '.js-main--app-box__android-link'
  );
  const closeModalBtn = document.querySelector('.js-modal--button__close');
  const submitModalBtn = document.querySelector('.js-modal--button__submit');
  const input = document.querySelector('.js-modal--input');
  androidAppLink.addEventListener('click', handleAndroidAppLinkClick, false);
  closeModalBtn.addEventListener('click', handleCloseBtnClick, false);
  submitModalBtn.addEventListener('click', handleSubmitClick, false);
  input.addEventListener('blur', handleBlur, false);
  input.addEventListener('keypress', handleKeyPress, false);
}

function handleVideoHover() {
  const videosContainer = document.querySelector('.js-videos-container');
  const videos = videosContainer.getElementsByClassName('js-post--video');

  for (let i = 0; i < videos.length; i += 1) {
    videos[i].addEventListener('mouseover', () => {
      videos[i].play();
    });
    videos[i].addEventListener('mouseleave', () => {
      videos[i].pause();
    });
  }
}

export default () => {
  addEventListeners();
  handleVideoHover();
};

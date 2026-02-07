import './general-header.js';

document.querySelector('.js-send-message-btn')
  .addEventListener('click', () => {
    const nameInput = document.querySelector('.js-name-input');
    const emailInput = document.querySelector('.js-email-input');
    const subjectInput = document.querySelector('.js-subject-input');
    const messageTextarea = document.querySelector('.js-message-textarea');

    const messageSection = document.querySelector('.js-message-section');

    const nameError = document.querySelector('.js-name-error');
    const emailError = document.querySelector('.js-email-error');
    const messageError = document.querySelector('.js-message-error');

    let validName = false;
    let validEmail = false;
    let validMessage = false;

    //  Regex: at least two words, letters only, separated by one space
    const fullNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;

    if (fullNameRegex.test(nameInput.value.trim())) {
      validName = true;
      nameError.classList.remove('visible');
    } else {
      validName = false;
      nameError.classList.add('visible');
    }

    if (!emailInput.checkValidity() || emailInput.value === '') {
      validEmail = false;
      nameInput.classList.add('second-space');
      emailError.classList.add('visible');
    } else {
      validEmail = true;
      emailError.classList.remove('visible');
      nameInput.classList.remove('second-space');
    }

    if (!validEmail || !validName) {
      messageSection.classList.add('tall');
    } else {
      messageSection.classList.remove('tall');
    }

    if ((!validEmail && validName) && window.innerWidth < 581) {
      messageSection.classList.remove('tall');
    }

    if (messageTextarea.value === '') {
      validMessage = false;
      subjectInput.style['margin-bottom'] = '42px';
      document.querySelector('.js-message-title').style.top = '74px';
      messageError.classList.add('visible');
    } else {
      validMessage = true
      messageError.classList.remove('visible');
      subjectInput.style['margin-bottom'] = '20px';
      document.querySelector('.js-message-title').style.top = '55px';
    }

    if ((validEmail && validName) && validMessage) {
      document.querySelectorAll('.js-message-section input').forEach((input) => {
        input.value = '';
      });
      document.querySelector('.js-message-section textarea').value = '';
      document.querySelector('.js-success-sending').classList.add('visible');
    }
    console.log(validName, validEmail, validMessage);
  });

document.querySelector('.js-remove-message-button')
  .addEventListener('click', () => {
    document.querySelector('.js-success-sending').classList.remove('visible');
  });
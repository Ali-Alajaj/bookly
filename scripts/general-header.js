let userMenuIsShowing = false;

document.querySelectorAll('.js-profile-btn')
  .forEach((button) => {
    button.addEventListener('click', () => {
      if (!userMenuIsShowing) {
        userMenuIsShowing = true;
        document.querySelector('.js-user-menu')
          .classList.add('user-menu-drop-down');
      } else {
        removeUserMenu();
      }
    });
  });

document.querySelector('.js-x-symbol')
  .addEventListener('click', () => {
    removeUserMenu();
  });

function removeUserMenu() {
  userMenuIsShowing = false;
  document.querySelector('.js-user-menu')
    .classList.remove('user-menu-drop-down');
}

let dropdown = false;

document.querySelector('.js-hamburger-menu-btn')
  .addEventListener('click', () => {
    if (!dropdown) {
      dropdown = true;
      document.querySelector('.js-mobile-header-menu')
        .classList.add('mobile-header-drop-down');
    } else {
      dropdown = false;
      document.querySelector('.js-mobile-header-menu')
        .classList.remove('mobile-header-drop-down');
    }
  })
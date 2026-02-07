import './general-header.js';

document.querySelector('.js-browse-hotels-btn')
  .addEventListener('click', () => {
    window.location.href = 'browse.html';
  })

document.querySelectorAll('.js-view-details-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const propertyId = button.dataset.propertyId;
    window.location.href = `property-details.html?id=${propertyId}`;
  });
});
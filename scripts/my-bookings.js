import {getPropertieDetails, loadProperties} from '../data/properties.js';
import {bookedProperties} from '../data/booking-data.js';
import '../scripts/general-header.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

loadProperties().then(() => {
  let bookedPropertiesHtml = '';

  bookedProperties.forEach((property) => {
    const bookingDateFormat = dayjs(property.bookingDate * 1000).format('MMMM D, YYYY');
    const checkinDateFormat = dayjs(property.checkinDate).format('MMMM D, YYYY');
    const checkoutDateFormat = dayjs(property.checkoutDate).format('MMMM D, YYYY');
    const propertyDetails = getPropertieDetails(property.propertyId);

    bookedPropertiesHtml += `
    <section>
      <div class="card-header">
        <div class="card-header-left-section">
          <div class="booking-date">
            <p class="info-title">Booking Date:</p>
            <p>${bookingDateFormat}</p>
          </div>

          <div class="card-checkin">
            <p class="info-title">Check-in:</p>
            <p>${checkinDateFormat}</p>
          </div>

          <div class="card-checkout">
            <p class="info-title">Check-out:</p>
            <p>${checkoutDateFormat}</p>
          </div>
        </div>

        <div class="card-header-right-section">
          <div>
            <p class="info-title">Booking ID:</p>
            <p class="booking-id">${property.bookingId}</p>
          </div>
        </div>
      </div>

      <div class="card-main">
        <div class="card-main-left-section">
          <img class="property-thumbnail" src="${propertyDetails.image}">
        </div>
        <div class="card-main-right-section">
          <div>
            <p><span>Status: </span>Confirmed ✅</p>
            <p><span>Name: </span>${propertyDetails.name}</p>
            <p><span>Location: </span>${propertyDetails.location}</p>
          </div>
          <div class="card-button-section">
            <button class="js-view-details-button" data-booking-id="${property.bookingId}">View Booking Details</button>
          </div>
        </div>
      </div>
    </section>
    `;
  });
  
  document.querySelector('main').innerHTML = bookedPropertiesHtml;

  document.querySelectorAll('.js-view-details-button').forEach((button) => {
    button.addEventListener('click', () => {
      const bookingId = button.dataset.bookingId;
      window.location.href = `booking-success.html?bookingId=${bookingId}`;
    });
  });
});
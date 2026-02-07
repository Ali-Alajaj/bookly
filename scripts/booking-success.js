import {loadProperties, getPropertieDetails} from '../data/properties.js';
import {bookedProperties} from '../data/booking-data.js';
import './general-header.js'
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

loadProperties().then(() => {
  const url = new URL(window.location.href);
  const bookingId = url.searchParams.get('bookingId');
  if (!bookingId) {window.location.href = 'index.html'};

  let bookedPropertyDetails;
  bookedProperties.forEach((property) => {
    if (property.bookingId === bookingId) {
      bookedPropertyDetails = property;
    }
  });

  if (!bookedPropertyDetails) {window.location.href = 'index.html'}

  const propertyDetails = getPropertieDetails(bookedPropertyDetails.propertyId);

  const html = `
  <div class="success-message-section">
    <p class="confirmed">Booking Confirmed! &check;</p>
    <p class="completed">Your reservation is successfully completed</p>
    <img class="checkmark-icon" src="images/icons/checkmark-icon.png">
  </div>
  <section class="booking-summary-section">
    <div class="section-title">Booking Summary</div>
    <div class="section-card">
      <p>Property: <span>${propertyDetails.name}</span></p>
      <p>Location: <span>${propertyDetails.location}</span></p>
      <p>Check-in: <span>${dayjs(bookedPropertyDetails.checkinDate).format('MMM D, YYYY')}</span></p>
      <p>Check-out: <span>${dayjs(bookedPropertyDetails.checkoutDate).format('MMM D, YYYY')}</span></p>
      <p>Booking Date: <span>${dayjs(bookedPropertyDetails.bookingDate * 1000).format('MMM D, YYYY')}</span></p>
      <p>Guests: <span>${bookedPropertyDetails.guests.adults} ${bookedPropertyDetails.guests.adults > 1 ? 'Adults' : 'Adult'} &middot; ${bookedPropertyDetails.guests.children} ${bookedPropertyDetails.guests.children > 1 ? 'Children' : 'Child'}</span></p>
    </div>
  </section>
  <section class="payment-summary-section">
    <div class="section-title">Payment Summary</div>
    <div class="section-card">
      <p>Total Paid: <span>$${bookedPropertyDetails.totalAmount}</span></p>
      <p>Payment Method: <span>Credit Card</span></p>
    </div>
  </section>
  <section class="bottom-section">
    <p>Reference ID: ${bookedPropertyDetails.bookingId}</p>
    <a href="my-bookings.html">View My Bookings</a>
    <a href="index.html">Back to Home</a>
  </section>
  `;

  document.querySelector('main').innerHTML = html;
});
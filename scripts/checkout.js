import './general-header.js';
import {getPropertieDetails, loadProperties} from '../data/properties.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import {clearBookingData, addNewBookedProperty, bookedProperties} from '../data/booking-data.js';

loadProperties().then(() => {
  const url = new URL(window.location.href);
  const param = url.searchParams;
  const propertyId = param.get('propertyId')
  const bookingData = JSON.parse(localStorage.getItem('bookingData'));
  if (!bookingData || !propertyId || propertyId !== bookingData.propertyId) {
    window.location.href = 'index.html';
    return;
  }

  const propertyDetails = getPropertieDetails(propertyId);

  // const diffDays = d2.diff(d1, 'day');
  const checkinDate = dayjs(bookingData.checkinDate);
  const checkoutDate = dayjs(bookingData.checkoutDate);
  const nights = checkoutDate.diff(checkinDate, 'day');
  const subtotal = propertyDetails.pricePerNight * nights;
  const totalAmount = subtotal + 75;

  function formatDay(day) {
    day = Number(day);
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;

    return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  const checkoutHtml = `
  <section class="property-summary-section">
    <div class="section-title">Property Summary</div>
    <div class="section-main">
      <div class="image-container">
        <img class="image" src="${propertyDetails.image}">
      </div>
      <div class="name">${propertyDetails.name}</div>
      <div class="location">Location: <span class="exact-info">${propertyDetails.location}</span></div>
      <div class="rating">
        <img class="stars" src="${propertyDetails.getStarsUrl()}">
        <span class="rating-count">${propertyDetails.rating.count}</span>
      </div>
      <div class="property-type">Type: <span class="exact-info">${propertyDetails.type}</span></div>
    </div>
  </section>

  <section class="booking-details-section">
    <div class="section-title">Booking Details</div>
    <div class="section-main">
      <div>Check-in Date: <span class="exact-info">${checkinDate.format('MMMM')} ${formatDay(checkinDate.format('D'))} ${checkinDate.format('YYYY')}</span></div>
      <div>Check-out Date: <span class="exact-info">${checkoutDate.format('MMMM')} ${formatDay(checkoutDate.format('D'))} ${checkoutDate.format('YYYY')}</span></div>
      <div>Nights: <span class="exact-info">${nights}</span></div>
      <div>Guests: <span class="exact-info">${bookingData.guests.adults} ${bookingData.guests.adults > 1 ? 'Adults' : 'Adult'} - ${bookingData.guests.children} ${bookingData.guests.children > 1 ? 'Children' : 'Child'}</span></div>
      <div>Max Guests Allowed: <span class="exact-info">${propertyDetails.maxGuests}</span></div>
    </div>
  </section>

  <section class="price-break-down-section">
    <div class="section-title">Price Breakdown</div>
    <div class="section-main">
      <div class="div">Price per night: <span class="exact-info">$${propertyDetails.pricePerNight}</span></div>
      <div class="div">Nights: <span class="exact-info">${nights}</span></div>
      <div class="line"></div>
      <div class="div">Subtotal: <span class="exact-info">$${subtotal}</span></div>
      <div class="div">Taxes & Fees: <span class="exact-info">$75</span></div>
      <div class="line"></div>
      <div class="total-price">Total Amount: <span>$${totalAmount}</span></div>
    </div>
  </section>

  <section class="guest-information-section">
    <div class="section-title">Guest Information Form</div>
    <div class="section-main">
      <div class="input-section">
        <div class="error-message js-name-error-message">Please enter your full name correctly.</div>
        <div>Full Name</div>
        <input class="input js-full-name-input" type="text">
      </div>
      <div class="input-section">
        <div class="error-message js-email-error-message">Please enter your email correctly.</div>
        <div>Email Address</div>
        <input class="input js-email-input" type="email">
      </div>
      <div class="input-section">
        <div class="error-message js-phone-number-error-message">Please enter your phone number correctly.</div>
        <div>Phone Number</div>
        <input class="input js-phone-number-input" type="tel">
      </div>
    </div>
  </section>
  <section class="booking-button-section">
    <button class="js-confirm-booking-button">Confirm Booking</button>
  </section>
  `;

  document.querySelector('main').innerHTML = checkoutHtml;

  const confirmButton = document.querySelector('.js-confirm-booking-button');
  const emailInput = document.querySelector('.js-email-input');
  const phoneNumberInput = document.querySelector('.js-phone-number-input');
  const fullNameInput = document.querySelector('.js-full-name-input');
  
  let isValidEmail = false;
  let isValidPhoneNumber = false;
  let isValidFullName = false;

  // Regex: at least two words, letters only, separated by one space
  const fullNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
  // Simple phone number validation (digits only, 10–15 numbers)
  const phoneNumberRegex = /^\+?\d{10,15}$/;

  const nameErorr = document.querySelector('.js-name-error-message');
  const emailErorr = document.querySelector('.js-email-error-message');
  const phoneNumberErorr = document.querySelector('.js-phone-number-error-message');

  confirmButton.addEventListener('click', async () => {
    if (!emailInput.checkValidity() || emailInput.value === '') {
      isValidEmail = false;
      console.log(false, 'email');
      emailErorr.classList.add('visible-error');
    } else {
      isValidEmail = true;
      console.log(true, 'email');
      emailErorr.classList.remove('visible-error');
    }

    const fullName = fullNameInput.value.trim();
    if (fullNameRegex.test(fullName)) {
      isValidFullName = true;
      console.log(true, 'name');
      nameErorr.classList.remove('visible-error');
    } else {
      isValidPhoneNumber = false;
      console.log(false, 'name');
      nameErorr.classList.add('visible-error');
    }

    const phoneNumber = phoneNumberInput.value.trim();
    if (phoneNumberRegex.test(phoneNumber)) {
      isValidPhoneNumber = true;
      console.log(true, 'num');
      phoneNumberErorr.classList.remove('visible-error');
    } else {
      isValidPhoneNumber = false;
      console.log(false, 'num');
      phoneNumberErorr.classList.add('visible-error');
    }

    if (isValidEmail && isValidFullName && isValidPhoneNumber) {
      confirmButton.classList.add('booking-confirmed');
      // https://68dae67223ebc87faa318cfc.mockapi.io/bookedProperties
      bookingData.totalAmount = totalAmount;
      const response = await fetch('https://68dae67223ebc87faa318cfc.mockapi.io/bookedProperties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const bookedProperty = await response.json();

      clearBookingData();
      addNewBookedProperty(bookedProperty);
      window.location.href = `booking-success.html?bookingId=${bookedProperty.bookingId}`;
    }
  });
});
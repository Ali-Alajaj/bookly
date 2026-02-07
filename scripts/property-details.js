import {getPropertieDetails, loadProperties} from '../data/properties.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';
import './general-header.js';
import {bookingData, saveBooknigData} from '../data/booking-data.js';

loadProperties().then(() => {
  const url = new URL(window.location.href);
  const propertyId = url.searchParams.get('id');
  const propertyDetails = getPropertieDetails(propertyId);

  if (!propertyId || !propertyDetails) {
    window.location.href = 'index.html';
  }
  
  document.querySelector('.js-hero-section').innerHTML = `
  <div class="image-and-description-container">
    <img class="propertys-image" src="${propertyDetails.image}">
    <div class="description-container">
      <p class="description-title">${propertyDetails.name}</p>
      <p class="description">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam perspiciatis minima, reiciendis architecto dolor molestias eius sint fugiat! Dignissimos vero dolorum reiciendis deleniti enim velit in accusamus quasi, ratione facere.</p>
    </div>
  </div>
  
  <div class="quick-info">
    <div class="name">${propertyDetails.name}</div>
    <div class="ratings">
      <img class="stars" src="${propertyDetails.getStarsUrl()}">
      <p class="reviews">${propertyDetails.rating.count}</p>
    </div>
    <div class="location">Location: <span class="exact-location">${propertyDetails.location}</span></div>
  </div>
  `;

  const from = propertyDetails.availability.from;
  const to = propertyDetails.availability.to;

  document.querySelector('.js-details').innerHTML = `
  <p class="price">Price per night: $${propertyDetails.pricePerNight}</p>
  <p class="includes">Includes taxes and fees</p>
  <p class="p">Type: ${propertyDetails.type}</p>
  <div class="facilities p">
    Facilities: 
    ${getFacilitiesHTML(propertyDetails.facilities)}
  </div>
  
  <div class="availability">Available from ${dayjs(from).format('MMMM')} ${formatDay(dayjs(from).format('D'))} ${dayjs(from).format('YYYY')} to ${dayjs(to).format('MMMM')} ${formatDay(dayjs(to).format('D'))} ${dayjs(to).format('YYYY')}</div>

  <div class="max-guests js-max-guests">Max guests: ${propertyDetails.maxGuests}</div>
  `;

  function getFacilitiesHTML(facilities) {
    let html = '';

    facilities.forEach((facility) => {
      html += `<div class="f">${formatFacility(facility)}</div>`;
    });

    return html;
  };

  function formatDay(day) {
    day = Number(day);
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;

    return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  function formatFacility(facility) {
    const emojiMap = {
      parking: "🅿️",
      restaurant: "🍽️",
      freeWifi: "🛜",
      swimmingPool: "🏊",
      roomService: "🛎️",
      fitnessCenter: "🏋️"
    };

    const normalCase = facility
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^./, c => c.toUpperCase());

    return `${normalCase} ${emojiMap[facility] || ""}`.trim();
  }

  let bodyClick = true;
  let updateBtnClick = false;

  let isCheckin = false;
  let isCheckout = false;
  let isGuests = false;

  document.body.addEventListener('click', () => {
    
    if (bodyClick === true || updateBtnClick === true) {
      document.querySelectorAll('.js-display').forEach((display) => {
        display.classList.remove('visible');
      });
    } else {
      bodyClick = true;
    }

    updateBtnClick = false;
  });

  document.querySelectorAll('.js-input').forEach((input) => {
    input.addEventListener('click', () => {
      bodyClick = false;

      document.querySelectorAll('.js-display').forEach((display) => {
        display.classList.remove('visible');
      });
       
      document.querySelector(`.js-${input.dataset.v}`)
        .classList.add('visible');
    })
  });

  let checkinDate = dayjs().startOf('day');
  let checkoutDate = dayjs().add(1, 'day').startOf('day')
  let savedCheckinDate;
  let savedCheckoutDate;

  generateCheckinDisplay('minus', 'day');
  generateCheckoutDisplay('minus', 'day');

  function generateCheckinDisplay(manipulate, value) {
    if (manipulate === 'minus') {
      checkinDate = checkinDate.subtract(1, value).startOf('day');
    } else if (manipulate === 'plus') {
      checkinDate = checkinDate.add(1, value).startOf('day');
    }

    if (checkinDate < dayjs().startOf('day')) {
      checkinDate = dayjs().startOf('day');
    };

    document.querySelector('.js-checkin-display').innerHTML = `
    <div class="current-date">Check-in: ${checkinDate.format('MMMM D YYYY')}</div>

    <div class="edit">
      <div class="edit-name">Day</div>
      <div class="edit-container">
        <button class="js-subtract-checkin-btn" data-type="day">-</button>
        <div class="date-numbers">${checkinDate.format('D')}</div>
        <button class="js-add-checkin-btn" data-type="day">+</button>
      </div>
    </div>

    <div class="edit">
      <div class="edit-name">Month</div>
      <div class="edit-container">
        <button class="js-subtract-checkin-btn" data-type="month">-</button>
        <div class="date-numbers">${checkinDate.format('M')}</div>
        <button class="js-add-checkin-btn" data-type="month">+</button>
      </div>
    </div>

    <div class="edit">
      <div class="edit-name">Year</div>
      <div class="edit-container">
        <button class="js-subtract-checkin-btn" data-type="year">-</button>
        <div class="date-numbers">${checkinDate.format('YYYY')}</div>
        <button class="js-add-checkin-btn" data-type="year">+</button>
      </div>
    </div>
    <button class="update-date-button js-update-checkin-date">Update</button>
    `;

    document.querySelectorAll('.js-add-checkin-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;

        generateCheckinDisplay('plus', type);
      });
    });

    document.querySelectorAll('.js-subtract-checkin-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;

        generateCheckinDisplay('minus', type);
      });
    });

    document.querySelector('.js-update-checkin-date')
      .addEventListener('click', () => {
        document.querySelector('.js-checkin-date').innerHTML = `
        ${dayjs(checkinDate).format('MMM D YYYY')}
        `;

        updateBtnClick = true;
        isCheckin = true;
        savedCheckinDate = checkinDate.startOf('day');
      });
  }

  function generateCheckoutDisplay(manipulate, value) {
    if (manipulate === 'minus') {
      checkoutDate = checkoutDate.subtract(1, value).startOf('day');
    } else if (manipulate === 'plus') {
      checkoutDate = checkoutDate.add(1, value).startOf('day');
    }

    if (checkoutDate < dayjs().add(1, 'day').startOf('day')) {
      checkoutDate = dayjs().add(1, 'day').startOf('day');
    };

    document.querySelector('.js-checkout-display').innerHTML = `
    <div class="current-date">Check-out: ${checkoutDate.format('MMMM D YYYY')}</div>

    <div class="edit">
      <div class="edit-name">Day</div>
      <div class="edit-container">
        <button class="js-subtract-checkout-btn" data-type="day">-</button>
        <div class="date-numbers">${checkoutDate.format('D')}</div>
        <button class="js-add-checkout-btn" data-type="day">+</button>
      </div>
    </div>

    <div class="edit">
      <div class="edit-name">Month</div>
      <div class="edit-container">
        <button class="js-subtract-checkout-btn" data-type="month">-</button>
        <div class="date-numbers">${checkoutDate.format('M')}</div>
        <button class="js-add-checkout-btn" data-type="month">+</button>
      </div>
    </div>

    <div class="edit">
      <div class="edit-name">Year</div>
      <div class="edit-container">
        <button class="js-subtract-checkout-btn" data-type="year">-</button>
        <div class="date-numbers">${checkoutDate.format('YYYY')}</div>
        <button class="js-add-checkout-btn" data-type="year">+</button>
      </div>
    </div>
    <button class="update-date-button js-update-checkout-date">Update</button>
    `;

    document.querySelectorAll('.js-add-checkout-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;

        generateCheckoutDisplay('plus', type);
      });
    });

    document.querySelectorAll('.js-subtract-checkout-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;

        generateCheckoutDisplay('minus', type);
      });
    });

    document.querySelector('.js-update-checkout-date')
      .addEventListener('click', () => {
        document.querySelector('.js-checkout-date').innerHTML = `
        ${dayjs(checkoutDate).format('MMM D YYYY')}
        `;

        updateBtnClick = true;
        isCheckout = true;
        savedCheckoutDate = checkoutDate.startOf('day');
      });
  }

  const guests = {
    adults: 0,
    children: 0
  }

  let savedGuests;

  function generateGuestsDisplay(guestType, manipulate) {
    if (manipulate === 'minus') {
      guests[guestType]--;
    } else if (manipulate === 'plus') {
      guests[guestType]++;
    }

    if (guests[guestType] < 0) {guests[guestType] = 0};

    document.querySelector('.js-display-guests').innerHTML = `
    <div class="guests-section">
      <p>Adults</p>
      <div class="guests-editing-container">
        <button class="js-subtract-guests" data-guests-type="adults">-</button>
        <p>${guests.adults}</p>
        <button class="js-add-guests" data-guests-type="adults">+</button>
      </div>
    </div>

    <div class="guests-section">
      <p>Children</p>
      <div class="guests-editing-container">
        <button class="js-subtract-guests" data-guests-type="children">-</button>
        <p>${guests.children}</p>
        <button class="js-add-guests" data-guests-type="children">+</button>
      </div>
    </div>
    <button class="update-guests-button js-update-guests-btn">Done</button>
    `;

    document.querySelectorAll('.js-add-guests').forEach((button) => {
      button.addEventListener('click', () => {
        generateGuestsDisplay(button.dataset.guestsType, 'plus');
      })
    });

    document.querySelectorAll('.js-subtract-guests').forEach((button) => {
      button.addEventListener('click', () => {
        generateGuestsDisplay(button.dataset.guestsType, 'minus');
      })
    });

    document.querySelector('.js-update-guests-btn')
      .addEventListener('click', () => {
        document.querySelector('.js-guests').innerHTML = `
        ${guests.adults} Adults - ${guests.children} Children
        `;

        updateBtnClick = true;
        isGuests = true;
        savedGuests = {...guests};
      });
  }

  generateGuestsDisplay('adults', 'minus');

  const checkinInput = document.querySelector('.js-checkin-input');
  const checkoutInput = document.querySelector('.js-checkout-input');
  const guestsInput = document.querySelector('.js-guests-input');
  const checkinError = document.querySelector('.js-checkin-error');
  const checkoutError = document.querySelector('.js-checkout-error');
  const guestsError = document.querySelector('.js-guests-error');

  const errorMsgs = [
    'Please enter the check-in date.',
    'Please enter the check-out date.',
    'Must be at least one adult.',
    'Check-in date must be before Check-out date.',
    'Check-out date must be after Check-in date.',
    `Check-in cannot be before ${dayjs(from).format('MMMM')} ${formatDay(dayjs(from).format('D'))} ${dayjs(from).format('YYYY')}.`,
    `Check-out cannot be after ${dayjs(to).format('MMMM')} ${formatDay(dayjs(to).format('D'))} ${dayjs(to).format('YYYY')}.`,
    `Maximum of ${propertyDetails.maxGuests} guests allowed.`
  ];

  let noCheckinError = true;
  let noCheckoutError = true;
  let noGuestsError = true;

  function displayCheckinError(errorMsg) {
    checkinError.classList.add('visible');
    checkinInput.classList.add('empty-input');
    checkinError.innerHTML = errorMsg;
    noCheckinError = false;
  }

  function displayCheckoutError(errorMsg) {
    checkoutError.classList.add('visible');
    checkoutInput.classList.add('empty-input');
    checkoutError.innerHTML = errorMsg;
    noCheckoutError = false;
  }

  function displayGuestsError(errorMsg) {
    guestsError.classList.add('visible');
    guestsInput.classList.add('empty-input');
    guestsError.innerHTML = errorMsg;
    noGuestsError = false;
  }

  document.querySelector('.js-book-button').addEventListener('click', () => {
    if (!isCheckin) {
      displayCheckinError(errorMsgs[0]);
    } else if (savedCheckinDate >= savedCheckoutDate && isCheckout) {
      displayCheckinError(errorMsgs[3]);
    } else if (savedCheckinDate < dayjs(from).startOf('day')) {
      displayCheckinError(errorMsgs[5]);
    } else {
      checkinError.classList.remove('visible');
      checkinInput.classList.remove('empty-input');
      noCheckinError = true;
    }

    if (!isCheckout) {
      displayCheckoutError(errorMsgs[1]);
    } else if (savedCheckoutDate > dayjs(to).startOf('day')) {
      displayCheckoutError(errorMsgs[6]);
    } else {
      checkoutError.classList.remove('visible');
      checkoutInput.classList.remove('empty-input');
      noCheckoutError = true;
    }

    if (!isGuests || savedGuests.adults === 0) {
      displayGuestsError(errorMsgs[2]);
    } else if ((guests.adults + guests.children) > propertyDetails.maxGuests) {
      displayGuestsError(errorMsgs[7]);
    } else {
      guestsError.classList.remove('visible');
      guestsInput.classList.remove('empty-input');
      noGuestsError = true;
    }

    if (noCheckinError && noCheckoutError && noGuestsError) {
      saveBooknigData({
        propertyId,
        checkinDate: savedCheckinDate,
        checkoutDate: savedCheckoutDate,
        guests: savedGuests
      });

      window.location.href = `checkout.html?propertyId=${propertyId}`;
    }

  });
});
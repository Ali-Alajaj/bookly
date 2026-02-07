import {loadProperties, getPropertieDetails, properties, updateProperties} from '../data/properties.js';
import './general-header.js';
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

loadProperties().then(() => {
  const params = new URLSearchParams(window.location.search);
  const url = new URL(window.location.href)
  let searchParam = url.searchParams.get('location');
  if (searchParam) {searchParam = searchParam.toLowerCase()}

  let checkinParam = url.searchParams.get('checkin');
  if (checkinParam) {checkinParam = checkinParam.replace(/ /g, '+')}

  let checkoutParam = url.searchParams.get('checkout');
  if (checkoutParam) {checkoutParam = checkoutParam.replace(/ /g, '+')}

  const adultsParam = url.searchParams.get('adults');
  const childrenParam = url.searchParams.get('children');

  const stars = params.getAll('stars');
  const types = params.getAll('propertyType');
  const facilities = params.getAll('facilities');

  const minPriceParam = url.searchParams.get('minPrice');
  const maxPriceParam = url.searchParams.get('maxPrice');

  let totalGuests = 0;
  if (adultsParam && childrenParam) {
    totalGuests += (Number(adultsParam) + Number(childrenParam))
  }

  let propertiesHTML = '';
  let isSearching = false;
  let filteredProperties = properties.filter((property) => {
    if (stars.length > 0 || types.length > 0 || facilities.length > 0)  {
      let isTrue = false;
      stars.forEach((value) => {
        if (Number(value) === property.rating.stars ||
        Number(value) + 0.5 === property.rating.stars) {
          isTrue = true;
        }
      });
      types.forEach((value) => {
        if (value === property.type) {
          isTrue = true;
        }
      });

      facilities.forEach((value) => {
        property.facilities.forEach((value2) => {
          if (value === value2) {
            isTrue = true;
          }
        });
      });

      return isTrue;
    }
    if (searchParam) {
      isSearching = true;
      return (property.location.toLowerCase().includes(searchParam) &&
      totalGuests <= property.maxGuests) && (
        checkinParam ? (dayjs(checkinParam) >= dayjs(property.availability.from)) : true
      );
    } else if (checkinParam && checkoutParam) {
      isSearching = true;

      return dayjs(checkinParam) >= dayjs(property.availability.from) &&
      dayjs(checkoutParam).startOf('day') <= dayjs(property.availability.to).startOf('day') && totalGuests <= property.maxGuests;
    } else if (checkinParam) {
      isSearching = true;
      
      return dayjs(checkinParam) >= dayjs(property.availability.from) &&
      totalGuests <= property.maxGuests;
    } else if (checkoutParam) {
      return dayjs(checkoutParam).startOf('day') <= dayjs(property.availability.to).startOf('day') && totalGuests <= property.maxGuests;
    }
  });

  if (filteredProperties.length === 0 && isSearching === false) {
    filteredProperties = properties;
  }

  if (minPriceParam || maxPriceParam) {
    isSearching = true;

    filteredProperties = filteredProperties.filter((property) => {
      return (
        (minPriceParam ? Number(minPriceParam) : 0) <= property.pricePerNight &&
        (maxPriceParam ? Number(maxPriceParam) : 2000) >= property.pricePerNight
      );
    });
  }

  if (isSearching) {
    document.querySelector('.js-properties-title').innerHTML = `
    PROPERTIES <a href="browse.html" class="view-all-link">View All</a>
    `;
  }

  filteredProperties.forEach((property) => {
    propertiesHTML += `
    <section class="hotel">
      <div class="hotel-image-container">
        <img class="hotel-image" src="${property.image}">
      </div>
      <p class="hotel-name">
        ${property.name}
      </p>
      <div class="rating">
        <img class="stars" src="${property.getStarsUrl()}">
        <span class="rating-count">${property.rating.count}</span>
      </div>
      <div class="price-and-small-tag">
        <p class="price">$${property.pricePerNight} per Night test</p>
        <p class="small-tag">${property.smallTag}</p>
      </div>
      <a href="property-details.html?id=${property.id}">View Details</a>
    </section>
    `;
  });

  document.querySelector('.js-hotels-grid').innerHTML = propertiesHTML;

  let bodyClick = true;
  document.body.addEventListener('click', () => {
    document.querySelector('.js-quick-search-container')
      .classList.remove('visible');
    document.querySelector('.js-destination-input-container')
      .classList.remove('square-borders');
    if (bodyClick) {
      document.querySelectorAll('.date-display')
        .forEach((dateDisplay) => {
          if (dateDisplay.classList.contains('visible')) {
            dateDisplay.classList.remove('visible');
          };
        })
      document.querySelector('.js-update-guests-display')
        .classList.remove('visible');
    } else {bodyClick = true}
  });

  document.querySelector('.js-destination-input')
    .addEventListener('keyup', (event) => {
      const value = document.querySelector('.js-destination-input').value.toLowerCase();
      let quickSearchResultHTML = '';

      let filteredLocations = [];
      let filteredCountries = [];
      properties.forEach((property) => {
        const location = property.location;
        if (location.toLowerCase().includes(value)) {
          if (location.includes(', ')) {
            if (filteredCountries.length < 6) {
              filteredCountries.push(location.split(', ')[1]);
            }
          }

          if (filteredLocations.length !== 7) {
            filteredLocations.push(location);
          }
        }
      });

      filteredCountries = [...new Set(filteredCountries)];
      filteredCountries.forEach((country) => {
        quickSearchResultHTML += `
        <div class="quick-search-result js-quick-search-result"
        data-search="${country}">
          <img class="search-icon" src="images/icons/search-icon.png">
          <p class="js-quick-search-place">${country}</p>
        </div>
        `;
      });

      filteredLocations.forEach((location) => {
        quickSearchResultHTML += `
        <div class="quick-search-result js-quick-search-result"
        data-search="${location}">
          <img class="search-icon" src="images/icons/search-icon.png">
          <p class="js-quick-search-place">${location}</p>
        </div>
        `;
      });
      document.querySelector('.js-quick-search-container')
        .innerHTML = quickSearchResultHTML;

      document.querySelector('.js-quick-search-container')
        .classList.add('visible');
      document.querySelector('.js-destination-input-container')
        .classList.add('square-borders');
      if (event.key === 'Enter') {
        document.querySelector('.js-quick-search-container')
          .classList.remove('visible');
        document.querySelector('.js-destination-input-container')
          .classList.remove('square-borders');
      }

      document.querySelectorAll('.js-quick-search-result').forEach((place) => {
        place.addEventListener('click', () => {
          document.querySelector('.js-destination-input').value = place.dataset.search;
        });
      });

    });
    
  let updateButtonClick = false;

  document.querySelectorAll('.js-date-input').forEach((input) => {
    const inputType = input.dataset.type;
    input.addEventListener('click', () => {
      bodyClick = false;
      if (!updateButtonClick) {
        document.querySelector(`.js-${inputType}-date-display`)
          .classList.add('visible');

        if (inputType === 'checkin') {
          document.querySelector(`.js-checkout-date-display`)
            .classList.remove('visible');
        } else if (inputType === 'checkout') {
          document.querySelector(`.js-checkin-date-display`)
            .classList.remove('visible');
        }
      } else if (updateButtonClick) {
        updateButtonClick = false;
      }
    })
  });

  let checkinDate = dayjs().add(1, 'day').startOf('day');
  let checkoutDate = dayjs().add(2, 'day').startOf('day');

  if (checkinParam) {
    checkinDate = dayjs(checkinParam).startOf('day');
    document.querySelector('.js-checkin-chosen-date')
      .innerHTML = checkinDate.format('MMM D, YYYY');
  }
  if (checkoutParam) {
    checkoutDate = dayjs(checkoutParam).startOf('day');
    document.querySelector('.js-checkout-chosen-date')
      .innerHTML = checkoutDate.format('MMM D, YYYY');
  }

  let dateWasChosen = false;
  generateCheckinDate('day');
  generateCheckoutDate('day');

  function generateCheckinDate(value, manipulate) {

    if (manipulate === 'minus') {
      checkinDate = checkinDate.subtract(1, value);
    } else if (manipulate === 'plus') {
      checkinDate = checkinDate.add(1, value);
    }

    if (checkinDate < dayjs()) {checkinDate = dayjs()}

    const html = `
    <div class="current-date js-checkin-date">Check-in: ${checkinDate.format('MMMM D YYYY')}</div>
      <div class="dates-editing-container
      js-dates-editing-container-checkin">
        
        <div class="date-editing-container">
          <div class="edit-name">Day</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkin-minus" 
            data-value-type="day">
              <span>-</span>
            </button>
            <div class="date-value js-checkin-day">${checkinDate.format('D')}</div>
            <button class="edit-date-button js-checkin-plus" 
            data-value-type="day">
              <span>+</span>
            </button>
          </div>
        </div>

        <div class="date-editing-container">
          <div class="edit-name">Month</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkin-minus" 
            data-value-type="month">
              <span>-</span>
            </button>
            <div class="date-value js-checkin-month">${checkinDate.format('MM')}</div>
            <button class="edit-date-button js-checkin-plus" 
            data-value-type="month">
              <span>+</span>
            </button>
          </div>
        </div>
        
        <div class="date-editing-container">
          <div class="edit-name">Year</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkin-minus" 
            data-value-type="year">
              <span>-</span>
            </button>
            <div class="date-value js-checkin-year">${checkinDate.format('YYYY')}</div>
            <button class="edit-date-button js-checkin-plus" 
            data-value-type="year">
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
      <button class="update-date js-update-date-btn
      js-update-checkin-date-btn"
      data-type="checkin">Update</button>
    `;

    document.querySelector(`.js-checkin-date-display`)
      .innerHTML = html;

    document.querySelector('.js-update-checkin-date-btn')
      .addEventListener('click', () => {
        updateButtonClick = true;

        document.querySelector('.js-checkin-date-display')
          .classList.remove('visible');
        document.querySelector('.js-checkin-chosen-date')
          .innerHTML = checkinDate.format('MMM D, YYYY');
        dateWasChosen = true;
      });

    document.querySelectorAll(`.js-checkin-plus`).forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.valueType;

        generateCheckinDate(value, 'plus');
      });
    });

    document.querySelectorAll(`.js-checkin-minus`).forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.valueType;

        generateCheckinDate(value, 'minus');
      });
    });

  }

  function generateCheckoutDate(value, manipulate) {

    if (manipulate === 'minus') {
      checkoutDate = checkoutDate.subtract(1, value);
    } else if (manipulate === 'plus') {
      checkoutDate = checkoutDate.add(1, value);
    }

    if (checkoutDate < dayjs().add(1, 'day')) {checkoutDate = dayjs().add(1, 'day')}

    const html = `
    <div class="current-date js-checkout-date">Check-in: ${checkoutDate.format('MMMM D YYYY')}</div>
      <div class="dates-editing-container
      js-dates-editing-container-checkout">
        
        <div class="date-editing-container">
          <div class="edit-name">Day</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkout-minus" 
            data-value-type="day">
              <span>-</span>
            </button>
            <div class="date-value js-checkout-day">${checkoutDate.format('D')}</div>
            <button class="edit-date-button js-checkout-plus" 
            data-value-type="day">
              <span>+</span>
            </button>
          </div>
        </div>

        <div class="date-editing-container">
          <div class="edit-name">Month</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkout-minus" 
            data-value-type="month">
              <span>-</span>
            </button>
            <div class="date-value js-checkout-month">${checkoutDate.format('MM')}</div>
            <button class="edit-date-button js-checkout-plus" 
            data-value-type="month">
              <span>+</span>
            </button>
          </div>
        </div>
        
        <div class="date-editing-container">
          <div class="edit-name">Year</div>
          <div class="day-editing date-editing">
            <button class="edit-date-button js-checkout-minus" 
            data-value-type="year">
              <span>-</span>
            </button>
            <div class="date-value js-checkout-year">${checkoutDate.format('YYYY')}</div>
            <button class="edit-date-button js-checkout-plus" 
            data-value-type="year">
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
      <button class="update-date js-update-date-btn
      js-update-checkout-date-btn"
      data-type="checkout">Update</button>
    `;

    document.querySelector(`.js-checkout-date-display`)
      .innerHTML = html;

     document.querySelector('.js-update-checkout-date-btn')
      .addEventListener('click', () => {
        updateButtonClick = true;

        document.querySelector('.js-checkout-date-display')
          .classList.remove('visible');
        document.querySelector('.js-checkout-chosen-date')
          .innerHTML = checkoutDate.format('MMM D, YYYY');
        dateWasChosen = true;
      });

    document.querySelectorAll(`.js-checkout-plus`).forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.valueType;

        generateCheckoutDate(value, 'plus');
      });
    });

    document.querySelectorAll(`.js-checkout-minus`).forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.valueType;

        generateCheckoutDate(value, 'minus');
      });
    });

  }

  const guests = {
    adults: 2,
    children: 0
  }

  let guestsUpdatedBtnClicked = false;

  function updateGuests() {
    let html = `
    <div class="guest-editing-container">
      <p class="guest-type">Adults</p>
      <div class="guests-editing">
        <button class="edit-guest-button js-add-guests"
        data-guest-type="adults">
          <span>+</span>
        </button>
        <div class="guests-count">${guests.adults}</div>
        <button class="edit-guest-button js-subtract-guests"
        data-guest-type="adults">
          <span>-</span>
        </button>
      </div>
    </div>

    <div class="guest-editing-container">
      <p class="guest-type">Children</p>
      <div class="guests-editing">
        <button class="edit-guest-button js-add-guests"
        data-guest-type="children">
          <span>+</span>
        </button>
        <div class="guests-count">${guests.children}</div>
        <button class="edit-guest-button js-subtract-guests"
        data-guest-type="children">
          <span>-</span>
        </button>
      </div>
    </div>

    <button class="update-guests js-update-guests-btn">Done</button>
    `;

    document.querySelector('.js-update-guests-display')
      .innerHTML = html;

    document.querySelectorAll('.js-add-guests').forEach((button) => {
      button.addEventListener('click', () => {
        guests[button.dataset.guestType]++;
        updateGuests();
      });
    });

    document.querySelectorAll('.js-subtract-guests').forEach((button) => {
      button.addEventListener('click', () => {
        const guestsType = button.dataset.guestType;
        guests[guestsType]--;
        if (guests[guestsType] < 0) {guests[guestsType] = 0};
        updateGuests();
      });
    });

    document.querySelector('.js-update-guests-btn') 
    .addEventListener('click', () => {
      document.querySelector('.js-guests-count')
        .innerHTML = `${guests.adults} Adults - ${guests.children} Children`;
      document.querySelector('.js-update-guests-display')
        .classList.remove('visible');
      guestsUpdatedBtnClicked = true;
    });
  }

  updateGuests();

  document.querySelector('.js-guests-input')
    .addEventListener('click', () => {
      if (!guestsUpdatedBtnClicked) {
        document.querySelector('.js-update-guests-display')
          .classList.add('visible');
      } else {
        guestsUpdatedBtnClicked = false;
      }
      bodyClick = false;
    });

  document.querySelector('.js-search-btn')
    .addEventListener('click', () => {
      const location = document.querySelector('.js-destination-input').value;

      window.location.href = `
      browse.html?location=${location}&checkin=${dateWasChosen ? checkinDate.format() : ''}&checkout=${dateWasChosen ? checkoutDate.format() : ''}&adults=${guests.adults}&children=${guests.children}&
      `
    });

  const filter = {
    stars: stars.slice(),
    types: types.slice(),
    facilities: facilities.slice()
  }

  document.querySelectorAll('.js-filter-checkbox').forEach((checkbox) => {
    filter.stars.forEach((value) => {
      if (checkbox.dataset.stars === value) {
        checkbox.checked = true
      };
    });

    filter.types.forEach((value) => {
      if (checkbox.dataset.propertyType === value) {
        checkbox.checked = true
      };
    });

    filter.facilities.forEach((value) => {
      if (checkbox.dataset.facilities === value) {
        checkbox.checked = true
      };
    });

    checkbox.addEventListener('click', () => {
      if (checkbox.checked) {
        if (checkbox.dataset.stars) {
          addFilterParams(checkbox.dataset.stars, 'stars')
        } else if (checkbox.dataset.propertyType) {
          addFilterParams(checkbox.dataset.propertyType, 'types')
        } else if (checkbox.dataset.facilities) {
          addFilterParams(checkbox.dataset.facilities, 'facilities')
        }

      } else if (checkbox.checked === false) {
        if (checkbox.dataset.stars) {
          removeFilterParams(checkbox.dataset.stars, 'stars')
        } else if (checkbox.dataset.propertyType) {
          removeFilterParams(checkbox.dataset.propertyType, 'types')
        } else if (checkbox.dataset.facilities) {
          removeFilterParams(checkbox.dataset.facilities, 'facilities')
        }
      }

      addFilterUrl();
    })
  })

  const sideFilterElement = document.querySelector('.js-side-filter');
  document.querySelector('.js-filter-drop-down-btn')
    .addEventListener('click', () => {
      sideFilterElement.classList.add('visible');
      sideFilterElement.classList.add('side-filter-drop-down');
    });

  document.querySelector('.js-filter-x-symbol')
    .addEventListener('click', () => {
      sideFilterElement.classList.remove('visible');
      sideFilterElement.classList.remove('side-filter-drop-down');
    });

  document.querySelector('.js-update-price-btn')
    .addEventListener('click', () => {
      const minPrice = document.querySelector('.js-min-price').value;
      const maxPrice = document.querySelector('.js-max-price').value;

      if (url.searchParams.has('minPrice') && url.searchParams.has('maxPrice')) {
        url.searchParams.set('minPrice', (minPrice ? minPrice : 0));
        url.searchParams.set('maxPrice', (maxPrice ? maxPrice : 2000));
        window.location.href = url.href;
      } else {
        window.location.href = `${url.href}${url.href.includes('?') ? '' : '?'}minPrice=${minPrice ? minPrice : 0}&maxPrice=${maxPrice ? maxPrice : 2000}`;
      }
    })

  function addFilterParams(param, paramType) {
    let matchingParam = false;
    filter[paramType].forEach((value) => {
      if (value === param) {
        matchingParam = true;
      }
    })

    if (matchingParam) {return};

    filter[paramType].push(param);
  }

  function removeFilterParams(param, paramType) {
    filter[paramType].forEach((value, index) => {
      if (value === param) {filter[paramType].splice(index, 1)}
    });
  }

  function addFilterUrl() {
    let urlString = 'browse.html?';
    filter.stars.forEach((stars) => {
      urlString += `stars=${stars}&`;
    });

    filter.types.forEach((type) => {
      urlString += `propertyType=${type}&`
    });

    filter.facilities.forEach((facility) => {
      urlString += `facilities=${facility}&`
    })

    window.location.href = urlString;
  }
});
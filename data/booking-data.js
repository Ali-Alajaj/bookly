import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

export let bookingData; /*( this is an example) = {
  propertyId: '123',
  checkinDate: '[checkinDateInDayJs]',
  checkoutDate: '[checkoutDateInDayJs]',
  guests: {
    adults: 2,
    children: 1
  }
};*/

export const bookedProperties = JSON.parse(localStorage.getItem('bookedPropertysData')) || [{
  bookingDate: Math.round(dayjs().subtract(1, 'month') / 1000),
  bookingId: 'cbd8a97dbd418daae1a9d7f7',
  checkinDate: dayjs().subtract(1, 'month').add(1, 'day').format(),
  checkoutDate: dayjs().subtract(1, 'month').add(4, 'day').format(),
  guests: {
    adults: 2,
    children: 0
  },
  propertyId: 'c2a82c5e-aff4-435f-9975-517cfaba2ece',
  totalAmount: 435
}]; // default booked hotel

export function saveBooknigData(object) {
  bookingData = object;
  localStorage.setItem('bookingData', JSON.stringify(bookingData));
}

export function clearBookingData() {
  bookingData = {};
  localStorage.removeItem('bookingData');
}

export function addNewBookedProperty(bookedPropertyData) {
  bookedProperties.unshift(bookedPropertyData);
  localStorage.setItem('bookedPropertysData', JSON.stringify(bookedProperties));
}
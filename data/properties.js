import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.18/+esm';

const now = dayjs();

class Propertie {
  id;
  name;
  image;
  rating;
  pricePerNight;
  location;
  smallTag;
  type;
  facilities;
  maxGuests;
  availability;

  constructor(propertieDetails) {
    this.id = propertieDetails.id;
    this.name = propertieDetails.name;
    this.image = propertieDetails.image;
    this.rating = propertieDetails.rating;
    this.pricePerNight = propertieDetails.pricePerNight;
    this.location = propertieDetails.location;
    this.smallTag = propertieDetails.smallTag;
    this.type = propertieDetails.type;
    this.maxGuests = propertieDetails.maxGuests;
    this.facilities = propertieDetails.facilities;

    const availabilityInDates = {
      from: now.add(propertieDetails.availability.from, 'day').startOf('day').format(),
      to: now.add(propertieDetails.availability.to, 'day').startOf('day').format()
    }
    this.availability = availabilityInDates;
  }

  getStarsUrl() {
    return `images/stars/rating-${this.rating.stars * 10}.png`;
  }
}

export let properties = [];

export function loadProperties() {
  const promise = fetch(
    'https://my-api-d5al.onrender.com/bookly/properties'
  ).then((response) => {
    console.log('properties loaded');
    return response.json()
  }).then((propertiesJson) => {
    properties = propertiesJson.map((propertieDetails) => {
      return new Propertie(propertieDetails);
    });
  });

  return promise;
}

export function getPropertieDetails(propertieId) {
  let matchingPropertie;
  properties.forEach((propertie) => {
    if (propertieId === propertie.id) {
      matchingPropertie = propertie;
    }
  });

  return matchingPropertie;
}


export function updateProperties(newProperties) {properties = newProperties};

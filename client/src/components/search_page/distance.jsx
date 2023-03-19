import { Country, State, City }  from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';
import { getDistance } from 'geolib';
navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log(
            'You are ',
            geolib.getDistance(position.coords, {
                latitude: 51.525,
                longitude: 7.4575,
            }),
            'meters away from 51.525, 7.4575'
        );
    },
    () => {
        alert('Position could not be determined.');
    }
);
let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
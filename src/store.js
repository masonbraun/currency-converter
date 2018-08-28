import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rates: {}
  },
  mutations: {
    UPDATE_RATES(state, payload) {
      state.rates = payload.rates;
    }
  },
  actions: {
    getExchangeRates({ commit }, payload) {
      axios
        .get('http://data.fixer.io/api/latest?access_key=c20ae1f1b301c7010b699797fe11c3ae')
        .then(response => {
          commit('UPDATE_RATES', { rates: response.data.rates });
        })
        .catch(error => error);
    },
    getGeoLocationData(context, payload) {
      return axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${payload.latitude},${
            payload.longitude
          }&sensor=false`
        )
        .then(response => {
          let countryCode =
            response.data.results[response.data.results.length - 1].address_components[0]
              .short_name;
          return countryCode;
        })
        .catch(error => error);
    }
  }
});

// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&location_type=ROOFTOP&result_type=street_address&key=YOUR_API_KEY

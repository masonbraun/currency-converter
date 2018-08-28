<template>
  <div class="about">
    <input type="text" v-model="value"/>
    
    <select v-model="from">
      <option v-for="(value, key) in $store.state.rates" :key="key">{{ key }}</option>
    </select>


    <select v-model="to">
      <option v-for="(value, key) in $store.state.rates" :key="key">{{ key }}</option>
    </select>

    <select v-model="fee">
      <option value="1">0%</option>
      <option value="1.01">1%</option>
      <option value="1.015">1.5%</option>
      <option value="1.02">2%</option>
      <option value="1.025">2.5%</option>
    </select>

    <p>{{ toCountry.currency_symbol }}{{ conversion }}</p>
    <p>{{ toCountry.currency_symbol }}{{ totalCost }}</p>
  </div>
</template>


<script>
import axios from 'axios';
import { codes } from '@/assets/codes.js';
import _ from 'lodash';

export default {
  data() {
    return {
      value: '',
      from: 'USD',
      to: '',
      country: '',
      fee: ''
    };
  },
  computed: {
    rates() {
      let rates = {};
      for (var key in this.$store.state.rates) {
        rates[key] = this.$store.state.rates[key] * this.baseExchange;
      }
      return rates;
    },
    conversion() {
      return parseFloat(this.value * this.rates[this.to]).toFixed(2);
    },
    defaultBase() {
      return this.$store.state.rates['EUR'];
    },
    newBase() {
      return this.$store.state.rates[this.from];
    },
    baseExchange() {
      return this.defaultBase / this.newBase;
    },
    toCountry() {
      return _.find(codes, { currency_code: this.to });
    },
    fromCountry() {
      return _.find(codes, { currency_code: this.from });
    },
    totalCost() {
      return parseFloat(this.value * this.rates[this.to] * this.fee).toFixed(2);
    }
  },
  mounted() {
    // console.log(codes);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        this.$store
          .dispatch('getGeoLocationData', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          .then(result => {
            console.log(result);
            // this.country = result;

            let test = _.find(codes, { code: result });

            console.log(test);

            this.to = test.currency_code;
          });
      });
    }
    this.$store.dispatch('getExchangeRates');
  }
};
</script>




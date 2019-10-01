<template>
  <div class="container">
    <div class="content-block">
      <transition name="content-change" mode="out-in">
        <!------------ Input ------------>
        <div v-if="!result" class="input-block" key="input">
          <input
            id="flightNumInput"
            v-model="input"
            @keyup.enter="submitQuery(input)"
            placeholder="flightnumber"
            type="text"
          />
          <div class="select-container">
            <select v-model="seat" @change="seatCalculation(seat, carbonTotal)">
              <option value="economy">economy</option>
              <option value="business">business</option>
            </select>
            <span>&nbsp;seat</span>
          </div>
          <button @click="submitQuery(input)" class="reset-button">submit</button>
        </div>
        <!------------ Output ------------>
        <div v-if="result" class="output-block" key="output">
          <ul>
            <li>
              <span>Airline</span>
              {{ result.airline.iataCode }}
            </li>
            <li>
              <span>Aircraft</span>
              {{ result.aircraft.iataCode }}
            </li>
            <li>
              <span>From</span>
              {{ result.departure.iataCode }}
              <span>to</span>
              {{ result.arrival.iataCode }}
            </li>
            <li>
              {{ seat }}
              <span>seat</span>
            </li>
            <li>
              <span>Carbon footprint:</span>
              {{ carbonTotal }}
            </li>
            <li>
              <button @click="resetResults(result)">reset</button>
            </li>
          </ul>

          <p v-if="loading">Loading...</p>
          <p
            v-if="errored"
          >We're sorry, we're not able to retrieve this resultrmation at the moment, please try back later</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// TODO
// Store output departure/arrival Iata in constants
// Use departure/arrival constants to calculate distance through airline routes API
// Create and show distance constant
// TODO
// Add function to change aircraftIata to aircraftType
// TOFIX
// if loading + if error
import axios from "axios";
import { aviationEdgeKey, aviationEdgeUri, proxy } from "~/plugins/config";

export default {
  data() {
    return {
      result: "",
      input: "",
      errored: false,
      loading: false,
      altitudeOffset: 0,
      seat: "economy",
      carbonSeatMultiplier: false,
      carbonBase: 100,
      carbonTotal: 100
    };
  },
  methods: {
    inputFocus: function() {
      document.getElementById("flightNumInput").focus();
    },
    submitQuery: function(input) {
      let inputTrimmed = input.trim() && input.replace(/ +/g, "");
      console.log(inputTrimmed);
      if (inputTrimmed !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${inputTrimmed}`
          )
          .then(response => {
            this.result = response.data[0];
            console.log(this.result);
          })
          .catch(error => {
            this.errored = true;
            console.log(response.error);
          });
        this.input = "";
      } else {
        document.getElementById("flightNumInput").placeholder =
          "please enter a flightnumber";
        document.getElementById("flightNumInput").focus();
      }
    },
    seatCalculation: function(seat, carbonTotal) {
      if (seat === "business") {
        this.carbonTotal = this.carbonTotal * 2;
      }
    },
    // aircraftType: function(result) {
    //   const urlPath = "greatcirclemapper.p.rapidapi.com";
    //   const aircraftCode = result.aircraft.iataCode;
    //   let aircraftName = "";
    //   axios
    //     .get(`${urlPath}`)
    //     .then(response => {
    //       this.aircraftName = response;
    //       console.log(this.aircraftName);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    resetResults: function(result) {
      this.result = "";
      console.log(this.result);
    }
  },
  mounted: function() {
    this.inputFocus(); // TODO: make input component so this works on component render
  }
};
</script>

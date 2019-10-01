<template>
  <div class="container">
    <div class="content-block">
      <transition name="content-change" mode="out-in">
        <!------------ Inputs ------------>
        <div v-if="!result" class="input-container" key="input">
          <div class="input-block">
            <input
              id="flightNumInput"
              v-model="input"
              @keyup.enter="submitFlightQuery(input)"
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
            <button @click="submitFlightQuery(input)" class="reset-button">submit</button>
          </div>

          <div class="input-block">
            <input
              id="departureInput"
              v-model="departureResult"
              @keyup.enter="submitAiportQuery(departureResult, arrivalResult)"
              placeholder="departure"
              type="text"
            />
            <input
              id="arrivalInput"
              v-model="arrivalResult"
              @keyup.enter="submitAirportQuery(departureResult, arrivalResult)"
              placeholder="arrival"
              type="text"
            />
            <button
              @click="submitAirportQuery(departureResult, arrivalResult)"
              class="reset-button"
            >submit</button>
          </div>
        </div>
        <!------------ Output ------------>

        <div v-if="result" class="output-block" key="output">
          <ul>
            <!-- <li v-if="distanceResult">
              <span>Distance</span>
              {{ distanceResult }}
            </li>-->
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
// 1 = Learn how to pass data as arguments into methods functions and when 'this.' is needed and how to output the data
// 2 = use the submitAirportQuery WITHIN the submitFlightQuery to calculate carbonTotal
// 3 = UX -> toggle between airport/flightnr input + animate carbonTotal result with AnimeJS
// TODO LATER
// Add averages (EU first + later get visitor country data)
// Use aircarrier + flightheight in calculations
// if loading + if error
// Approach scientist for proper calculations
import axios from "axios";
import {
  aviationEdgeKey,
  aviationEdgeUri,
  greatCircleMapperKey,
  greatCircleMapperUri,
  proxy
} from "~/plugins/config";

export default {
  data() {
    return {
      input: "",
      result: "",
      departureResult: "",
      arrivalResult: "",
      aircraftResult: "",
      distanceResult: "",
      errored: false,
      loading: false,
      // altitudeOffset: 0,
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

    submitFlightQuery: function(input) {
      let inputTrimmed = input.trim() && input.replace(/ +/g, "");
      if (inputTrimmed !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${inputTrimmed}`
          )
          .then(response => {
            this.result = response.data[0];
            this.departureResult = response.data[0].departure.icaoCode;
            this.arrivalResult = response.data[0].arrival.icaoCode;
            this.aircraftResult = response.data[0].aircraft.iataCode;
            console.log("RESULT", this.result);
          })
          .catch(error => {
            // this.errored = true;
            console.log("submitFlightQuery ERROR", response.error);
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

    submitAirportQuery: function(departureResult, arrivalResult, carbonTotal) {
      axios({
        method: "GET",
        url: `${greatCircleMapperUri}airports/route/${departureResult}-${arrivalResult}/510`,
        headers: {
          "x-rapidapi-host": "greatcirclemapper.p.rapidapi.com",
          "x-rapidapi-key": `${greatCircleMapperKey}`,
          vary: "Accept-Encoding"
        }
      })
        .then(response => {
          this.result = response.data.totals.distance_km;
        })
        .catch(error => {
          console.log(error);
        });
      carbonTotal = this.result * 0.3;
      console.log(this.result);
      this.departureResult = "";
      this.arrivalResult = "";
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

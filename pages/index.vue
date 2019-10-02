<template>
  <div class="container">
    <div class="content-block">
      <transition name="content-change" mode="out-in">
        <!------------ Inputs ------------>
        <div v-if="!result" class="input-container" key="flightNumber">
          <transition name="content-change" mode="out-in">
            <div v-if="inputIsFlightNumber" class="input-block">
              <input
                id="flightNumInput"
                v-model="input"
                @keyup.enter="submitFlightQuery()"
                placeholder="flightnumber"
                type="text"
              />
              <div class="select-container">
                <select v-model="seat" @change="seatCalculation()">
                  <option value="economy">economy</option>
                  <option value="business">business</option>
                </select>
                <span>&nbsp;seat</span>
              </div>
              <button @click="submitFlightQuery(input)" class="reset-button">submit</button>
            </div>

            <div v-else class="input-block" key="airports">
              <input
                id="departureInput"
                v-model="departureResult"
                @keyup.enter="submitAiportQuery()"
                placeholder="departure"
                type="text"
              />
              <input
                id="arrivalInput"
                v-model="arrivalResult"
                @keyup.enter="submitAirportQuery()"
                placeholder="arrival"
                type="text"
              />
              <div class="select-container">
                <select v-model="seat" @change="seatCalculation()">
                  <option value="economy">economy</option>
                  <option value="business">business</option>
                </select>
                <span>&nbsp;seat</span>
              </div>
              <button @click="submitAirportQuery()" class="reset-button">submit</button>
            </div>
          </transition>

          <div @click="inputIsFlightNumber = !inputIsFlightNumber" class="input-toggle">
            <transition name="content-change" mode="out-in">
              <p v-if="inputIsFlightNumber" key="airports">calculate by airports</p>
              <p v-else key="flightNumber">calculate by flight-number</p>
            </transition>
          </div>
        </div>
        <!------------ Output ------------>

        <div v-if="result" class="output-block" key="output">
          <ul>
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
      seat: "economy",
      carbonSeatMultiplier: false,
      carbonTotal: 100,
      inputIsFlightNumber: true
    };
  },
  methods: {
    inputFocus: function() {
      document.getElementById("flightNumInput").focus();
    },
    seatCalculation: function() {
      if (this.seat === "business") {
        this.carbonTotal = this.carbonTotal * 2;
      }
    },
    resetInput: function() {
      this.departureResult = "";
      this.arrivalResult = "";
      this.input = "";
      this.seat = "economy";
      // this.inputFocus();
    },
    resetResults: function(result) {
      this.result = "";
      console.log(this.result);
    },

    submitFlightQuery: function() {
      let inputTrimmed = this.input.trim() && this.input.replace(/ +/g, "");
      console.log("INPUT", this.input);
      if (inputTrimmed !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${this.inputTrimmed}`
          )
          .then(response => {
            this.result = response.data[0];
            this.departureResult = response.data[0].departure.icaoCode;
            this.arrivalResult = response.data[0].arrival.icaoCode;
            this.aircraftResult = response.data[0].aircraft.iataCode;
            console.log("RESULT", this.result);
            console.log("RESPONSE", response.data);
            // submitAirportQuery();
          })
          .catch(error => {
            // this.errored = true;
            console.log("submitFlightQuery ERROR", response.error);
          });
      } else {
        document.getElementById("flightNumInput").placeholder =
          "please enter a flightnumber";
        document.getElementById("flightNumInput").focus();
      }
      this.resetInput();
    },

    submitAirportQuery: function() {
      axios({
        method: "GET",
        url: `${greatCircleMapperUri}airports/route/${this.departureResult}-${this.arrivalResult}/510`,
        headers: {
          "x-rapidapi-host": "greatcirclemapper.p.rapidapi.com",
          "x-rapidapi-key": `${greatCircleMapperKey}`,
          vary: "Accept-Encoding"
        }
      })
        .then(response => {
          this.result = response.data.totals.distance_km;
          this.carbonTotal *= this.result / 0.5;
        })
        .catch(error => {
          console.log(error);
        });
      this.resetInput();
    }
  },
  mounted: function() {
    this.inputFocus(); // TODO: make input component so this works on component render
  }
};
</script>

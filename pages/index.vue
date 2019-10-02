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
                  <option value="economy">economy seat</option>
                  <option value="business">business seat</option>
                </select>
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
                  <option value="economy">economy seat</option>
                  <option value="business">business seat</option>
                </select>
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

        <div v-if="result" class="output-block" key="output" @mouseover="animate(70)">
          <ul>
            <li>
              <div class="bar-text">flight footprint: {{ carbonTotal }}</div>
              <div class="animatedBar one"></div>
            </li>
            <li>
              <div class="bar-text">european person average: {{ averageEuropean }}</div>
              <div class="animatedBar two"></div>
            </li>
            <li>
              <div class="bar-text">american person average: {{ averageAmerican }}</div>
              <div class="animatedBar three"></div>
            </li>
          </ul>
          <div class="input-toggle">
            <p @click="resetResults(result)">reset</p>
          </div>
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
import anime from "animejs"
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
      carbonTotal: 100,
      carbonTotalBar: 70,
      inputIsFlightNumber: true,
      averageEuropean: 7.2, // https://ec.europa.eu/eurostat/statistics-explained/index.php/Greenhouse_gas_emission_statistics_-_carbon_footprints
      averageAmerican: 16.4 // https://greenliving.lovetoknow.com/What_Is_the_Average_Carbon_Footprint
    };
  },
  methods: {
    animate: function(value) {
      console.log();
      anime({
        targets: ".animatedBar.one",
        width: `${value}%`,
        duration: 800,
        easing: 'easeInOutQuad'
      });
      anime({
        targets: ".animatedBar.two",
        width: '30%',
        duration: 800,
        easing: 'easeInOutQuad'
      });
      anime({
        targets: ".animatedBar.three",
        width: '45%',
        duration: 800,
        easing: 'easeInOutQuad'
      });
    },
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
    },
    resetResults: function(result) {
      this.result = "";
      this.carbonTotal = 0
      this.carbonTotalBar = 0
    },

    submitFlightQuery: function() {
      let inputTrimmed = this.input.trim() && this.input.replace(/ +/g, "");
      this.carbonTotalBar = 666
      this.carbonTotal = 1.6
      this.result = 66
      this.animate()
      // if (inputTrimmed !== "") {
      //   axios
      //     .get(
      //       `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${inputTrimmed}`
      //     )
      //     .then(response => {
      //       console.log("RESULT", response.data[0])
      //       this.result = response.data[0]
      //       this.departureResult = response.data[0].departure.icaoCode;
      //       this.arrivalResult = response.data[0].arrival.icaoCode;
      //       this.submitAirportQuery();
      //     })
      //     .catch(error => {
      //       // this.errored = true;
      //       console.log("submitFlightQuery ERROR", response.error);
      //     });
      // } else {
      //   document.getElementById("flightNumInput").placeholder =
      //     "please enter a flightnumber";
      //   document.getElementById("flightNumInput").focus();
      // }
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
          this.animate()
          this.resetInput();
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted: function() {
    this.inputFocus(); // TODO: make input component so this works on component render
  }
};
</script>

<template>
  <div class="container" :data-depth="formDepth">
    <div class="content-block">
      <transition name="content-change" mode="out-in">
        <!------------ Inputs ------------>
        <div v-if="showInput" class="input-container" key="input">
          <transition name="content-change" mode="out-in">
            <div v-if="inputIsFlightNumber" class="input-block bar">
              <div class="bar-icon">
                <svg>
                  <path
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </div>
              <input
                id="flightNumInput"
                v-model="input"
                @keyup.enter="submitFlightQuery()"
                placeholder="flightnumber"
                type="text"
              />
              <div class="select-container">
                <select v-model="returnFactor">
                  <option value="1">single</option>
                  <option value="2">return</option>
                </select>
              </div>
              <div class="select-container">
                <select v-model="seatFactor">
                  <option value="1">economy</option>
                  <option value="2">business</option>
                </select>
              </div>
              <button
                @click="submitFlightQuery(input)"
                class="bar-button"
                title="next: calculate footprint"
              >
                <div class="bar-icon">
                  <svg>
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </div>
              </button>
            </div>

            <div v-else class="input-block bar" key="airports">
              <div class="bar-icon">
                <svg>
                  <path
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </div>
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
                <select v-model="returnFactor">
                  <option value="1">single</option>
                  <option value="2">return</option>
                </select>
              </div>
              <div class="select-container">
                <select v-model="seatFactor">
                  <option value="1">economy</option>
                  <option value="2">business</option>
                </select>
              </div>
              <button
                @click="submitAirportQuery()"
                class="bar-button"
                title="next: calculate footprint"
              >
                <div class="bar-icon">
                  <svg>
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </div>
              </button>
            </div>
          </transition>

          <div @click="toOutputPage" class="bar-toggle">
            <p>to output page (development)</p>
          </div>
          <div @click="inputIsFlightNumber = !inputIsFlightNumber" class="bar-toggle">
            <transition name="content-change" mode="out-in">
              <p v-if="inputIsFlightNumber" key="airports">calculate by airports</p>
              <p v-else key="flightNumber">calculate by flight-number</p>
            </transition>
          </div>
        </div>
      </transition>
      <!------------ Output ------------>
      <div v-if="showOutput" class="output-block" key="output" @mouseover="animateAverage">
        <ul>
          <li class="bar-results bar">
            <div class="bar-icon">
              <svg>
                <path
                  d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
            <div class="bar-results-text">
              flight footprint: {{ carbonTotal }}
              <span>tCO2</span>
            </div>
            <div class="animateAverage one"></div>
          </li>
        </ul>
        <ul>
          <li class="bar-results bar">
            <div class="bar-icon">
              <svg>
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </div>
            <div class="bar-results-text">
              european person average: {{ perPersonAverage }}
              <span>tCO2</span>
            </div>
            <div class="animateAverage two"></div>
          </li>
        </ul>
        <div @click="resetResults(result)" class="bar-toggle" title="reset values">
          <svg class="reset">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div>
        <p v-if="loading">Loading...</p>
        <p
          v-if="errored"
        >We're sorry, we're not able to retrieve this resultrmation at the moment, please try back later</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import anime from "animejs";
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
      formDepth: 1,
      input: "",
      result: "",
      showInput: true,
      showOutput: false,
      departureResult: "",
      arrivalResult: "",
      aircraftResult: "",
      distanceResult: "",
      errored: false,
      loading: false,
      seatFactor: 1,
      returnFactor: 2,
      carbonTotal: 0,
      carbonTotalBar: 0,
      perPersonAverage: 7.2,
      inputIsFlightNumber: true
    };
  },
  methods: {
    toOutputPage: function() {
      this.showInput = false;
      this.showOutput = true;
    },
    animateAverage: function() {
      this.carbonTotalBar = (100 / this.perPersonAverage) * this.carbonTotal;
      console.log(this.perPersonAverage, this.carbonTotal, this.carbonTotalBar);
      anime({
        targets: ".animateAverage.one",
        width: `${this.carbonTotalBar}%`,
        duration: 800,
        easing: "easeInOutQuad"
      });
      anime({
        targets: ".animateAverage.two",
        width: "100%",
        duration: 800,
        easing: "easeInOutQuad"
      });
    },
    inputFocus: function() {
      document.getElementById("flightNumInput").focus();
    },
    resetInput: function() {
      this.departureResult = "";
      this.arrivalResult = "";
      this.input = "";
      this.seat = "economy";
    },
    resetResults: function() {
      this.result = "";
      this.carbonTotal = 0;
      this.carbonTotalBar = 0;
      this.formDepth = 1;
      this.showInput = true;
      this.showOutput = false;
    },
    carbonCalculation: function() {
      // this.carbonTotal = this.carbonTotal.toFixed(1);
    },
    submitFlightQuery: function() {
      let inputTrimmed = this.input.trim() && this.input.replace(/ +/g, "");
      this.animateAverage();
      if (inputTrimmed !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${inputTrimmed}`
          )
          .then(response => {
            console.log("RESULT", response.data[0]);
            this.result = response.data[0];
            this.departureResult = response.data[0].departure.icaoCode;
            this.arrivalResult = response.data[0].arrival.icaoCode;
            this.submitAirportQuery();
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
      let carbonCalculation;
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
          this.distanceResult = response.data.totals.distance_km;
          this.carbonCalculation =
            0.00032214 *
            this.distanceResult *
            this.seatFactor *
            this.returnFactor;
          this.carbonTotal = this.carbonCalculation.toFixed(1);
          this.formDepth = 2;
          this.showInput = false;
          this.showOutput = true;
          this.animateAverage();
        })
        .catch(error => {
          console.log(error);
        });
      // this.carbonTotal = 2.2;
      // this.formDepth = 2;
      // this.showInput = false;
      // this.showOutput = true;
      this.animateAverage();
    }
  },
  mounted: function() {
    this.inputFocus(); // TODO: make input component so this works on component render
  }
};
</script>

<template>
  <div class="container">
    <div class="content-block">
      <transition name="content-change" mode="out-in">
        <!------------ Inputs ------------>
        <div v-if="toggleInputOutput" class="input-container" key="input">
          <div class="message-error message" :data-error-message="errorMessage">
            <transition name="message-change" mode="out-in">
              <p v-if="errorMessage === '0'" key="noError">&nbsp;</p>
              <p v-else key="hasError">{{ errorMessage }}</p>
            </transition>
          </div>

          <transition name="content-change" mode="out-in">
            <div v-if="inputToggle" class="input-block bar">
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
                v-model="inputFlightNumber"
                @keyup.enter="submitFlightQuery"
                placeholder="flightnumber"
                type="text"
                autocomplete="off"
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
                  <option value="5.3">business</option>
                </select>
              </div>
              <button @click="submitFlightQuery" class="bar-button" title="calculate footprint">
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
              <autocomplete placeholder="departure" class="input-departure" />
              <autocomplete placeholder="arrival" class="input-arrival" />
              <div class="select-container">
                <select v-model="returnFactor">
                  <option value="1">single</option>
                  <option value="2">return</option>
                </select>
              </div>
              <div class="select-container">
                <select v-model="seatFactor">
                  <option value="1">economy</option>
                  <option value="5.3">business</option>
                </select>
              </div>
              <button
                @click="submitAirportSearch"
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

          <div @click="inputToggleFunction" class="message-toggle message">
            <transition name="content-change" mode="out-in">
              <p v-if="inputToggle" key="airports">calculate by airport / airport-code</p>
              <p v-else key="flightNumber">calculate by flight-number</p>
            </transition>
          </div>
        </div>
        <!------------ Output ------------>
        <div v-else class="output-block" key="output">
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
                flight footprint: {{ totalCarbon }}
                <span>tCO2</span>
              </div>
              <div class="animateAverage one"></div>
            </li>
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
                european person average: {{ totalEurPersonAvg }}
                <span>tCO2</span>
              </div>
              <div class="animateAverage two"></div>
            </li>
          </ul>
          <div @click="resetAll" class="message-toggle message" title="reset values">
            <svg class="reset" transform="scale(-1,1)">
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import rateLimit from "axios-rate-limit";
import autocomplete from "~/components/Autocomplete";
import anime from "animejs";
// const aviationEdgeKey = process.env.AVIATIONEDGEKEY;
// const aviationEdgeUri = process.env.AVIATIONEDGEURI;
// const greatCircleMapperKey = process.env.GREATCIRCLEMAPPERKEY;
// const greatCircleMapperUri = process.env.GREATCIRCLEMAPPERURI;
import {
  aviationEdgeKey,
  aviationEdgeUri,
  greatCircleMapperKey,
  greatCircleMapperUri
} from "~/plugins/config";

const http = rateLimit(axios.create(), {
  maxRequests: 10,
  perMilliseconds: 3600000
});

export default {
  components: {
    autocomplete
  },
  data: function() {
    return {
      inputFlightNumber: "",
      inputDeparture: "",
      inputArrival: "",
      inputToggle: false,
      toggleInputOutput: true,
      seatFactor: 1, // http://documents.worldbank.org/curated/en/141851468168853188/pdf/WPS6471.pdf // https://theicct.org/blogs/staff/inflight-luxury-who-really-pays // https://www.atmosfair.de/en/offset/flight
      returnFactor: 2,
      totalCarbon: 0,
      totalCarbonBar: 0,
      totalEurPersonAvg: 7.2,
      errorMessage: "0"
    };
  },
  methods: {
    handleClickOutside(evt) {},
    // handleClickOutside(evt) {
    //   console.log(evt, "jeeh");
    //   // if (!this.$el.contains(evt.target)) {
    //   //   // this.closeResults();
    //   // }
    // },
    inputFocus: function() {
      document.getElementById("flightNumInput").focus();
    },

    inputToggleFunction: function() {
      this.inputToggle = !this.inputToggle;
      this.resetInput();
    },

    animateAverage: function() {
      this.totalCarbonBar = (100 / this.totalEurPersonAvg) * this.totalCarbon;
      anime({
        targets: ".animateAverage.one",
        width: `${this.totalCarbonBar}%`,
        delay: 900,
        duration: 900,
        easing: "easeOutSine"
      });
      anime({
        targets: ".animateAverage.two",
        width: "100%",
        delay: 900,
        duration: 900,
        easing: "easeOutSine"
      });
    },

    submitFlightQuery: function() {
      let inputRegEx = /^[a-zA-Z]{2}\d{1,4}/g; // begin string = 2 letters + at least 1 digit
      let inputTrimmed =
        this.inputFlightNumber.trim() &&
        this.inputFlightNumber.replace(/ +/g, "");
      if (inputTrimmed !== "" && inputTrimmed.match(inputRegEx)) {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${inputTrimmed}`
          )
          .then(response => {
            this.inputDeparture = response.data[0].departure.icaoCode;
            this.inputArrival = response.data[0].arrival.icaoCode;
            this.submitAirportQuery();
            console.log("submitFlightQuery response", response);
          })
          .catch(error => {
            this.errorMessage = error;
            console.log("submitFlightQuery error", error);
          });
      } else {
        this.errorMessage =
          "Flight-numbers are 2 letters followed by 1-4 digits";
      }
    },

    submitAirportSearchDeparture: function() {
      axios({
        method: "GET",
        url: `${greatCircleMapperUri}airports/search/${this.inputDeparture}`,
        headers: {
          "content-type": "application/octet-stream",
          "x-rapidapi-host": "greatcirclemapper.p.rapidapi.com",
          "x-rapidapi-key": `${greatCircleMapperKey}`
        }
      })
        .then(response => {
          this.inputDeparture = response.data[0].icao_code;
          console.log("submitAirportSearchDeparture response", response);
        })
        .catch(error => {
          this.errorMessage = error;
          console.log("submitAirportSearchDeparture error", error);
        });
    },

    submitAirportSearchArrival: function() {
      axios({
        method: "GET",
        url: `${greatCircleMapperUri}airports/search/${this.inputArrival}`,
        headers: {
          "content-type": "application/octet-stream",
          "x-rapidapi-host": "greatcirclemapper.p.rapidapi.com",
          "x-rapidapi-key": `${greatCircleMapperKey}`
        }
      })
        .then(response => {
          this.inputArrival = response.data[0].icao_code;
          console.log("submitAirportSearchArrival response", response);
        })
        .catch(error => {
          this.errorMessage = error;
          console.log("submitAirportSearchArrival error", error);
        });
    },

    submitAirportSearch: function() {
      this.submitAirportSearchDeparture();
      this.submitAirportSearchArrival();
      setTimeout(this.submitAirportQuery, 1000);
    },

    submitAirportQuery: function() {
      let carbonCalculation;
      let distanceResult;
      axios({
        method: "GET",
        url: `${greatCircleMapperUri}airports/route/${this.inputDeparture}-${this.inputArrival}/510`,
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
          this.totalCarbon = this.carbonCalculation.toFixed(1);
          this.toggleInputOutput = !this.toggleInputOutput;
          setTimeout(this.animateAverage, 1000);
          console.log("submitAirportQuery response", response);
        })
        .catch(error => {
          this.errorMessage = error;
          console.log("submitAirportQuery error", error);
        });
    },

    submitTest: function() {
      this.totalCarbon = 2.2;
      this.toggleInputOutput = !this.toggleInputOutput;
      setTimeout(this.animateAverage, 1000);
    },

    resetAll: function() {
      this.inputFlightNumber = "";
      this.inputDeparture = "";
      this.inputArrival = "";
      this.returnFactor = 2;
      this.seatFactor = 1;
      this.totalCarbon = 0;
      this.totalCarbonBar = 0;
      this.toggleInputOutput = !this.toggleInputOutput;
      this.errorMessage = "0";
    },
    resetInput: function() {
      this.inputFlightNumber = "";
      this.inputDeparture = "";
      this.inputArrival = "";
      this.returnFactor = 2;
      this.seatFactor = 1;
      this.errorMessage = "0";
    }
  },
  mounted: function() {
    // this.inputFocus();
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

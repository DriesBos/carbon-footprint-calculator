<template>
  <div class="container" :data-depth="formDepth">
    <!-- <div class="animatedPlane"></div> -->
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
                <select v-model="returnFlight" @change="returnFlightCalculation()">
                  <option value="false">single</option>
                  <option value="true">return</option>
                </select>
              </div>
              <div class="select-container">
                <select v-model="seat" @change="seatCalculation()">
                  <option value="economy">economy</option>
                  <option value="business">business</option>
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
                <select v-model="returnFlight" @change="returnFlightCalculation()">
                  <option value="false">single</option>
                  <option value="true">return</option>
                </select>
              </div>
              <div class="select-container">
                <select v-model="seat" @change="seatCalculation()">
                  <option value="economy">economy</option>
                  <option value="business">business</option>
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

          <div @click="inputIsFlightNumber = !inputIsFlightNumber" class="bar-toggle">
            <transition name="content-change" mode="out-in">
              <p v-if="inputIsFlightNumber" key="airports">calculate by airports</p>
              <p v-else key="flightNumber">calculate by flight-number</p>
            </transition>
          </div>
        </div>
      </transition>
      <!------------ Output ------------>
      <div v-if="showOutput" class="output-block" key="output" @mouseover="animateAverage(70)">
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
            <div class="bar-results-text">flight footprint: {{ carbonTotal }}t</div>
            <div class="animateAverage one"></div>
          </li>
        </ul>
        <button @click="offsetFootprint" class="bar-button" title="next: offset footprint">
          offset
          <div class="bar-icon">
            <svg>
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </div>
        </button>
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
            <div class="bar-results-text">european person average: {{ averageEuropean }}t</div>
            <div class="animateAverage two"></div>
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
            <div class="bar-results-text">american person average: {{ averageAmerican }}t</div>
            <div class="animateAverage three"></div>
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
      <!------------ Output ------------>
      <div v-if="showOffset" class="offset-block" key="offset">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div @click="resetResults" class="bar-toggle" title="reset values">
          <svg class="reset">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div>
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
      showInput: true,
      showOutput: false,
      showOffset: false,
      input: "",
      result: "",
      offsetPlans: false,
      departureResult: "",
      arrivalResult: "",
      aircraftResult: "",
      distanceResult: "",
      errored: false,
      loading: false,
      seat: "economy",
      returnFlight: true,
      carbonTotal: 100,
      carbonTotalBar: 70,
      inputIsFlightNumber: true,
      averageEuropean: 7.2, // https://ec.europa.eu/eurostat/statistics-explained/index.php/Greenhouse_gas_emission_statistics_-_carbon_footprints
      averageAmerican: 16.4 // https://greenliving.lovetoknow.com/What_Is_the_Average_Carbon_Footprint
    };
  },
  methods: {
    animateAverage: function(value) {
      anime({
        targets: ".animateAverage.one",
        width: `${value}%`,
        duration: 800,
        easing: "easeInOutQuad"
      });
      anime({
        targets: ".animateAverage.two",
        width: "30%",
        duration: 800,
        easing: "easeInOutQuad"
      });
      anime({
        targets: ".animateAverage.three",
        width: "45%",
        duration: 800,
        easing: "easeInOutQuad"
      });
    },
    offsetFootprint: function() {
      this.showOffset = true;
      this.showOutput = false;
      this.formDepth = 3;
    },
    inputFocus: function() {
      document.getElementById("flightNumInput").focus();
    },
    seatCalculation: function() {
      if (this.seat === "business") {
        this.carbonTotal = this.carbonTotal * 2;
      }
    },
    returnFlightCalculation: function() {
      if ((this.returnFlight = true)) {
        this.carbonTotal = this.carbonTotal * 2;
      }
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
      this.showOffset = false;
    },

    submitFlightQuery: function() {
      let inputTrimmed = this.input.trim() && this.input.replace(/ +/g, "");
      this.carbonTotalBar = 666;
      this.carbonTotal = 1.6;
      this.formDepth = 2;
      this.showOutput = true;
      this.showInput = false;
      this.result = 66;
      this.animateAverage();
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
          this.animate();
          this.formDepth = 2;
          this.resetInput();
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted: function() {
    // this.inputFocus(); // TODO: make input component so this works on component render
    // this.animatePlanes()
  }
};
</script>

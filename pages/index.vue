<template>
  <div class="container">
    <div class="content-block">
      <!-- <transition name="input" mode="out-in"> -->
      <div class="input-block" key="input">
        <input
          v-model="input"
          @keyup.enter="submitQuery(input, loading)"
          placeholder="flightnumber"
          type="text"
        />
        <div class="select-container">
          <select v-model="seat" @change="seatCalculation(seat, carbonCalculated)">
            <option value="economy">economy</option>
            <option value="business">business</option>
          </select>
          <span>seat</span>
        </div>
        <button @click="submitQuery(input, loading)" class="reset-button">submit</button>
      </div>
      <div v-if="info" class="output-block" key="output">
        <ul>
          <li>
            <span>Airline</span>
            {{ info.airline.iataCode }}
          </li>
          <li>
            <span>Aircraft</span>
            {{ info.aircraft.iataCode }}
          </li>
          <li>
            <span>From</span>
            {{ info.departure.iataCode }}
            <span>to</span>
            {{ info.arrival.iataCode }}
          </li>
          <li>
            <span>
              <div class="select-container">
                <select v-model="seat" @change="seatCalculation(seat, carbonCalculated)">
                  <option value="economy">economy</option>
                  <option value="business">business</option>
                </select>
                <span>seat</span>
              </div>
            </span>
          </li>
          <li>
            <span>Carbon footprint:</span>
            {{ carbonCalculated }}
          </li>
        </ul>

        <p v-if="loading">Loading...</p>
        <p
          v-if="errored"
        >We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </div>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { aviationEdgeKey, aviationEdgeUri, proxy } from "~/plugins/config";

export default {
  data() {
    return {
      info: null,
      input: "",
      errored: false,
      loading: false,
      altitudeOffset: 0,
      seat: "economy",
      carbonCalculated: 100
    };
  },
  methods: {
    submitQuery: function(input, loading) {
      if (input !== "") {
        this.loading = true;
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${input}`
          )
          .then(response => {
            this.info = response.data[0];
            console.log(response);
          })
          .catch(error => {
            console.log(response.error);
            this.errored = true;
          });
        this.loading = false;
        this.input = "";
      }
    },
    seatCalculation: function(seat, carbonCalculated) {
      if (seat === "business") {
        this.carbonCalculated = this.carbonCalculated * 2;
      }
    }
  }
};
</script>

<style>
/* ---------- resets ---------- */
input,
label,
select,
button,
textarea {
  margin: 0;
  border: 0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
  background: none;
  line-height: 1;
}
select:focus,
input:focus {
  outline: 0;
}
input,
textarea {
  box-sizing: content-box;
}
button,
input[type="reset"],
input[type="button"],
input[type="submit"],
input[type="checkbox"],
input[type="radio"],
select {
  box-sizing: border-box;
}
input[type="checkbox"],
input[type="radio"] {
  width: 13px;
  height: 13px;
}
input[type="search"] {
  appearance: textfield;
  box-sizing: content-box;
}
::-webkit-search-decoration {
  display: none;
}
button,
input[type="reset"],
input[type="button"],
input[type="submit"] {
  /* Fix IE7 display bug */
  overflow: visible;
  width: auto;
}
::-webkit-file-upload-button {
  padding: 0;
  border: 0;
  background: none;
}
textarea {
  /* Move the label to the top */
  vertical-align: top;
  /* Turn off scroll bars in IE unless needed */
  overflow: auto;
}
select[multiple] {
  /* Move the label to the top */
  vertical-align: top;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #3bad92;
}
.content-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content-block div {
  opacity: 1;
}
/* ---------- input block ---------- */
.input-block {
  height: 50px;
  background: white;
  display: flex;
  flex-wrap: nowrap;
  border-radius: 1000px;
  overflow: hidden;
  padding-left: 20px;
}
input,
select,
button {
  font-size: 16px;
  color: black;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
  height: 100%;
}
input {
  background: white;
  min-width: 50vw;
  text-transform: uppercase;
}
input::placeholder {
  text-transform: none;
}
button {
  background: #e34c29;
  color: white !important;
  border-radius: 100px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
}
.select-container {
  background: white;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}
select {
  appearance: none;
  line-height: normal;
  background: white;
  border-radius: 0;
  border: 0px;
  text-shadow: 0 0 0 #000;
  cursor: pointer;
  text-decoration: underline;
  /* border-radius: 100px; */
}
.input-block .select-container {
  margin-right: 20px;
}
/* ---------- output block ---------- */
.output-block {
  width: 50vmin;
  height: 50vmin;
  background: white;
  display: flex;
  direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1000px;
  overflow: hidden;
  text-align: center;
}
.output-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.output-block ul li {
  margin-bottom: 6px;
}
.output-block span {
  opacity: 0.4;
}
p {
  margin-bottom: 12px;
}
input,
select,
button {
  font-size: 14px;
  color: black;
}
/* ---------- transitions ---------- */
.input-enter-active,
.input-leave-active {
  transition: opacity 1s ease;
}
.input-enter,
.input-leave-to {
  opacity: 0;
}
.output-enter-active,
.output-leave-active {
  transition: opacity 1s ease;
}
.output-enter,
.output-leave-to {
  opacity: 0;
}
</style>
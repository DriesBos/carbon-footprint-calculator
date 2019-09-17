<template>
  <div class="container">
    <div class="content-block">
      <div class="input-block">
        <input
          v-model="input"
          @keyup.enter="submitQuery(input, loading)"
          placeholder="flightnumber"
          type="text"
        />
        <div class="select-container">
          <span class="select-arrow"></span>
          <select v-model="seat" @change="seatCalculation(seat, carbonCalculated)">
            <option value="economy">economy</option>
            <option value="business">business</option>
          </select>
        </div>

        <button @click="submitQuery(input, loading)" class="reset-button">submit</button>
      </div>

      <p v-if="info">
        From {{ info.departure.iataCode }} to {{ info.arrival.iataCode }}
        <br />
        Airline: {{ info.airline.iataCode }}
        <br />
        Aircraft: {{ info.aircraft.iataCode }}
        <br />
        Altitude: {{ info.geography.altitude }} is altitude offset of {{ altitudeOffset}}
        <br />
        Seat: {{ seat }}
        <br />
        Carbon footprint: {{ carbonCalculated }}
      </p>

      <p v-if="loading">Loading...</p>
      <p
        v-if="errored"
      >We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
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
            console.log(this.info);
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
  background: #dedede;
}
.content-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
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
  font-size: 14px;
  color: black;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
  height: 100%;
}
input {
  background: white;
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
  border: grey !important;
}
.select-arrow {
  color: black;
  right: 0;
  top: 0;
  width: 30px;
  height: 100%;
  position: absolute;
  display: block;
  z-index: 10;
  margin: 0 0 0 0;
  pointer-events: none;
  cursor: pointer;
}
select {
  appearance: none;
  line-height: normal;
  background-repeat: no-repeat;
  background: white;
  border-radius: 0;
  border: 0px;
  text-shadow: 0 0 0 #000;
  padding-right: 30px;
  cursor: pointer;
  border-left: 1px #dedede solid;
  /* border-radius: 100px; */
}
p {
  width: 50vw;
  text-align: center;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
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
</style>
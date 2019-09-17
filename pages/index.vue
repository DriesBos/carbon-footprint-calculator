<template>
  <div class="container">
    <div class="center-block">
      <input
        v-model="input"
        @keyup.enter="submitQuery(input, loading)"
        placeholder="flightnumber"
        type="text"
      />

      <select v-model="seat" @change="seatCalculation(seat, carbonCalculated)">
        <option value="economy">economy</option>
        <option value="business">business</option>
      </select>

      <button @click="submitQuery(input, loading)">submit</button>

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
      </p>

      <p>Carbon footprint: {{ carbonCalculated }}</p>

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
    }
  },
  seatCalculation: function(seat, carbonCalculated) {
    if (seat === "business") {
      console.log("seat is business");
      this.carbonCalculated = this.carbonCalculated * 2;
    }
  }
};
</script>

<style>
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
.center-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
p {
  width: 50vw;
  text-align: center;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
input,
button,
select,
p {
  margin-bottom: 12px;
}
</style>
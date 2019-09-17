<template>
  <div class="container">
    <div class="center-block">
      <input v-model="input" @keyup.enter="submitQuery(input)" placeholder="input" type="text" />
      <button @click="submitQuery(input)">submit</button>
      <p v-if="info">{{ info }}</p>
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
      errored: false
    };
  },
  methods: {
    submitQuery: function(input) {
      if (input !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&limit=1&flightIata=${input}`
          )
          .then(response => (this.info = response.data))
          .catch(error => {
            console.log(error);
            this.errored = true;
          });
        this.input = "";
      }
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
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
input,
button,
p {
  margin-bottom: 12px;
}
</style>
<template>
  <div class="container">
    <div class="center-block">
      <input v-model="input" @keyup.enter="submitQuery(input)" placeholder="input" type="text" />
      <button @click="submitQuery(input)">submit</button>
      <p>{{ info }}</p>
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
      input: ""
    };
  },
  methods: {
    submitQuery: function(input) {
      if (input !== "") {
        axios
          .get(
            `${aviationEdgeUri}flights?key=${aviationEdgeKey}&flightIata=${input}`
          )
          .then(response => (this.info = response))
          .catch(error => {
            console.log(error.response);
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
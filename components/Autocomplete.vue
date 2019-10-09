<template>
  <div class="autocomplete">
    <input
      type="text"
      v-model="search"
      @input="onChange"
      :placeholder="placeholder"
      autocomplete="off"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @keydown.esc="closeResults"
    />
    <transition name="autocomplete">
      <ul v-show="isOpen">
        <li
          v-for="(result, i) in results"
          :key="i"
          @click="setResult(result)"
          class="ellipsis"
          :class="{ 'active': i === arrowCounter }"
        >{{ result }}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
import json from "./../assets/data/airports.json";
export default {
  name: "autocomplete",
  props: {
    placeholder: ""
  },
  data: function() {
    return {
      items: json,
      search: "",
      results: [],
      isOpen: false,
      arrowCounter: 0
    };
  },
  methods: {
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    filterResults() {
      let removeNoIata = this.items.filter(el => el.iata); // Remove results without IATA data
      let cityList = removeNoIata.map(
        el => `${el.city} - ${el.name} (${el.iata})`
      ); // Map into new array
      this.results = cityList.filter(
        // Return search results
        el => el.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    },
    setResult(result) {
      this.search = result;
      this.closeResults();
    },
    closeResults() {
      this.isOpen = false;
      this.arrowCounter = 0;
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter];
      this.closeResults();
    },
    handleClickOutside(evt) {
      console.log(evt, "jeeh");
      if (!this.$el.contains(evt.target)) {
        this.closeResults();
      }
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
    },
    destroyed() {
      document.removeEventListener("click", this.handleClickOutside);
    }
  }
};
</script>
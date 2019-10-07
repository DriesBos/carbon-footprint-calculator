<template>
  <div class="autocomplete">
    <input
      id="search"
      v-model="search"
      @input="onChange"
      :placeholder="placeholder"
      type="search"
      autocomplete="off"
    />
    <ul v-show="isOpen" id="results">
      <li v-for="(item, i) in items" :key="i" class="ellipsis">{{ item.city }}</li>
    </ul>
  </div>
</template>

<script>
import json from "~/assets/data/airports.json";
export default {
  name: "autocomplete",
  props: {
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: ""
  },
  data: () => ({
    items: json,
    search: "",
    results: [],
    isOpen: false,
    arrowCounter: 0
  }),
  methods: {
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    filterResults() {
      // first uncapitalize all the things
      // this.results = this.items
      //.filter(item => {
      //  return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      //});
      // console.log(this.results)
    },
    setResult(result) {
      this.search = result;
      this.isOpen = false;
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
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    }
  },
  watch: {
    jsonData: function(val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  // const search = document.getElementById("search");
  // const matchList = document.getElementById("match-list");
  // this.searchAirport();
  // const searchAirport = async searchInput => {
  //   const res = await fetch("../assets/data/airports.json");
  //   const airports = await res.json();
  //   console.log(airports);
  // };
  // // search airport.json
  // search.addEventListener("input", () => searchAirports(search.value));
  // }
};
</script>

<style lang="sass" scoped>
.autocomplete
  position: relative
  height: 100%
  input
    width: 100%
    height: 100%
  ul
    position: absolute
    top: 50px
    left: 0
    line-height: 1.3em
    overflow: visible
    max-height: 120px
    overflow: auto
    background: white
    color: black
    width: 100%
    padding-top: 5px
    padding-bottom: 10px
    &::after
      content: ""
      position: absolute
      z-index: 1
      left: 0
      bottom: 0
      width: 100%
      height: 4em
      background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)
    li
      padding-left: 10px

.ellipsis
  width: calc(100% - 10px)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
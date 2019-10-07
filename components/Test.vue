<template>
  <div class="autocomplete">
    <input v-model="search" @input="onChange" type="text" autocomplete="off" />
    <ul v-show="isOpen" class="autocomplete-results">
      <li
        v-for="(result, i) in results"
        :key="i"
        class="autocomplete-result ellipsis"
      >{{ result.city }}</li>
    </ul>
  </div>
</template>

<script>
import json from "~/assets/data/airports.json";

export default {
  name: "test",
  data: () => ({
    search: "",
    items: json,
    results: [],
    isOpen: false
  }),
  methods: {
    onChange() {
      this.isOpen = true;
      this.filterResults();
    },
    filterResults() {
      // this.results = this.items.filter(item => item.indexOf(this.search) > -1);
      console.log(this.items);
    }
  }
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
    top: 30px
    left: 0
    border-radius: 10px
    line-height: 1.3em
    overflow: visible
    max-height: 120px
    overflow: auto
    background: white
    color: black
    width: 100%
    z-index: 100
    &::after
      content: ""
      position: absolute
      z-index: 101
      left: 0
      bottom: 0
      width: 100%
      height: 4em
      background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 90%)
    li
      padding-left: 1em
      cursor: pointer
    li:first-child
      padding-top: .5em
    li:last-child
      padding-bottom: 1em

.ellipsis
  width: calc(100% - 10px)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
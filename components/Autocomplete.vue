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
      class="ellipsis"
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
    }
    // handleClickOutside(evt) {
    //   console.log(evt, "jeeh");
    //   if (!this.$el.contains(evt.target)) {
    //     this.closeResults();
    //   }
    // },
  }
};
</script>

<style lang="sass" scoped>
.autocomplete
  position: relative
  height: 100%
  line-height: 0
  input
    width: 100%
    height: 100%
  ul
    position: absolute
    top: 60px
    left: -10px
    line-height: 1.5
    overflow: auto
    z-index: 999
    max-height: calc(50vh - 45px)
    background: white
    color: black
    border-radius: 10px
    li
      padding-left: 1em
      padding-right: .5em
      cursor: pointer
      width: 405px
      &:hover, &.active
        background: lightgrey
    li:first-child
      margin-top: 1em
    li:last-child
      margin-bottom: 1em
  .ellipsis
    width: 100%
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

.autocomplete-enter-active
  transition: all .33s ease

.autocomplete-leave-active
  transition: all .12s ease

.autocomplete-enter, .autocomplete-leave-to
  opacity: 0
  transform: translateY(30px)

</style>
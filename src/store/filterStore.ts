import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const states = {
  filter: {
    Porsche: false as boolean,
    Bugatti: false as boolean,
    Citroen: false as boolean,
  },
};

export default new Vuex.Store({
  state: states,
  getters: {
    filterSettings: (state: typeof states) => {
      return state.filter;
    },
  },
  mutations: {
    updateFilter(state: typeof states, updatedFilter) {
      state.filter = updatedFilter;
    },
  },
});

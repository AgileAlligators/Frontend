import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const states = {
  filter: {
    Porsche: false,
    Bugatti: false,
    Citroen: false,
    Ferrari: false,
    BMW: false,
    Haube: false,
    Motor: false,
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

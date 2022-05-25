import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const states = {
  filter: {
    customer: {
      Customer1: false,
    },
    type: {
      Type1: false,
      Type2: false,
    },
    order: {
      Order1: false,
      Order2: false
    }
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

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const states = {
  desktop: true,
  title: 'Agile Alligators',
  dark: false,
  safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
};

export default new Vuex.Store({
  state: states,
  getters: {
    touchDevice: (): boolean => {
      return (
        navigator.maxTouchPoints > 0 ||
        // microsoft...
        ('msMaxTouchPoints' in navigator &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigator as any)['msMaxTouchPoints'] > 0)
      );
    },
    desktop: (state: typeof states): boolean => {
      return !!state.desktop;
    },
    title: (state: typeof states): string => {
      return state.title;
    },
    dark: (state: typeof states): boolean => {
      return state.dark;
    },
  },
  mutations: {
    desktop(state: typeof states, desktop: boolean) {
      state.desktop = desktop;
    },
    title(state: typeof states, title: string) {
      state.title = title;
    },
    toggleDark(state: typeof states, to?: boolean) {
      if (to === undefined) state.dark = !state.dark;
      else state.dark = !!to;
      Vue.prototype.$vm.setTheme(state.dark ? 'dark' : 'light');
    },
  },
});

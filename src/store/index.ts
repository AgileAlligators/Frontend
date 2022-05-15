import router from '@/router';
import { User } from '@/utils/authenticator';
import Vue from 'vue';
import { noop } from 'vue-class-component/lib/util';
import { RawLocation } from 'vue-router';
import Vuex from 'vuex';

Vue.use(Vuex);

const states = {
  desktop: true,
  title: 'Agile Alligators',
  dark: false,
  safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  user: null as null | User,
  savedRoute: null as null | RawLocation,
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
    user: (state: typeof states): User | null => {
      return state.user;
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
    signIn(state: typeof states, user: User) {
      state.user = user;
      router.push(state.savedRoute || { name: 'home' }).catch(noop);
    },
    signOut(state: typeof states) {
      state.user = null;
      router.push({ name: 'login' }).catch(noop);
    },
    savedRoute(state: typeof states, route: RawLocation): void {
      state.savedRoute = route;
    },
  },
});

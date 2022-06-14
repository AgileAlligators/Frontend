import router from '@/router';
import { User } from '@/utils/authenticator';
import { EventBus } from '@/utils/constants';
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

  dialog_filter: false,
  filter: {
    types: [] as string[],
    customers: [] as string[],
    orders: [] as string[],
    components: [] as string[],
  },
  selection: {} as Record<string, boolean>,
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
    filter: (state: typeof states) => {
      return state.filter;
    },
    selection: (state: typeof states): string[] | undefined => {
      const ids = Object.entries(state.selection)
        .map((x) => {
          return { id: x[0], selected: x[1] };
        })
        .filter(({ selected }) => selected)
        .map(({ id }) => id);

      return ids.length > 0 ? ids : undefined;
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

    dialog_filter(state: typeof states, open: boolean) {
      state.dialog_filter = open;
      if (!open) EventBus.$emit('reload-carriers');
    },
    filter_types(state: typeof states, types: string[] | null) {
      state.filter.types = types || [];
    },
    filter_customers(state: typeof states, customers: string[] | null) {
      state.filter.customers = customers || [];
    },
    filter_orders(state: typeof states, orders: string[] | null) {
      state.filter.orders = orders || [];
    },
    filter_components(state: typeof states, components: string[] | null) {
      state.filter.components = components || [];
    },
  },
});

import Vue from 'vue';
import Vuement from 'vuement';
import App from './App.vue';
import { AlligatorIcons } from './icons';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuement, {
  colors: { primary: '#419F52' },
  themes: {
    dark: {
      color: '#ffffff',
      'color-secondary': '#6e6e73',
      paragraph: '#000000',
      background: '#1d1d1f',
      container: '#2f3035',
      border: '#424245',
    },
    light: {
      color: '#1d1d1f',
      'color-secondary': '#86868b',
      background: '#ffffff',
      paragraph: '#f5f5f7',
      container: '#eff1f2',
      border: '#d2d2d7',
    },
  },
});

Vue.use(AlligatorIcons);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

import 'ol/ol.css';
import VCalendar from 'v-calendar';
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import vTitle from 'vuejs-title';
import Vuement from 'vuement';
import App from './App.vue';
import { AlligatorIcons } from './icons';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Authenticator } from './utils/authenticator';
import { convertId, date, getCounter, time } from './utils/functions';
import { PermsDirective } from './utils/perms.directive';

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
      container: '#e4e7e9',
      border: '#d2d2d7',
    },
  },
});

Vue.use(VCalendar);

Vue.prototype.$convId = convertId;
Vue.prototype.$counter = getCounter;
Vue.prototype.$date = date;
Vue.prototype.$time = time;

Vue.use(AlligatorIcons);
Vue.use(vTitle, {
  cssClass: 'aa-tooltip',
  bgColor: 'rgba(var(--vm-background), 1)',
  round: '7.5px',
  textColor: 'rgba(var(--vm-color), 1)',
});

Vue.directive('pex', PermsDirective);
Authenticator.test();

Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

Vue.prototype.$vibrationChart = {
  chart: {
    toolbar: { show: true },
    parentHeightOffset: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    stacked: false,
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true,
    },
  },
  yaxis: {
    min: 0,
    max: 1,
    tickAmount: 10,
    labels: {
      formatter: (value: number) => Math.round(value * 100) / 100,
    },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
  },
  stroke: { lineCap: 'round', width: 3, curve: 'straight' },
  theme: { mode: store.getters.dark ? 'dark' : 'light' },
};

Vue.prototype.$idleChart = {
  chart: {
    toolbar: { show: true },
    parentHeightOffset: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    stacked: false,
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true,
    },
  },
  yaxis: {
    labels: { formatter: (value: number) => time(value) },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
  },
  stroke: { lineCap: 'round', width: 3, curve: 'straight' },
  theme: { mode: store.getters.dark ? 'dark' : 'light' },
  dataLabels: { enabled: false },
};

Vue.prototype.$loadChart = {
  chart: {
    toolbar: { show: true },
    parentHeightOffset: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    stacked: false,
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: { formatter: (value: number) => value + '%' },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
  },
  stroke: { lineCap: 'round', width: 3, curve: 'straight' },
  theme: { mode: store.getters.dark ? 'dark' : 'light' },
};

Vue.prototype.$loadOverTimeChart = {
  chart: {
    toolbar: { show: true },
    parentHeightOffset: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    stacked: true,
    stackType: '100%',
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true,
    },
  },
  // yaxis: {
  //   min: 0,
  //   max: 100,
  //   tickAmount: 5,
  //   labels: { formatter: (value: number) => time(value) },
  // },
  // xaxis: {
  //   type: 'datetime',
  // },
  tooltip: {
    // x: { format: 'dd.MM.yyyy \\u\\m HH:mm \\U\\h\\r' },
    y: { formatter: (value: number) => time(value) },
  },
  plotOptions: { bar: { horizontal: true } },
  stroke: { lineCap: 'round', width: 3, curve: 'straight' },
  theme: { mode: store.getters.dark ? 'dark' : 'light' },
};

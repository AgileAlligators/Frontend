import _Vue, { PluginFunction } from 'vue';
import aiAccount from './aiAccount.vue';
import aiAccountFilled from './aiAccountFilled.vue';
import aiCharts from './aiCharts.vue';
import aiChartsFilled from './aiChartsFilled.vue';
import aiGuide from './aiGuide.vue';
import aiGuideFilled from './aiGuideFilled.vue';
import aiHome from './aiHome.vue';
import aiHomeFilled from './aiHomeFilled.vue';
import aiHotspots from './aiHotspots.vue';
import aiHotspotsFilled from './aiHotspotsFilled.vue';

export const AlligatorIconsSidebar: PluginFunction<unknown> =
  function registerIcons(Vue: typeof _Vue): void {
    Vue.component('ai-home', aiHome);
    Vue.component('ai-home-filled', aiHomeFilled);
    Vue.component('ai-account', aiAccount);
    Vue.component('ai-account-filled', aiAccountFilled);
    Vue.component('ai-charts', aiCharts);
    Vue.component('ai-charts-filled', aiChartsFilled);
    Vue.component('ai-hotspots', aiHotspots);
    Vue.component('ai-hotspots-filled', aiHotspotsFilled);
    Vue.component('ai-guide', aiGuide);
    Vue.component('ai-guide-filled', aiGuideFilled);
  };

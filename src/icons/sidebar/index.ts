import _Vue, { PluginFunction } from 'vue';
import aiHome from './aiHome.vue';
import aiHomeFilled from './aiHomeFilled.vue';

export const AlligatorIconsSidebar: PluginFunction<unknown> =
  function registerIcons(Vue: typeof _Vue): void {
    Vue.component('ai-home', aiHome);
    Vue.component('ai-home-filled', aiHomeFilled);
  };

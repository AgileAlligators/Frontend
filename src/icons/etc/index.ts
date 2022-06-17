import _Vue, { PluginFunction } from 'vue';
import aiChevronLeft from './aiChevronLeft.vue';
import aiChevronRight from './aiChevronRight.vue';
import aiCopy from './aiCopy.vue';
import aiDotsH from './aiDotsH.vue';
import aiDownload from './aiDownload.vue';
import aiFilter from './aiFilter.vue';
import aiLens from './aiLens.vue';
import aiMoon from './aiMoon.vue';
import aiPause from './aiPause.vue';
import aiPlay from './aiPlay.vue';
import aiPlus from './aiPlus.vue';
import aiRemove from './aiRemove.vue';
import aiSpeed from './aiSpeed.vue';
import aiSun from './aiSun.vue';

export const AlligatorIconsEtc: PluginFunction<unknown> =
  function registerIcons(Vue: typeof _Vue): void {
    Vue.component('ai-copy', aiCopy);
    Vue.component('ai-chevron-left', aiChevronLeft);
    Vue.component('ai-chevron-right', aiChevronRight);
    Vue.component('ai-lens', aiLens);
    Vue.component('ai-plus', aiPlus);
    Vue.component('ai-dots-h', aiDotsH);
    Vue.component('ai-remove', aiRemove);
    Vue.component('ai-download', aiDownload);
    Vue.component('ai-sun', aiSun);
    Vue.component('ai-moon', aiMoon);
    Vue.component('ai-filter', aiFilter);
    Vue.component('ai-play', aiPlay);
    Vue.component('ai-pause', aiPause);
    Vue.component('ai-speed', aiSpeed);
  };

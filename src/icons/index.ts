import _Vue, { PluginFunction } from 'vue';
import { AlligatorIconsEtc } from './etc';
import { AlligatorIconsSidebar } from './sidebar';

export const AlligatorIcons: PluginFunction<unknown> = function registerIcons(
  Vue: typeof _Vue
): void {
  Vue.use(AlligatorIconsEtc);
  Vue.use(AlligatorIconsSidebar);
};

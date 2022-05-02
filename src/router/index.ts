import { MetaInjector } from '@/utils/MetaInjector';
import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';

Vue.use(VueRouter);
export const suffix = ' | Agile Alligators';

const router = new VueRouter({
  scrollBehavior(to, _, savedPosition) {
    if (to.hash) return { selector: to.hash, offset: { x: 0, y: 200 } };
    return savedPosition || { x: 0, y: 0 };
  },

  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        PAGE_TITLE: 'Home',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: {
        PAGE_TITLE: 'Über',
      },
    },
    { path: '*', redirect: { name: 'home' } },
  ],
});

router.afterEach((to: Route) => {
  if (to.meta) {
    const { PAGE_TITLE, PAGE_DESCRIPTION } = to.meta;

    MetaInjector.setPageTitle(PAGE_TITLE);
    MetaInjector.setPageDescription(PAGE_DESCRIPTION);
  }
});

export default router;

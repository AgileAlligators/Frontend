import store from '@/store';
import { MetaInjector } from '@/utils/MetaInjector';
import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';

Vue.use(VueRouter);
export const suffix = ' | Ligenium Track+';

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
        PAGE_TITLE: 'Übersicht',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        PAGE_TITLE: 'Login',
      },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/Account.vue'),
      meta: {
        PAGE_TITLE: 'Account',
      },
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('@/views/Charts.vue'),
      meta: {
        PAGE_TITLE: 'Diagramme',
      },
    },
    {
      path: '/hotspots',
      name: 'hotspots',
      component: () => import('@/views/Hotspots.vue'),
      meta: {
        PAGE_TITLE: 'Hotspots',
      },
    },
    {
      path: '/peaks',
      name: 'peaks',
      component: () => import('@/views/Peaks.vue'),
      meta: {
        PAGE_TITLE: 'Peaks',
      },
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/Guide.vue'),
      meta: {
        PAGE_TITLE: 'Guide',
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

router.beforeEach((to, _, next) => {
  try {
    if (to.name !== 'login' && !store.getters.user) {
      store.commit('savedRoute', to);
      next({ name: 'login' });
    } else if (to.name === 'login' && store.getters.user) {
      next(false);
    } else next();
  } catch (_) {
    // noop
  }
});

export default router;

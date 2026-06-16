import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import KiteList from '@/pages/KiteList.vue';
import KiteForm from '@/pages/KiteForm.vue';
import KiteDetail from '@/pages/KiteDetail.vue';
import FlightList from '@/pages/FlightList.vue';
import FlightForm from '@/pages/FlightForm.vue';
import Analytics from '@/pages/Analytics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/kites',
      name: 'kite-list',
      component: KiteList,
    },
    {
      path: '/kites/new',
      name: 'kite-new',
      component: KiteForm,
    },
    {
      path: '/kites/:id',
      name: 'kite-detail',
      component: KiteDetail,
    },
    {
      path: '/kites/:id/edit',
      name: 'kite-edit',
      component: KiteForm,
    },
    {
      path: '/flights',
      name: 'flight-list',
      component: FlightList,
    },
    {
      path: '/flights/new',
      name: 'flight-new',
      component: FlightForm,
    },
    {
      path: '/flights/:id/edit',
      name: 'flight-edit',
      component: FlightForm,
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics,
    },
  ],
});

export default router;

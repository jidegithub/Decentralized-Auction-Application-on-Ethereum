import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/auctions/:id',
    name: 'auction',
    component: () => import('@/views/AuctionView.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/UploadView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
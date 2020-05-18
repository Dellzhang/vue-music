import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/recommend',
    component: Home,
    name: 'recommend',
    children: [{
      path: ':id',
      component: () => import('../views/recommendList/index.vue')
    }]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/index.vue')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('../views/singer/index.vue')
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('../views/ranking/index.vue'),
    children: [{
      path: ':id',
      component: () => import('../views/toplist/index.vue'),
    }]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue'),
    children: [
      {
        path: ':id',
        component: () => import('../views/singerDetail/index.vue')
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

export default router

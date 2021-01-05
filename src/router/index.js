import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '@/views/Search'
import Import from '@/views/Import'
import Mark from '@/views/Mark'

// import App from '../App'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/search'
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/import',
    name: 'Import',
    component: Import
  },
  {
    path: '/mark',
    name: 'Mark',
    component: Mark
  }
]

const router = new VueRouter({
  routes
})

export default router

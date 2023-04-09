import { createRouter, createWebHashHistory } from 'vue-router'

import SSO from "@/views/SSO.vue"
import Apps from "@/views/Apps.vue"

import Cookies from "js-cookie";

const routes = [
  {
    path: '/',
    name: 'sso',
    component: SSO,
  },
  {
    path: '/apps',
    name: 'apps',
    component: Apps,
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router

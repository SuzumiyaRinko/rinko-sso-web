import { createRouter, createWebHashHistory } from 'vue-router'

import SSO from "@/views/SSO.vue"

import Cookies from "js-cookie";

const routes = [
  {
    path: '/',
    name: 'sso',
    component: SSO,
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router

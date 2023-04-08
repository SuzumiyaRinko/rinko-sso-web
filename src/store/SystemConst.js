import { createStore } from 'vuex'

export default createStore({
  state: {
    apiPrefix: "http://localhost:8081", // dev
    // apiPrefix: "http://192.168.66.150/api-Rinko-SSO", // test
    // apiPrefix: "http://175.178.244.172/api-Rinko-SSO", // prod

    resourcesPrefix: "http://192.168.66.150/resources", // dev&test
    // resourcesPrefix: "http://175.178.244.172/resources", // prod
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

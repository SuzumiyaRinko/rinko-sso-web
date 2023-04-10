import axios from 'axios'

import Cookies from "js-cookie";

let service = axios.create({
    // baseURL: "http://localhost:8081/", // dev
    // baseURL: "http://192.168.66.150/api-Rinko-SSO", // test
    baseURL: "http://175.178.244.172/api-Rinko-SSO", // prod

    // timeout: 3000
})

export default service
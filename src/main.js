import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// vant样式
import 'vant/lib/index.css';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
// 移动端size自适应
import 'lib-flexible'

createApp(App).use(store).use(router).mount('#app')
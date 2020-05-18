import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import 'babel-polyfill'
import './utils/rem'
import Vant from 'vant';
import 'vant/lib/index.css';
import '@/assets/iconfont/iconfont.css'
import '@/assets/styles/icon.styl'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
Vue.use(VueTouch)
Vue.use(VueLazyload, {
  loading: require('@/assets/img/default.png')
})


Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

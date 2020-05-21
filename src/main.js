import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import api from './api/index';
Vue.config.productionTip = false;
Vue.prototype.$api = api;
new Vue({
  router, //=>this.$route  this.$router
  store, //=>this.$store
  render: h => h(App)
}).$mount('#app');
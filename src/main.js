import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

import Vuetify from 'vuetify'

import VueGoogleCharts from 'vue-google-charts'

import routes from './routes/index';

Vue.use(Vuetify)
Vue.use(VueRouter);
Vue.use(VueGoogleCharts)
Vue.config.productionTip = false

const router = new VueRouter({ routes });


new Vue({
  render: h => h(App),
  router
}).$mount('#app')

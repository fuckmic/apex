import Vue from "vue";
import App from "./App";
import store from '@/_store';
import * as navs from '@/_utils/navs.js';
import * as api from '@/_api/request.js';

Vue.config.productionTip = false;

navs.setStore(store);

Vue.prototype.$nav = navs;
console.log(Vue.prototype.$nav);

App.mpType = "app";
const app = new Vue({
	store,
	...App,
});
app.$mount();
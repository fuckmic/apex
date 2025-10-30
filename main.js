import Vue from "vue";
import App from "./App";
import store from '@/_store';
import {
	initI18n,
	t
} from '@/_utils/i18n.js';
import * as navs from '@/_utils/navs.js';
import * as api from '@/_api/request.js';



initI18n(store);
navs.setStore(store);


Vue.prototype.$nav = navs;
Vue.prototype.$t = t;
// console.log(Vue.prototype.$nav);

Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
	store,
	...App,
});
app.$mount();
import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.js';
import lgre from './modules/lgre.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		lgre,
		// theme,
		// layout,
		auth,
	},
});

export default store;
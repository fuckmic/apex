import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth.js';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		// lgre,
		// theme,
		// layout,
		auth,
	},
});

export default store;
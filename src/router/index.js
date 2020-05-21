import Vue from 'vue';
import VueRouter from 'vue-router';
import Playsong from '../pages/Playsong.vue';
import Playvideo from '../pages/Playvideo.vue';
Vue.use(VueRouter);
const router = new VueRouter({
	mode: "hash",
	routes: [{
		path: '/',
		redirect: '/playsong/1'
	}, {
		path: '/playsong/:id',
		name: 'playsong',
		component: Playsong
	}, {
		path: '/playvideo/:id',
		name: 'playvideo',
		component: Playvideo
	}, {
		path: '*',
		redirect: '/playsong/1'
	}]
});
export default router;
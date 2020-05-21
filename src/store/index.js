import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';
import api from '../api/index';
Vue.use(Vuex);

function formatLyric(lyric) {
	lyric += '&#10;';
	const obj = {
		32: ' ',
		40: '(',
		41: ')',
		45: '-'
	};
	lyric = lyric.replace(/&#(\d+);/g, (item, num) => {
		item = obj[num] || item;
		return item;
	});
	let lyricArr = [];
	lyric.replace(/\[(\d+)&#58;(\d+)&#46;(?:\d+)\]([^&#;]+)&#10;/g, (_, minutes, seconds, content) => {
		lyricArr.push({
			minutes,
			seconds,
			content
		});
	});
	return lyricArr;
}

export default new Vuex.Store({
	state: {
		cur: 0,
		list: []
	},
	mutations: {
		queryDataM(state, payload) {
			let {
				id,
				data
			} = payload;
			state.cur = parseInt(id);
			if (data) {
				state.list.push({
					...data,
					lyric: formatLyric(data.lyric)
				});
			}
		}
	},
	actions: {
		async queryDataA({
			state,
			commit
		}, id) {
			// 校验是否存在
			let result = state.list.find(item => {
				return parseInt(item.id) === parseInt(id);
			});
			if (result) {
				// 存在只改ID
				commit('queryDataM', {
					id
				});
				return;
			}
			// 不存在需要从服务器端重新获取数据
			result = await api.info(id);
			if (parseInt(result.code) === 0) {
				commit('queryDataM', {
					id,
					data: result.data
				});
			}
		}
	},
	plugins: [logger()]
});
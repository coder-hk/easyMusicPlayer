<template>
  <div class="recommendBox" v-if="hotData.length>0">
    <h3>热门歌曲推荐</h3>
    <ul class="list">
      <li class="item" v-for="item in hotData" :key="item.id">
        <router-link :to="{path:`/playsong/${item.id}`}">
          <div class="pic">
            <img :src="item.pic" alt />
          </div>
          <p v-text="item.title+'  ( '+item.author+' ) '"></p>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hotData: []
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  },
  methods: {
    async init() {
      let hotData = localStorage.getItem("hotData");
      if (hotData) {
        hotData = JSON.parse(hotData);
        if (new Date().getTime() - hotData.time < 30 * 60 * 1000) {
          this.hotData = hotData.data;
          return;
        }
      }
      let result = await this.$api.hotList();
      if (parseInt(result.code) === 0) {
        this.hotData = result.data;
        localStorage.setItem(
          "hotData",
          JSON.stringify({
            time: new Date().getTime(),
            data: result.data
          })
        );
      }
    }
  }
};
</script>
<style lang="less">
.recommendBox {
  margin-top: 0.4rem;
  padding: 0 0.3rem;

  h3 {
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.32rem;
    font-weight: normal;
  }

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item {
      width: 32%;
      overflow: hidden;

      a {
        display: block;
        .pic {
          height: 2.24rem;
          background: #ddd;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        p {
          height: 0.8rem;
          line-height: 0.4rem;
          font-size: 0.2rem;
          color: grey;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
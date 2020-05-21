<template>
  <div class="playBox" v-if="songDATA">
    <div class="bg">
      <img :src="songDATA.pic" alt />
    </div>

    <div class="content">
      <div class="header">
        <h2 v-text="songDATA.title"></h2>
        <p v-text="songDATA.author"></p>
      </div>
      <div class="lyric swiper-container" ref="lyric">
        <div class="wrapper swiper-wrapper">
          <p
            v-for="(item,index) in songDATA.lyric"
            v-text="item.content"
            :key="index"
            :class="`swiper-slide ${lyricIndex===index?'active':''}`"
          ></p>
        </div>
      </div>
      <div class="handle">
        <i @click="openVideo(songDATA.id)"></i>
        <i ref="audioBtn"></i>
        <i></i>
      </div>
    </div>

    <audio :src="songDATA.music" style="display:none" ref="audio"></audio>

    <!-- 热门推荐 -->
    <recommend></recommend>
  </div>
</template>

<script>
import Swiper from "swiper";
import Recommend from "../components/Recommend.vue";

export default {
  data() {
    return {
      lyricIndex: 0
    };
  },
  components: {
    Recommend
  },
  computed: {
    songDATA() {
      const { cur, list } = this.$store.state;
      return (
        list.find(item => {
          return parseInt(item.id) === cur;
        }) || null
      );
    }
  },
  created() {
    this.$store.dispatch("queryDataA", this.$route.params.id);
  },
  watch: {
    $route(to) {
      this.audioComplete();
      this.$store.dispatch("queryDataA", to.params.id);
    }
  },
  mounted() {
    this.initSwiper();
    this.audioHandle();
  },
  updated() {
    this.initSwiper();
    this.audioHandle();
  },
  methods: {
    // 初始化SWIPER
    initSwiper() {
      if (!this.songDATA) return;
      if (this.$swiper) {
        this.$swiper.updateSlides();
        this.$swiper.updateSize();
        return;
      }
      this.$swiper = new Swiper(this.$refs.lyric, {
        direction: "vertical",
        slidesPerView: "auto"
      });
    },
    // 跳转到MV
    openVideo(id) {
      this.$router.push(`/playvideo/${id}`);
    },
    // 控制音乐的播放和暂停
    audioPlay() {
      let { audio, audioBtn } = this.$refs;
      if (!audio) return;
      audio.play();
      audioBtn.className = "zanting";
      this.lyricAuto();
    },
    audioPause() {
      let { audio, audioBtn } = this.$refs;
      if (!audio) return;
      audio.pause();
      audioBtn.className = "";
      window.clearInterval(this.lyricTimer);
    },
    audioComplete() {
      window.clearInterval(this.lyricTimer);
      this.lyricIndex = 0;
      this.$swiper.slideTo(0, 0);
    },
    audioHandle() {
      // 控制音乐的自动播放
      let play = () => {
        this.audioPlay();
        document.removeEventListener("touchstart", play);
      };
      play();
      document.addEventListener("WeixinJSBridgeReady", play);
      document.addEventListener("touchstart", play);

      // 点击按钮控制暂停或者继续播放
      let { audio, audioBtn } = this.$refs;
      if (!audio) return;
      audioBtn.onclick = () => {
        if (audio.paused) {
          this.audioPlay();
          return;
        }
        this.audioPause();
      };
    },
    lyricAuto() {
      let { audio } = this.$refs;
      if (!audio) return;
      window.clearInterval(this.lyricTimer);
      this.lyricTimer = window.setInterval(() => {
        let duration = audio.duration,
          currentTime = audio.currentTime;
        if (currentTime >= duration) {
          this.audioComplete();
          return;
        }
        // 歌词对应和跟着动
        if (!this.songDATA) return;
        let n;
        this.songDATA.lyric.find((item, index) => {
          let { minutes, seconds } = item;
          if (minutes * 60 + parseInt(seconds) === Math.round(currentTime)) {
            n = index;
            return true;
          }
          return false;
        });
        if (n && n !== this.lyricIndex) {
          this.lyricIndex = n;
          let index = this.lyricIndex - 3;
          index < 0 ? (index = 0) : null;
          this.$swiper.slideTo(index, 200);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less">
.playBox {
  position: relative;
  padding-top: 0.4rem;

  .content {
    padding: 0 0.4rem;
    .header {
      text-align: center;
      h2 {
        line-height: 0.56rem;
        font-size: 0.38rem;
        font-weight: normal;
      }
      p {
        line-height: 0.44rem;
        font-size: 0.32rem;
        color: grey;
      }
    }

    .lyric {
      margin-top: 0.2rem;
      height: 4.9rem;
      text-align: center;
      overflow: hidden;

      p {
        height: 0.6rem !important;
        line-height: 0.6rem;
        color: rgba(0, 0, 0, 0.7);
        font-size: 0.3rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        transition: 0.2s;

        &.active {
          color: #22d59c;
        }
      }
    }

    .handle {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.5rem;

      i {
        margin: 0 0.3rem;
        width: 0.8rem;
        height: 0.8rem;
        border: 0.02rem solid rgba(0, 0, 0, 0.2);
        border-radius: 50%;

        &:nth-child(1) {
          background: url("../assets/images/ttpodicon.svg") no-repeat center
            center;
          background-size: 0.6rem 0.6rem;
        }

        &:nth-child(3) {
          background: url("../assets/images/shoucang.svg") no-repeat 50% 52%;
          background-size: 0.35rem 0.35rem;
        }

        &:nth-child(2) {
          background: url("../assets/images/bofang.svg") no-repeat 58% center;
          background-size: 0.45rem 0.45rem;

          &.zanting {
            background: url("../assets/images/zanting.svg") no-repeat center
              center;
            background-size: 0.45rem 0.45rem;
          }
        }
      }
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    img {
      display: block;
      width: 100%;
      opacity: 0.04;
    }
  }
}
</style>
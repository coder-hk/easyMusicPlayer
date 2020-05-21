<template>
  <div class="videoBox">
    <a href="javascript:;" class="returnBox" @click="returnFn"></a>
    <span class="tip"></span>
  </div>
</template>
<script>
export default {
  methods: {
    returnFn() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.videoBox {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);

  .returnBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 0.7rem;
    height: 0.7rem;
    background: url("../assets/images/huitui.svg") no-repeat center center;
    background-size: 50% 50%;
  }

  .tip {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    transform: translate(-50%, -50%);
    width: 2rem;
    height: 2rem;
    background: url("../assets/images/jingqingqidai.svg") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
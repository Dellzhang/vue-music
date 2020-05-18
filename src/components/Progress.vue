<template>
  <div class="progress">
    <div class="progrssWrapper" ref="progressBar">
      <div class="progressBar">
        <div v-if="!startHide" class="progressColor" ref="progress" :style="{width: `${percentage}%`}"></div>
        <div  v-if="startHide" class="progressColor" ref="progress"></div>
      </div>
      <div v-if="!startHide" class="progress-btn-wrap" ref="progressBtn" :style="{transform: `translate3d(${percentage}%, 0px, 0px)`}"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
      <div v-if="startHide" class="progress-btn-wrap" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Progress',
  props: {
    percentage: {
      default: 0
    },
  },
  data(){
    return {
      startX: null,
      left: null,
      startHide: false
    }
  },
  methods: {
    // 滑动开始
    progressTouchStart(e){
      this.startHide = true
      this.startX = e.touches[0].pageX 
      this.left = this.$refs.progress.clientWidth
    },
    // 滑动中
    progressTouchMove(e){
      const deltaX = e.touches[0].pageX - this.startX
      // console.log(deltaX)
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.left + deltaX))
      this.$emit('update:percentage',offsetWidth)
      this.$refs.progress.style.width = `${offsetWidth}px` //进度条偏移
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)` //小球偏移
    },
    //滑动结束
    progressTouchEnd(){
      this.startHide = false
      const endIndex = this.$refs.progress.clientWidth /this.$refs.progressBar.clientWidth
      this.$emit('progressEnd',endIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
  .progress{
    flex: 1;
    margin: 0px 5px;
    margin-right: 35px;
    .progrssWrapper{
      height: 13px;
      .progressBar{
        position: relative;
        top: 2px;
        height: 6px;
        background: rgba(0,0,0,0.3);
        .progressColor{
          position: absolute;
          height: 100%;
          background: #ffcd32;
        }
      }
      .progress-btn-wrap{
        position: relative;
        transform-origin:center;
        top: -14px;
        .progress-btn{
          width: 20px;
          height: 20px;
          border: 5px solid #fff;
          border-radius: 50%;
          background: #ffcd32;
        }
      }
    }
  }
</style>
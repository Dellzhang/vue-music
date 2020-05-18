<template>
  <transition name="fade">
    <div class="content">
      <div style=" position: relative;z-index: 10; background: #222;">
        <div class="top">
          <van-icon class="icon" name="arrow-left" @click="iconClick" />
          <div class="bar">
            <ul style="border-radius: 5px;border: 1px solid #333;">
              <li :class=" indexNum == 0? 'actived': ''" @click="liClick(0)">我喜欢的</li>
              <li :class=" indexNum == 1? 'actived': ''" @click="liClick(1)">最近听的</li>
            </ul>
          </div>
        </div>
        <div class="btnWrapper">
          <div class="btn" style="border: 1px solid rgba(255,255,255,0.5);border-radius: 100px;" @click="SuiOpen">
            <i class="iconfont">&#xe618;</i>
            <span>随机播放全部</span>
          </div>
        </div>
      </div>
      <div class="list" ref="user" style="height:300px">
        <ul>
          <li @click="open(item,index)" v-for="(item, index) of loveList" :key="index">
            <h2 v-if="item.Singer.name">{{item.Singer.name}}</h2>
            <h2 v-else>{{item.Singer.albumname}}</h2>
            <p v-if="item.Singer.singer">{{item.Singer.singer[0].name}}-{{item.Singer.albumname}}</p>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
import commonParams from '@/base/commonParams'
import {getMusic} from '../../utils/http'
import Bscroll from 'better-scroll'
export default {
  name: 'user',
  data(){
    return {
      list: [],
      RecommendList: [],
      indexNum: 0,
      loveList: []
    }
  },
  methods: {
    //返回上一层
    iconClick(){
      this.$router.back()
    },
    // 切换列表
    liClick(num){
      this.indexNum = num
    },
    // 播放音乐
    open(val,num){
      this.$store.dispatch('setSrc',val.src)
      this.$store.dispatch('setHide',true)
      this.$store.dispatch('setSinger',val.Singer)
      let arr = []
      for(let i=0; i<this.$store.state.loveList.length; i++){
        arr.push(this.$store.state.loveList[i].Singer)
      }
      this.$store.dispatch('setTemporaryList',arr)
      this.$store.dispatch('setIndex',num)
    },
    SuiOpen(){
      if(this.$store.state.loveList.length > 0){
        let max= this.$store.state.loveList.length -1 , min = 0; 
        let num = Math.floor(Math.random() * (max - min + 1) + min)
        this. $store.dispatch('setSrc',this.$store.state.loveList[num].src)
        this.$store.dispatch('setHide',true)
        this.$store.dispatch('setSinger',this.$store.state.loveList[num].Singer)
        let arr = []
        for(let i=0; i<this.$store.state.loveList.length; i++){
          arr.push(this.$store.state.loveList[i].Singer)
        }
        this.$store.dispatch('setTemporaryList',arr)
        this.$store.dispatch('setIndex',num)
      }
    }
  },
  mounted(){
    this.loveList = this.$store.state.loveList
    this.$nextTick(()=>{
      this.scroll = new Bscroll(this.$refs.user, {
        click: true,
        probeType: 3
      })
    })
  }
}
</script>
<style lang="scss" scoped>
  .fade-enter-active, .fade-leave-active{
    transition: all 0.5s 
  } 
  .fade-enter, .fade-leave-active{
    transform: translate3d(100%, 0, 0)
  }
  .content{
    position: fixed;
    top:0px;
    left: 0px;
    right: 0px;
    background: #222;
    z-index: 100;
    .top{
      position: relative;
      padding-top: 20px;
      .icon{
        position: absolute;
        left: 3%;
        font-size: 40px;
        top: 33%;
      }
      .bar{
        width: 50%;
        margin: 0 auto;
        ul{
          display: flex;
          box-sizing: border-box;
          li{
            width: 50%;
            padding: 10px;
            box-sizing: border-box;
            text-align: center;
            font-size: 26px;
            color: rgba(255,255,255,0.3);
            &.actived{
              color: #fff;
              background: #333;
            }
          }
        }
      }
    }
    .btnWrapper{
      width: 28%;
      background: #222;
      margin: 0 auto;
      margin-top: 60px;
      .btn{
        padding: 12px 0px;
        color: rgba(255,255,255,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        i{
          font-size: 25px;
          margin-right: 10px;
        }
        span{
          font-size: 22px;
        }
      }
    }
    .list{
      margin-top: 60px;
      position: relative;
      z-index: 1;
      ul{
        padding: 0px 60px;
        li{
          margin-bottom: 40px;
          h2{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: #fff;
            margin-bottom: 10px;
            font-size: 28px;
            font-weight: normal;
          }
          p{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 4px;
            color: rgba(255,255,255,0.3);
            font-size: 26px;
          }
        }
      }
    }
  }
</style>
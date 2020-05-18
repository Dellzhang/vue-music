<template>
  <transition name="fade">
    <div class="singerDetail">
      <div class="top">
        <van-icon class="icon" name="arrow-left" @click="iconClick" />
        <h1>{{singer_name}}</h1>
        <div ref="bgImage" :class="zIndex? 'singBg dis': 'singBg'" :style="{backgroundImage:`url(https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerId}.jpg?max_age=2592000)`}">
        </div>
      </div>
      <div class="listWrapper" :style="{transform: `translate3d(0px, ${pagey}px, 0px)`}"></div>
      <div class="lists" ref="wrapper">
        <div class="content">
          <ul>
            <li @click="openClick(item, index)" v-for="(item,index) of singerDetail" :key="index">
              <h2 class="name">{{item.musicData.albumname}}</h2>
              <p class="desc">{{singer_name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
  
</template>

<script>
import {getSingerDetail, getMusic} from '../../utils/http'
import commonParams from '@/base/commonParams'
import Bscroll from 'better-scroll'
export default {
  name: 'singerDetail',
  data(){
    return {
      singerDetail: [],
      singerId: '',
      singer_name: '',
      scroll: null,
      pagey: 0,
      maxScroll: -245,
      zIndex: false,
      imageHeight: 0
    }
  },
  mounted(){
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.singerId = this.$route.params.id
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 100,  //抓取歌手数据100条
        songstatus: 1,
        g_tk: 1664029744, 
        singermid: this.singerId //传入的不同歌手的Id
    })
    getSingerDetail(data).then( (res) =>{
      if(res.data.code == 0){
        this.singerDetail = res.data.data.list
        this.singer_name = res.data.data.singer_name
        this.$store.dispatch('setTemporaryList',this.singerDetail)
        // 初始话Bscroll
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            click: true,
            probeType: 3
          })
          if(this.scroll) {
            let me = this            //箭头函数中代理this
            this.scroll.on('scroll', (pos) => {  //监听scroll事件，拿到pos位置对象：有x和y属性
                if(pos.y < me.maxScroll){
                  this.zIndex = true
                  return
                }else{
                   me.pagey = pos.y
                }
            })
          }
        })
      }
    })
  },
  methods: {
    // 返回上一页
    iconClick(){
      this.$router.back()
    },
    // 播放音乐
    openClick(val, ins){
      this.getmusic(val, ins)
    },
    // 获取歌曲
    getmusic(val, ins){
      console.log(val)
      const data = Object.assign({}, commonParams, {
        songmid:val.musicData.songmid,
        filename: 'C400' + val.musicData.songmid + '.m4a',
        guid: 6319873028, //会变，以实时抓取的数据为准
        platform: 'yqq',
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        cid:205361747,
        uin: 0,
        format: 'json'
      })
      getMusic(data).then( res=>{
        if(res.data.code == 0){
          const http = 'http://ws.stream.qqmusic.qq.com/' + res.data.data.items[0].filename + '?vkey='+ res.data.data.items[0].vkey + '&guid=6319873028&uin=0&fromtag=66'
          this. $store.dispatch('setSrc',http)
          this.$store.dispatch('setHide',true)
          this.$store.dispatch('setSinger',val.musicData)
          this.$store.dispatch('setNoload',false)
          this.$store.dispatch('setIndex',ins)
        }
      })
    }
  },
  watch: {
    pagey(){
      if(this.pagey > 0) {
        const percent = Math.abs( this.pagey / this.imageHeight) + 1
        this.$refs.bgImage.style.transform = `scale(${ percent})`
      }
      if(this.pagey > this.maxScroll){
        this.zIndex = false
      }
    }
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
  .singerDetail{
    position: fixed;
    top:0px;
    left: 0px;
    right: 0px;
    background: #222;
    z-index: 100;
    .top{
      position: relative;
      h1{
        font-size: 30px;
        line-height: 60px;
        font-weight: normal;
        color: #fff;
        padding: 10px 0px;
        position: absolute;
        left: 44%;
        z-index: 40
      }
      .icon{
        position: absolute;
        left: 3%;
        font-size: 40px;
        top: 4%;
        z-index: 50
      }
      .singBg{
        background-size: cover;
        padding: 35%;
        background-repeat: no-repeat;
        position: relative;
        height: 0px;
        &.dis{
          z-index: 10;
          padding: 0px;
          height: 80px;
        }
      }
    }
    .listWrapper{
      position: relative;
      height: 1000px;
      background: #222;
      transition-duration: 0ms;
    }
    .content{
      padding-bottom:  60px;
    }
    .lists{
      position: fixed;
      top: 500px;
      height: 900px;
      left: 0px;
      right: 0px;
      background: #222;
      ul{
         padding: 10px 60px;
         padding-bottom: 40px;
        li{
          margin-top: 35px;
          .name{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: #fff;
            font-size: 24px;
            font-weight: normal;
          }
          .desc{
            font-size: 24px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 4px;
            color: rgba(255,255,255,0.3);
          }
        }
      }
    }
  }
</style>
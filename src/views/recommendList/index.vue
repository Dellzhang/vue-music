<template>
  <transition name="fade">
    <div class="singerDetail">
      <div class="top">
        <van-icon class="icon" name="arrow-left" @click="iconClick" />
        <h1>{{singer_name}}</h1>
        <div ref="bgImage" :class="zIndex? 'singBg dis': 'singBg'" :style="{backgroundImage:`url(${imgurl})`}">
        </div>
      </div>
      <div class="listWrapper" :style="{transform: `translate3d(0px, ${pagey}px, 0px)`}"></div>
      <div class="lists" ref="wrapper">
        <div  class="content">
          <ul>
            <li @click="openClick(item, index)" v-for="(item,index) of singerDetail" :key="index">
              <h2 class="name">{{item.name}}</h2>
              <p class="desc">{{item.singer[0].name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
  
</template>

<script>
// @ is an alias to /src
import {getrecommendDetail, getMusic} from '../../utils/http'
import commonParams from '@/base/commonParams'
import Bscroll from 'better-scroll'
export default {
  name: 'recommendList',
  data(){
    return {
      singerDetail: [],
      remmendId: '',
      singer_name: '',
      imgurl: '',
      scroll: null,
      pagey: 0,
      maxScroll: -245,
      zIndex: false,
      imageHeight: 0
    }
  },
  mounted(){
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.remmendId = this.$route.params.id
    this.imgurl = this.$route.query.src
    const data = Object.assign({}, commonParams, {
      uin: 0,
      format: 'json',
      notice: 0,
      needNewCode: 1,
      new_format: 1,
      pic: 500,
      disstid: this.remmendId, //关键数据
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      picmid: 1,
      nosign: 1,
      song_begin: 0,
      platform: 'h5',
      song_num: 100,
      _: +new Date()
    })
    getrecommendDetail(data).then( (res) =>{
      if(res.data.code == 0){
        this.singerDetail = res.data.cdlist[0].songlist
        this.singer_name = res.data.cdlist[0].dissname
        this.$store.dispatch('setTemporaryList', this.singerDetail)
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
      const data = Object.assign({}, commonParams, {
        songmid: val.mid,
        filename: 'C400' + val.mid + '.m4a',
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
          this.$store.dispatch('setSinger',val)
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
        left: 20%;
        z-index: 40;
      }
      .icon{
        position: absolute;
        left: 3%;
        font-size: 40px;
        top: 4%;
        z-index: 50;
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
      height: 2000px;
      background: #222;
      transition-duration: 0ms;
    }
    .lists{
      position: fixed;
      top: 450px;
      height: 900px;
      left: 0px;
      right: 0px;
      background: #222;
      bottom: 0px;
      z-index: 1;
      ul{
        padding: 30px 60px;
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
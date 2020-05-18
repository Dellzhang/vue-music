<template>
  <transition name="fade">
    <div class="singerDetail">
      <div class="top">
        <van-icon class="icon" name="arrow-left" @click="iconClick"/>
        <h1>{{topInfo.ListName}}</h1>
        <div ref="bgImage" :class="zIndex? 'singBg dis': 'singBg'" :style="{backgroundImage:`url(https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}_0.jpg`}">
        </div>
      </div>
      <div class="listWrapper" :style="{transform: `translate3d(0px, ${pagey}px, 0px)`}"></div>
      <div class="lists" ref="wrapper">
        <div class="cont">
          <ul>
            <li  v-for="(item,index) of topList" :key="index">
              <div class="imgpai">
                <span>
                  <i v-if="index == 0" class="iconfont" style="color: #ffd332">&#xe63d;</i>
                  <i v-if="index == 1" class="iconfont" style="color: #c9c9c9">&#xe63d;</i>
                  <i v-if="index == 2" class="iconfont" style="color: #fdb61b">&#xe63d;</i>
                  <i class="text" v-if=" index>=3">{{index}}</i>
                </span>
              </div>
              <div class="descWrapper" @click="open(item,index)">
                <h2 class="name">{{item.data.albumname}}</h2>
                <p class="desc">{{item.data.singer[0].name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {getTopLIst, getMusic} from '../../utils/http'
import commonParams from '@/base/commonParams'
import Bscroll from 'better-scroll'
export default {
  name: 'toplist',
  data(){
    return {
      topList: [],
      topId: '',
      topInfo: {},
      albummid: '',
      num: 0,
      scroll: null,
      pagey: 0,
      maxScroll: -245,
      zIndex: false,
      imageHeight: 0
    }
  },
  mounted(){
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.topId = this.$route.params.id
    const data = Object.assign({}, commonParams, {
        topid: this.topId,
        page: 'detail',
        type: 'top',
        tpl: 3,
        platform: 'h5',
        needNewcode: 1
    })
    getTopLIst(data).then( res=> {
      if(res.data.code == 0){
        this.topList = res.data.songlist
        this.topInfo = res.data.topinfo
        this.albummid = this.topList[0].data.albummid
        this.$store.dispatch('setTemporaryList', this.topList)
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
    // 返回父路由
    iconClick(){
      this.$router.back()
    },
    // 播放音乐
    open(val, ins){
      this.getmusic(val, ins)
    },
    // 获取歌曲
    getmusic(val, ins){
      const data = Object.assign({}, commonParams, {
        songmid:val.data.songmid,
        filename: 'C400' + val.data.songmid + '.m4a',
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
          this.$store.dispatch('setSinger',val.data)
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
    bottom: 0px;
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
        left: 40%;
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
        height: 0;
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
    }
    .lists{
      position: fixed;
      top: 450px;
      // height: 100%;
      height: 900px;
      left: 0px;
      right: 0px;
      background: #222;
      box-sizing: border-box;
      ul{
          box-sizing: border-box;
          padding: 10px 60px;
          padding-bottom: 40px;
        li{
          margin-top: 35px;
          display: flex;
          align-items: center;
          .imgpai{
            margin-right: 20px;
            span{
             i{
               font-size: 60px;
               font-style: normal;
               &.text{
                 font-size: 35px;
                 margin-left: 20px;
                 margin-right: 20px;
               }
             }
            }
          }
          .descWrapper{
            flex: 1;
            overflow: hidden;
          }
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
<template>
  <div class="content">
    <div class="background">
      <img width="100%" height="100%" :src="imgs" alt="">
    </div>
    <div class="top">
      <van-icon name="arrow-down" class="icon" @click="IconClick" />
      <h2>{{name}}</h2>
      <h3>{{singer}}</h3>
    </div>
    <v-touch @swipeleft="swiperleft" @swiperight="swiperright" class="wrapper">
      <div>
        <div style="width: 315px; height: 315px" :id=" state == 0 ? '': 'stateLeft'" :class=" this.$store.state.show? 'imgWrapper ami': 'imgWrapper' ">
          <img :src="imgs" alt="">
        </div>
        <div :id="state == 1 ? 'StateRight': ''" class="LyricsList" ref="lyricList">
          <div class="box" >
            <p ref="lyricLine" :class="(index == text)? 'actived': ''" v-for="(item,index) of this.$store.state.currentLyric.lines" :key="index">{{ item.txt}}</p>
          </div>
        </div>
      </div>
    </v-touch>
    <p v-show="state == 0" class="title">{{title}}</p>
    <div class="bottom">
      <div class="iconIndex">
        <span :class=" state == 0 ? 'tive': ''"></span>
        <span :class=" state == 1 ? 'tive': ''"></span>
      </div>
      <div class="prage">
        <p>{{playTime}}</p>
        <vue-progress @progressEnd="progressEnd" :percentage="percentage"></vue-progress>
        <!-- <van-progress :percentage="percentage" track-color="rgba(0,0,0,0.3)" color="#ffcd32" :show-pivot= "pivot"/> -->
        <p>{{times}}</p>
      </div>
      <div class="iconWrapper">
        <i v-show=" this.$store.state.playState == 0" class="icon-sequence icon" @click="tigger(1)" ></i>
        <i v-show="this.$store.state.playState == 1" class="icon-loop icon" @click="tigger(2)" ></i>
        <i v-show="this.$store.state.playState == 2" class="icon-random icon" @click="tigger(0)"></i>
        <i class="iconfont icon" @click="prev">&#xe616;</i>
        <i class="iconfont icon center" v-if="this.$store.state.show == true" @click="colse">&#xe723;</i>
        <i class="iconfont icon center" v-if="this.$store.state.show == false" @click="open">&#xe618;</i>
        <i class="iconfont icon" @click="next">&#xe60e;</i>
        <i class="iconfont icon" v-if="!love" @click="loveClick">&#xe63a;</i>
        <i class="iconfont icon" v-if="love" @click="loveClick" style="color: red">&#xe621;</i>
      </div>
    </div>
  </div>
</template>

<script>
import Lyric from 'lyric-parser'
import {getMusicKey, getMusic} from '../utils/http'
import commonParams from '@/base/commonParams'
import Bscroll from 'better-scroll'
import VueProgress from '@/components/Progress.vue'
export default {
  name: 'VueAudio',
  components: {
    VueProgress
  },
  props: {
    currentTime: {
      type: Number
    },
    playTime: {
      type: String
    },
    times: {
      type: String
    },
    percentage: {
      type: Number
    },
    num: {
      type: Number
    },
    text: {
      type: Number
    },
    handleLyric: {
      type: Function
    },
    title: {
      type: String
    },
    scroll: {
      default: null
    }
  },
  data(){
    return {
      src: '', //播放地址
      top: false, //加载歌曲信息
      pivot: false,
      name: '', //歌曲名字
      singer: '', //歌手名字
      state: 0, //滑动状态 0：左边, 1: 右边
      imgs: '' , //歌曲图片
      // text: 0, //播放歌曲的索引
      currentLineNum: 0,
      // num: 0,
      love: false,
    }
  },
  watch: {
    top: {
      handler(){
        this.name = this.$store.state.Singer.albumname
        if(this.$store.state.Singer.singer){
          this.singer = this.$store.state.Singer.singer[0].name
          if(this.$store.state.Singer.albumid){
            this.imgs = 'http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_' + this.$store.state.Singer.albumid +'_0.jpg'
          }else{
            this.imgs = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + this.$store.state.Singer.album.pmid +'.jpg?max_age=2592000'
          }
          
        }
        if((!this.$store.state.noload ) || this.$store.state.firstSuo){
          this.getLyric(this.$store.state.Singer)
        }
        this.$nextTick(() => {
          let scroll  
          scroll = new Bscroll(this.$refs.lyricList, {
            click: true,
            probeType: 3
          })
          this.$emit('update:scroll',scroll)
        })
      }
    },
    percentage(){
      if(this.percentage == 100){
        this.$emit('changeNum',0)
        // 判断播放状态
        if(this.$store.state.playState == 1){
          this.top = !this.top
          this.open()
        }else{
          this.next()
        }
      }
    },
    // 监听store.lovelist
    '$store.state.lovelist': {
      handler(){
        if(this.$store.state.loveList.length > 0){
          for(let i=0; i< this.$store.state.loveList.length; i++){
            if(this.$store.state.src == this.$store.state.loveList[i].src ){
              this.love = true
            }
          }
        }
      },
      immediate: true
    },
    num(){
      if(this.num > 5){
        let lineEl = this.$refs.lyricLine[this.num - 5] //保证歌词在中间位置滚动
        this.scroll.scrollToElement(lineEl, 1000)
      }else{
        this.scroll.scrollTo(0, 0, 1000)//滚动到顶部
      }
    }
  },
  mounted() {
    this.$nextTick( ()=>{
    this.top = !this.top
    })
  },
  methods: {
    // 获取歌词
    getLyric(val){
      //实例化lyric对象
      let mid = ''
      if(val.songmid){
        mid = val.songmid
      }else{
        mid = val.mid
      }
      const datas = Object.assign({}, commonParams, {
          songmid: mid,
          pcachetime: +new Date(),
          platform: 'yqq',
          hostUin: 0,
          needNewCode: 0,
          g_tk: 5381, //会变化，以实时数据为准
          format: 'json' //规定为json请求
      })

      getMusicKey(datas).then(res=> {
        if(res.data.code == 0){
          var result2 = this.decode(res.data.lyric)
          if(this.$store.state.currentLyric.lines.length > 0)this.$store.state.currentLyric.stop()
          this.$store.dispatch('setLyrics',result2)
          let currentLyric = new Lyric(this.$store.state.Lyrics, this.handleLyric)
          this.$store.dispatch('setCurrentLyric', currentLyric)
          if( this.$store.state.currentLyric){
            this.open()
          }
        }
      })
    },
    // 将歌词解锁
    decode(input) {
      let  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }
        let  utf8_decode = function(utftext) {  
        var string = ""; 
        var c1, c2 ,c3
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
        }  
        output =utf8_decode(output);  
        return output;  
    },
    // 播放音乐
    open(){
      let audio= document.getElementById('audio')
      this.$store.dispatch('setShow',true)
      audio.play()
      if(this.$store.state.currentLyric){
        if(this.$store.state.firstSuo){
           this.$store.state.currentLyric.seek(audio.currentTime * 1000)
        }else{
          this.$store.state.currentLyric.togglePlay()
        }
      }
    },
    // 关闭音乐
    colse(){
      this.$store.dispatch('setShow',false)
      let audio = document.getElementById('audio')
      audio.pause()
      if(this.$store.state.currentLyric){
        this.$store.state.currentLyric.togglePlay()
      }
    },
    // 关闭播放器
    IconClick(){
      this.$store.dispatch('setHide',false)
      this.$store.dispatch('setfirstSuo',false)
    },
    // 向左划
    swiperleft(){
      this.state = 1
    },
    // 切换播放状态
    tigger(val){
     this.$store.dispatch('setPlayState',val)
    },
    // 向又划
    swiperright(){
      this.state = 0
    },
    // 监听进度条
    progressEnd(val){
      this.$emit('progressEndIndex', val)
    },
    // 点击喜欢
    loveClick(){
      this.love = !this.love
      if(this.love){
        this.$store.dispatch('setloveList', {
          type: 'Add',
          data: {
            src: this.$store.state.src,
            Singer: this.$store.state.Singer,
            Lyrics: this.$store.state.Lyrics
          }
        })
      }else{
        this.$store.dispatch('setloveList', {
          type: 'delete',
          data: {
            src: this.$store.state.src,
            Singer: this.$store.state.Singer,
          }
        })
      }
    },
    // 点击下一曲
    next(){
      this.$emit('changeNum',0)
      this.Nextgetmusic()
    },
    // 点击上一曲
    prev(){
      this.$emit('changeNum',0)
      this.getmusic()
    },
    // 获取播放地址
    getmusic(){
      let val, num
      if(this.$store.state.playState == 0 || this.$store.state.playState == 1){
        if(this.$store.state.Index == this.$store.state.temporaryList.length-1 ){
          val = this.$store.state.temporaryList[0]
        }else{
          val = this.$store.state.temporaryList[this.$store.state.Index +1]
        }
      }else if(this.$store.state.playState == 2){
        let max= this.$store.state.temporaryList.length-1 , min = 0; 
        num = Math.floor(Math.random() * (max - min + 1) + min)
        val = this.$store.state.temporaryList[num]
      }
      let songmid, filename
      if(val.data){
        songmid = val.data.songmid
        filename = 'C400' + val.data.songmid + '.m4a'
      }else if(val.musicData){
        songmid = val.musicData.songmid
        filename = 'C400' + val.musicData.songmid + '.m4a'
      }else if(val.mid){
        songmid = val.mid
        filename = 'C400' + val.mid + '.m4a'
      }else{
        songmid = val.songmid
        filename = 'C400' + val.songmid + '.m4a'
      }
      const data = Object.assign({}, commonParams, {
        songmid,
        filename,
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
          if(val.data){
            this.$store.dispatch('setSinger',val.data)
          }else if(val.musicData) {
            this.$store.dispatch('setSinger',val.musicData)
          }else{
             this.$store.dispatch('setSinger',val)
          }
          this.$store.dispatch('setNoload',false)
          if(this.$store.state.playState || this.$store.state.playState == 1){
            if(this.$store.state.Index == this.$store.state.temporaryList.length-1){
              this.$store.dispatch('setIndex',0)
            }else{
            this.$store.dispatch('setIndex',this.$store.state.Index + 1)
            }
          }else if(this.$store.state.playState == 2){
             this.$store.dispatch('setIndex',num)
          }
          this.top = !this.top
        }
      })
    },
    Nextgetmusic(){
      let val, num
      if(this.$store.state.playState == 0 || this.$store.state.playState == 1){
        if(this.$store.state.Index == this.$store.state.temporaryList.length-1 ){
          val = this.$store.state.temporaryList[0]
        }else{
          val = this.$store.state.temporaryList[this.$store.state.Index +1]
        }
      }else if(this.$store.state.playState == 2){
        let max= this.$store.state.temporaryList.length-1 , min = 0; 
        num = Math.floor(Math.random() * (max - min + 1) + min)
        val = this.$store.state.temporaryList[num]
      }
      console.log(val)
      let songmid, filename
      if(val.data){
        songmid = val.data.songmid
        filename = 'C400' + val.data.songmid + '.m4a'
      }else if(val.musicData){
        songmid = val.musicData.songmid
        filename = 'C400' + val.musicData.songmid + '.m4a'
      }else if(val.mid){
        songmid = val.mid
        filename = 'C400' + val.mid + '.m4a'
      }else{
        songmid = val.songmid
        filename = 'C400' + val.songmid + '.m4a'
      }
      const data = Object.assign({}, commonParams, {
        songmid,
        filename,
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
          if(val.data){
            this.$store.dispatch('setSinger',val.data)
          }else if(val.musicData) {
            this.$store.dispatch('setSinger',val.musicData)
          }else{
             this.$store.dispatch('setSinger',val)
          }
          this.$store.dispatch('setNoload',false)
          if(this.$store.state.playState == 0 || this.$store.state.playState == 1){
            if(this.$store.state.Index == this.$store.state.temporaryList.length-1){
              this.$store.dispatch('setIndex',0)
            }else{
            this.$store.dispatch('setIndex',this.$store.state.Index + 1)
            }
          }else if(this.$store.state.playState == 2){
             this.$store.dispatch('setIndex',num)
          }
          this.top = !this.top
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #stateLeft{
    opacity: 0;
  }
  #StateRight{
    transform: translate3d(11%,0px,0px);
  }
  .title{
    width: 80%;
    margin: 0 auto;
    text-align: center;
    color: rgba(255,255,255,0.5);
    margin-top: 50px;
    line-height: 40px;
    font-size: 26px;
  }
  .iconIndex{
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    span{
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      margin: 0px 10px;
      &.tive{
        width: 40px;
        border-radius: 10px;
        background: rgba(255,255,255,0.8);
      }
    }
  }
  .content{
    position: fixed;
    z-index: 1800;
    background: #222;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);
    }
    .top{
      display: flex;
      flex-direction: column;
      color: #fff;
      justify-content: center;
      align-items: center;
      position: relative;
      .icon{
        position: absolute;
        left: 5%;
        color: #ffcd32;
        font-size: 40px;
        top:10%;
      }
      h2{
        padding-top: 10px;
        font-size: 30px;
        font-weight: normal;
        line-height: 60px;
        // font-family: '石体'
        color: #fff;
      }
      h3{
        margin-top: 10px;
        font-size: 26px;
        font-weight: normal;
        color: #fff;
      }

    }
    .imgWrapper{
    //  width: 80%;
     margin: 0 auto;
     margin-top: 35px;
     border-radius: 50%;
     border: 15px solid rgba(255, 255, 255, 0.1);
     box-sizing: border-box;
     &.ami{
      animation: go 20s linear infinite;
     }
     img{
      display: flex;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      overflow: hidden;
     }
    }
    .bottom{
      position: absolute;
      width: 100%;
      bottom: 9%;
      .prage{
        width: 73%;
        margin:  0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        p{
          color: #fff;
          font-size: 22px;
        }

      }
      .prage /deep/ .van-progress{
        flex: 1;
        margin: 0 10px;
      }
      .iconWrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        opacity: 1;
        transition: all 1s;
        .icon{
          font-size: 60px;
          margin:0px  30px;
          &.center{
            font-size: 70px;
          }
        }
      }
    }
    .LyricsList{
      width: 80%;
      margin-top: 30px;
      position: fixed;
      bottom: 29%;
      top: 10%;
      transform: translate3d(200%,0px,0px);
      // left: 101%;
      overflow: hidden;
      transition: 1s;
      .box{
        overflow: hidden;
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        transition-duration: 0ms;
        transform: translate(0px, -64px) translateZ(0px);
      }
      p{
        height: 56px;
        color: rgba(255,255,255,0.5);
        font-size: 26px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        &.actived{
          color: #fff;
        }
      }
    }
  }
  @keyframes go {
    0%{
      transform: rotate(0deg)
    }
    100%{
      transform: rotate(360deg)
    }
  }
</style>

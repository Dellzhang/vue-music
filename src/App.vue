<template>
  <div id="app">
    <div id="title">
      <h2>My Music</h2>
      <van-icon id="user" name="contact" @click="UserClick"/>
    </div>
    <div id="nav">
      <ul id="head">
        <router-link :id="path=== '/'? 'actived': ''" to="/" tag="li">推荐</router-link>
        <router-link :id="path=== '/singer'? 'actived': ''" to="/singer" tag="li">歌手</router-link>
        <router-link :id="path=== '/ranking'? 'actived': ''" to="/ranking" tag="li">排行</router-link>
        <router-link :id="path=== '/search'? 'actived': ''" to="/search" tag="li">搜索</router-link>
      </ul>
    </div>
    <div class="vido"  v-if="name != ''">
      <van-image round  width="2.5rem" height="2.5rem" fit="fill" :src="imgs" @click="IconClick"/>
      <div id="text">
        <h2 class="name">{{name}}</h2>
        <p class="user">{{singer}}</p>
      </div>
      <div class="iconWrapper">
        <van-circle v-model="percentage" :rate="rate" size="35px" :stroke-width= 'width' layer-color="rgba(255,205,49,0.2)" color="rgba(255,205,49,0.8)"/>
        <i v-if="this.$store.state.show == false" class="iconfont font" @click="open">&#xe63b;</i>
        <i v-if="this.$store.state.show == true" class="iconfont font"  @click="colse">&#xe69d;</i>
      </div>
      <div id="right">
        <van-icon name="ascending" class="icon" @click="iconOpenClick"/>
      </div>
    </div>
     <van-action-sheet v-model="downState" :round="round" title="播放列表" cancel-text="取消" @cancel="onCancel" :overlay="overlay">
      <div class="scorllWrapperlist" ref="payList">
        <div class="playList">
          <div v-for="(item ,index) of this.$store.state.temporaryList" :key="index" class="playItem">
            <p v-if="item.musicData" class="titleWrapper">
              <i v-if="index == iconIndex" class="icon-play play"></i>
              {{item.musicData.albumname}}
            </p>
            <p v-else-if="item.data"  class="titleWrapper">
              <i v-if="index == iconIndex" class="icon-play play"></i>
              {{item.data.albumname}}
            </p>
            <p v-else-if="item.albumname"  class="titleWrapper">
              <i v-if="index == iconIndex" class="icon-play play"></i>
              {{item.albumname}}
            </p>
            <p v-else  class="titleWrapper">
              <i v-if="index == iconIndex" class="icon-play play"></i>
              {{item.name}}
            </p>
            <p class="iconbox">
              <template v-for="(itm,inx) of arr">
                <i class="icon-favorite icons" v-if=" itm == index"  :key="inx+'.'"  @click="NotfavoriteClcik(item)"></i>
              </template>
              <template v-for="(itm,inx) of notArr">
                <i class="icon-not-favorite icons" v-if=" itm == index"  :key="inx+'*'" @click="favoriteClcik(item)"></i>
              </template>
              <i class="icon-delete" @click="deleteList(index)"></i>
            </p>
          </div>
        </div>
      </div>
     </van-action-sheet>
    <vue-audio @progressEndIndex="progressEndIndex" @changeNum="changeNum" :scroll.sync="scroll" :currentTime="currentTime" :title="title" :percentage.sync="percentage" :handleLyric="handleLyric" :playTime.sync="playTime" :num.sync="num"  :text.sync="text" :times.sync="times" v-if="this.$store.state.hide"></vue-audio>
    <audio @timeupdate="updateTime"  id="audio" ref="audio" :src="this.$store.state.src"></audio>
    <router-view/>
  </div>
</template>

<script>
import VueAudio from '@/components/VAudio.vue'
import commonParams from '@/base/commonParams'
import {getMusicKey, getMusic} from './utils/http'
import Bscroll from 'better-scroll'
export default {
  name: 'app',
  components: {
     VueAudio
  },
  data(){
    return {
      path: '',
      rate: 80,
      width: 50, 
      name: '', //当前播放的歌曲
      singer: '', //当前播放的歌手
      imgs: '', //播放歌曲的图片链接
      percentage: 0,  //进度条的进度
      playTime: '0:00', //当前歌曲播放的时间
      times: '0:00', //歌曲总时长
      currentTime: 0,  //当前歌曲播放的时间
      currentTimes: 0,  //当前歌曲播放的时间
      num: 0,  //歌词从0开始
      text: 0,  //播放音乐的索引
      title: '', //播放音乐的文字
      downState: false, //播放列表
      round: false,  //边框不圆角
      overlay: false,  //不显示遮罩层
      scroll: null, //滑动对象
      iconIndex: '',  //选中播放的音乐的索引
      arr: [],  //喜欢列表的索引
      notArr: []
    }
  },
  watch: {
    '$route': {
      handler(val){
         this.path = val.path
      },
      immediate: true
    },
    '$store.state.Singer': {
      handler(){
        if(this.$store.state.Singer){
          this.name = this.$store.state.Singer.albumname
          this.singer = this.$store.state.Singer.singer[0].name
          if(this.$store.state.Singer.albumid){
            this.imgs = 'http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_' + this.$store.state.Singer.albumid +'_0.jpg'
          }else{
            this.imgs = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + this.$store.state.Singer.album.pmid +'.jpg?max_age=2592000'
          }
        }
      }
    },
    '$store.state.hide': {
      handler(){
        if(this.$store.state.hide){
          let audio = document.getElementById('audio')
          audio.oncanplay = ()=>{
            let time = audio.duration
            let second = parseInt((audio.duration % 60).toString()) 
            let minute =parseInt((audio.duration / 60).toString()) 
            this.times = minute + ':' + second
          }
        }
      },
      immediate: true
    },
    percentage(){
      if(!this.$store.state.hide){
        if(this.percentage == 100){
          this.num = 0
          // 判断播放状态
          // 记录第一次缩小播放器
           this.$store.dispatch('setfirstSuo',true)
          if(this.$store.state.playState == 1){
            let audio= document.getElementById('audio')
            this.$store.dispatch('setShow',true)
            audio.play()
            if(this.$store.state.currentLyric){
              this.$store.state.currentLyric.togglePlay()
            }
          }else{
            this.Nextgetmusic()
          }
        }
      }
    },
    '$store.state.src'(){
      if(!this.$store.state.hide){
        setTimeout(()=> {
          let audio= document.getElementById('audio')
          audio.play()
        },500)
      }
    }
  },
  methods: {
    // 显示播放器
    IconClick(){
      this.$store.dispatch('setHide',true)
      this.$store.dispatch('setNoload',true)
      this.currentTime = this.currentTimes
    },
    // 播放音乐
    open(){
      let audio = document.getElementById('audio')
      this.$store.dispatch('setShow',true)
      audio.play()
      if(this.$store.state.currentLyric){
        this.$store.state.currentLyric.togglePlay()
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
    // 取消按钮
    onCancel(){
      this.downState = false
    },
    // 打开播放列表
    iconOpenClick(){
      this.downState = true
      this.iconIndex = this.$store.state.Index
      this.PloveLsit()
    },
    // 判断喜欢的列表
    PloveLsit(){
      let loveList = this.$store.state.loveList
      let linList = this.$store.state.temporaryList
      let arr = [], notarr = []
      if(linList[0].data){
        for(let i= 0; i<linList.length; i++){
          let k = 0
          for(let j=0; j<loveList.length; j++){
            if(linList[i].data.albummid == loveList[j].Singer.albummid){
              arr.push(i)
              break;
            }else{
              k++
            }
            if(k == loveList.length){
              notarr.push(i)
            }
          }
        }
      }else if(linList[0].musicData){
        for(let i= 0; i<linList.length; i++){
          let k = 0
          for(let j=0; j<loveList.length; j++){
            if(linList[i].musicData.albummid == loveList[j].Singer.albummid){
              arr.push(i)
              break;
            }else{
              k++
            }
            if(k == loveList.length){
              notarr.push(i)
            }
          }
        }
      }else if(linList[0].mid){
       for(let i= 0; i<linList.length; i++){
          let k = 0
          for(let j=0; j<loveList.length; j++){
            if(linList[i].mid == loveList[j].Singer.mid){
              arr.push(i)
              break;
            }else{
              k++
            }
            if(k == loveList.length){
              notarr.push(i)
            }
          }
        }
      }else{
       for(let i= 0; i<linList.length; i++){
          let k = 0
          for(let j=0; j<loveList.length; j++){
            if(linList[i].albummid == loveList[j].Singer.albummid){
              arr.push(i)
              break;
            }else{
              k++
            }
            if(k == loveList.length){
              notarr.push(i)
            }
          }
        }
      }
      this.arr = arr
      this.notArr = notarr
    },
    // 点击喜欢
    favoriteClcik(val){
      this.getPlay(val)
    },
    // 点击不喜欢
    NotfavoriteClcik(val){
      if(val.data){
        this.$store.dispatch('setloveList', {
          type: 'delete',
          data: {
            src: '',
            Singer: val.data,
            Lyrics: ''
          }
        })
      }else if(val.musicData){
        this.$store.dispatch('setloveList', {
          type: 'delete',
          data: {
            src: '',
            Singer: val.musicData,
            Lyrics: ''
          }
        })
      }else if(val.mid){
        this.$store.dispatch('setloveList', {
          type: 'delete',
          data: {
            src: '',
            Singer: val,
            Lyrics: ''
          }
        })
      }else{
        this.$store.dispatch('setloveList', {
          type: 'delete',
          data: {
            src: '',
            Singer: val,
            Lyrics: ''
          }
        })
      }
      this.PloveLsit()
    },
    // 删除列表歌曲
    deleteList(val){
      this.$store.dispatch('updateTemporaryList', val)
    },
    // 监听进度条的变化
    progressEndIndex(val){
      let audio = document.getElementById('audio')
      audio.currentTime = audio.duration * val ;
      if(this.$store.state.currentLyric){
        this.$store.state.currentLyric.seek(audio.currentTime * 1000)//偏移歌词到拖动时间的对应位置
      }
    },
    // 喜欢获取播放地址
    getPlay(val){
      console.log(val)
      let songmid , filename
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
        songmid: songmid,
        filename: filename,
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
          if(val.data){
           this.$store.dispatch('setloveList', {
              type: 'Add',
              data: {
                src: http,
                Singer: val.data,
                Lyrics: ''
              }
            })
          }else if(val.musicData){
            this.$store.dispatch('setloveList', {
              type: 'Add',
              data: {
                src: http,
                Singer: val.musicData,
                Lyrics: ''
              }
            })
          }else if(val.mid){
           this.$store.dispatch('setloveList', {
              type: 'Add',
              data: {
                src: http,
                Singer: val,
                Lyrics: ''
              }
            })
          }else{
           this.$store.dispatch('setloveList', {
              type: 'Add',
              data: {
                src: http,
                Singer: val,
                Lyrics: ''
              }
            })
          }
          this.PloveLsit()
        }
      })
    },
    // 改变播放时间
    updateTime(e){
      // console.log(e.target.currentTime)
      let audio = document.getElementById('audio')
      let tm = this.currentTimes = e.target.currentTime
      if(tm != 0){
        let second = parseInt((tm % 60).toString()) 
        let minute =parseInt((tm / 60).toString())
        if(second < 10){
          second = '0' + second
        }
        this.playTime = minute + ':' + second
        this.percentage = (tm / audio.duration)*100
      }
    },
    // 跳转我的
    UserClick(){
      this.$router.push('/user')
    },
    // 监听歌词变化
    handleLyric(val){
      this.title = val.txt
      this.text = val.lineNum
      this.currentLineNum = val.lineNum
      if(val.lineNum > 5 && (!this.$store.state.noload)){
         this.num = val.lineNum//保证歌词在中间位置滚动
      }else if(this.$store.state.noload){
        if(val.lineNum > 5){
          this.num = val.lineNum
        }else{
           this.num = val.lineNum
        }
      }
      // console.log(val)
      // console.log(this.num, this.text)
    },
    // 歌曲播放完成时间清零
    changeNum(){
      this.num = 0
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
        }
      })
    }
  }
}
</script>

<style lang="scss">
  *{
    margin: 0px;
    padding: 0px;
  }
  body{
    background: #222;
    color: #fff;
  }
  #app{
   color: #ffcd32;
  }
  #title{
    font-size: 24px;
    font-weight: normal;
    text-align: center;
    line-height: 70px;
    position: relative;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    background: #222;
    z-index: 99
  }
  #nav{
    position: fixed;
    top: 60px;
    left: 0px;
    right: 0px;
    background: #222;
    z-index: 99
  }
  #user{
    position: absolute;
    top: 33%;
    right: 10px;
    font-size: 32px;
  }
  #head{
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
    li{
      color:rgba(255,255,255,0.5);
      padding-bottom: 5px;
    }
    #actived{
      border-bottom: 4px solid #ffcd32;
      color: #ffcd32;
    }
  }
  .vido{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 100px;
    background: #333;
    display: flex;
    align-content: center;
    #text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20px;
      flex: 1;
      .name{
        color: #fff;
        font-weight: normal;
        font-size: 26px;
        margin-bottom: 5px;
      }
      .user{
        color: rgba(255,255,255,0.3);
        font-size: 24px;
      }
    }
    .iconWrapper{
      margin-top: 13px;
      position: relative;
      .font{
        position: absolute;
        top: 22%;
        left: 32%;
        font-size: 24px;
        color: rgba(255,205,49,0.5)
      }
    }
    #right{
      margin-left: 20px;
      .icon{
        font-size: 60px;
        height: 100px;
        line-height: 100px;
      }
    }
  }
  .scorllWrapperlist{
    width: 80%;
    margin: 0 auto;
    height: 610px;
    .playList{
      margin-top: 20px;
      .playItem{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0px;
        p{
          font-size: 28px;
          position: relative;
          &.titleWrapper{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .play{
            position: absolute;
            left: -30px;
            top: 8px;
            color: rgba(255,205,49,0.5);
            font-size: 22px;
          }
        }
        .iconbox{
          color: #ffcd32;
          font-size: 22px;
          .icons{
            margin-right: 20px;
          }
        }
      }
    }
  }
  .vido /deep/ .van-image--round{
    margin-top: 5px;
    margin-left: 20px;
  }
  #app /deep/ .van-action-sheet{
    height: 420px;
    background: #333;
    color: rgba(255,255,255,0.3);
  }
   #app /deep/ .van-action-sheet__cancel{
    background: #222;
  }
  #app /deep/ .van-action-sheet__content{
    overflow: scroll;
  }
  #app /deep/ .van-action-sheet__cancel::before{
     background: #222;
  }


</style>

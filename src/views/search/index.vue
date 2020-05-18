<template>
  <div class="content">
    <div class="inpWrapper">
      <van-icon name="search"  class="icon" />
      <input type="text" v-model="value" @change="change" placeholder="搜索歌曲、歌手">
      <van-icon v-show="value !== ''" @click="clear"  name="clear" class="clear" />
    </div>
    <div v-if="loading"  class="load">
      <van-loading type="spinner" size="22px" color="#ccc" />
    </div>
    <div class="hast" v-show="(!loading) && (searchList.length == 0)">
      <h3>热门搜索</h3>
      <ul>
        <li v-for="(item,index) of hotkeyList" :key="index">
          <span @click="hotClick(item.k)">{{item.k}}</span>
        </li>
      </ul>
    </div>
    <div class="hositry" v-if="(searchList.length == 0 && history.length>0)">
      <div class="desc">
        搜索历史
        <i class="iconfont la" @click="history = []">&#xe615;</i>
      </div>
      <div class="desc item" v-for="(item,index) of history" :key="index">
        {{item}}
        <i class="iconfont la" @click="dele(index)">&#xe608;</i>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item, index) of searchList" :key="index">
          <i class="iconfont icon" v-if="index == 0">&#xe66b;</i>
          <p v-if="index == 0" @click="tigger(item.singer[0].mid)">{{item.singer[0].name}}</p>
          <i v-if="index != 0" class="iconfont icon">&#xe680;</i>
          <p v-if="index != 0" @click="getmusic(item, index)">{{item.albumname}}--{{item.singer[0].name}}</p>
        </li>
      </ul>
    </div>
    <div v-if="load" class="load more">
      <van-loading type="spinner" size="22px" color="#ccc" />
    </div>
    <router-view/>
  </div>
</template>

<script>
import { getHotKey, getsearchList, getMusic,getMusicKey} from '../../utils/http'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import commonParams from '@/base/commonParams'
export default {
  name: 'search',
  data(){
    return {
      hotkeyList: [],
      searchList: [],
      value: '',
      page: 1,
      perpage: 20,
      loading: false,
      load: false,
      history: []
    }
  },
  mounted(){
    this.getHot()
    window.addEventListener("scroll", this.handleScroll, true)
  },
  beforeDestroy() { 
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // 获取搜索热词
    getHot(){
      const data = Object.assign({}, commonParams, {
          platform: 'h5',
          needNewcode: 1
      })
      getHotKey(data).then( res => {
        if(res.data.code == 0){
          this.hotkeyList = res.data.data.hotkey.slice(0,11)
        }
      })
    },
    // 搜索
    change(){
      if(this.value != ''){
        const data = Object.assign({}, commonParams, {
          w: this.value,
          p: this.page,
          uin: 0,
          platform: 'h5',
          needNewCode: 1,
          zhidaqu: 1,
          t: 0,
          flag: 1,
          ie: 'utf-8',
          sem: 1,
          aggr: 0,
          perpage:this.perpage,
          n:this.perpage,
          remoteplace: 'txt.mqq.all',
          format: 'json',
          _: +new Date()
        })
        this.loading = true
        getsearchList(data).then( res=>{
          if(res.data.code == 0){
            this.loading = false
            this.load = false
            this.page = 2
            this.searchList.push(...res.data.data.song.list)
            this.$store.dispatch('setTemporaryList',this.searchList)
            this.history.push(this.value)
          }
        })
      }else{
        this.searchList = []
      }
    },
    // 去歌手专辑页面
    tigger(val){
      this.$router.push({path: '/search/' + val})
    },
    // 点击热词
    hotClick(val){
      this.value =val
      this.searchList = []
    },
    // 获取歌曲
    getmusic(val,ins){
      const data = Object.assign({}, commonParams, {
        songmid:val.songmid,
        filename: 'C400' + val.songmid + '.m4a',
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
    },
    // 滚动条
    handleScroll() {
      var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop; //变量windowHeight是可视区的高度
      var windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight; //变量scrollHeight是滚动条的总高度
      var scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop +1 + windowHeight > scrollHeight) {
        this.change()
        this.load = true
      }
    },
    // 清除输入
    clear(){
      this.value = ''
      this.searchList = []
    },
    // 删除历史条目
    dele(index){
      this.history.splice(index,1)
    }
  },
  watch: {
    value(){
       this.change()
    }
  }
}
</script>
<style lang="scss" scoped>
  .content{
    margin-top: 200px;
    .load{
      margin: 150px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.more{
         margin: 40px 0px;
      }
    }
    .inpWrapper{
      width: 85%;
      margin: 0 auto;
      background: #333;
      border-radius: 15px;
      padding: 0 20px;
      height: 80px;
      position: relative;
      display: flex;
      margin-bottom: 10px;
      .icon{
        position: absolute;
        top: 30%;
        color: #222;
        font-size: 40px;
      }
      .clear{
        position: absolute;
        top: 30%;
        right: 5%;
        color: #222;
      }
      input{
        border: none;
        box-sizing: border-box;
        outline: none;
        width: 100%;
        padding-left: 50px;
        background: transparent;
        color: #fff;
      }
    }
    .hast{
      width: 85%;
      margin: 0 auto;
      margin-top: 50px;
      h3{
        font-weight: normal;
        font-size: 26px;
        color: rgba(255,255,255,0.5);
        margin-bottom: 8px;
      }
      ul{
        display: flex;
        margin-left: 5px;
        flex-wrap: wrap;
        li{
          border-radius: 12px;
          background: #333;
          padding: 3px 12px;
          font-size: 28px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          margin-right: 20px;
          margin-top: 20px;
        }
      }
    }
    .list{
      ul{
        padding: 0px 50px;
        li{
          display: flex;
          padding: 10px 0px 20px 0px;
          align-items: center;
          overflow: hidden;
          .icon{
            font-size: 24px;
            color: rgba(255,255,255,0.3);
          }
          p{
            margin-left: 20px;
            color: rgba(255,255,255,0.3);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 24px;
          }
        }
      }
    }
    .hositry{
      width: 90%;
      margin: 0 auto;
      margin-top: 50px;
      .desc{
        color: rgba(255,255,255,0.5);;
        position: relative;
        &.item{
          margin-top: 25px;
          .la{
             font-size: 24px;
          }
        }
        .la{
          color: rgba(255,255,255,0.3);
          font-size: 30px;
          position: absolute;
          right: 5%;
        }
      }

    }
  }
</style>
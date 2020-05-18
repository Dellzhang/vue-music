<template>
  <div class="home">
    <van-swipe :autoplay="3000" indicator-color="white">
       <van-swipe-item v-for="(item,index) of list" :key="index" >
         <img :src="item.picUrl" alt="" style="width: 100%;height: 160px">
       </van-swipe-item>
    </van-swipe>
    <h2>热门歌单推荐</h2>
    <div class="content">
      <ul>
        <li @click="detail(item)" v-for="(item,index) of RecommendList" :key="index">
          <div class="imgWrapper">
            <img height="60px" width="60px" v-lazy="item.imgurl" alt="加载失败">
          </div>
          <div class="title">
            <h3>{{item.creator.name}}</h3>
            <p>{{item.dissname}}</p>
          </div>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import {getSwiper, getRecommendList} from '../../utils/http'
import commonParams from '@/base/commonParams'

export default {
  name: 'home',
  components: {
    
  },
  data(){
    return {
      list: [
          {picUrl: 'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1881291.jpg'},
          {picUrl: 'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1880925.jpg'},
          {picUrl: 'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1876120.jpg'},
          {picUrl: 'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1879494.jpg'}
        ],
      RecommendList: []
    }
  },
  methods: {
    //获取轮播图
    getSwiper(){
      const data = Object.assign({}, commonParams, {
          platfrom: 'h5',
          uin: 0,
          needNewCode: 1
      })
      getSwiper(data).then( res=>{
        if(res.data.code == 0){
          this.list = res.data.data.slider
        }
      })
    },
    // 获取热门推荐详情
    detail(val){
      this.$router.push({path: '/recommend/' + val.dissid, query: { src: val.imgurl}})
    }
  },
  mounted(){
    const data = Object.assign({}, commonParams, {
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      needNewCode: 0,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'    //使用的时axios,所以format使用的是json,不是jsonp
    })
    this.getSwiper()
    getRecommendList(data).then( (res) =>{
      if(res.data.code == 0){
        this.RecommendList = res.data.data.list
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .home{
    margin-top: 170px;
  }
  h2{
     text-align: center;
     font-weight: normal;
     font-size: 28px;
     line-height: 75px;
     height: 75px;
  }
  .content{
    ul{
      li{
        display: flex;
        padding: 5px 30px 20px 30px;
        .imgWrapper{
          margin-right: 20px;
        }
        .title{
          margin-top: 5px;
          h3{
            color: #fff;
            font-size: 30px;
            font-weight: normal;
            line-height: 40px;
            margin-bottom: 15px;
          }
          p{
            font-size: 26px;
            color: rgba(255,255,255,0.3);
          }
        }
      }
    }
  }
</style>
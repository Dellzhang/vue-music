<template>
  <div class="content">
    <ul class="ul">
      <li v-for="(item,index) of singerList " :key="index" @click="topClick(item)">
        <div class="imgWrapper">
          <img v-lazy="item.picUrl" :key="item.picUrl" alt="加载失败">
        </div>
        <div class="title">
          <p v-for="(itm,ins) of item.songList" :key="ins">
            <span>{{itm.songname }}--{{itm.singername}}</span>
          </p>
        </div>
      </li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
import { getRankingList} from '../../utils/http'
import commonParams from '@/base/commonParams'
export default{
  name: 'ranking',
  data(){
    return{
      indexList: [],
      singerList: []
    }
  },
  methods: {
    // 获取排行榜
    getRanking(){
      const data = Object.assign({}, {
          platform: 'h5',
          needNewcode: 1
      })
      getRankingList(data).then( res =>{
        var ret= res.data
        if(typeof ret === 'string'){
          var matches = ret.substring(18, ret.length-1)
          if(matches){             
            ret = JSON.parse(matches)
            this.singerList = ret.data.topList
          }
        }
      })
    },
    // 点击榜单
    topClick(val){
      this.$router.push('/ranking/'+ val.id)
    }
  },
  mounted(){
    this.getRanking()
  }
}
</script>
<style lang="scss" scoped>
  .content{
    margin-top: 160px;
    .ul{
      li{
        display: flex;
        padding: 10px 30px 20px 30px;
        .imgWrapper{
          width: 180px;
          height: 180px;
          flex: 0 0 180px;
          img{
            height: 100%;
            width: 100%;
          }
        }
        .title{
          flex: 1;
          background: #333;
          color: rgba(255,255,255,0.3);
          overflow: hidden;
          padding: 15px 35px;
          p{
            line-height: 48px;
            font-size: 24px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap
          }
        }
      }
    }
  }
</style>
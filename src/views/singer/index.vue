<template>
  <div class="content">
    <van-index-bar :index-list="indexList">
      <div v-for="(item,index) of indexList" :key="index">
        <van-index-anchor :index="item">{{item}}</van-index-anchor>
        <van-cell v-show="item == itm.Findex" :title="itm.Fsinger_name" v-for="(itm,ins) of singerList" :key="ins" @click="singerClick(itm)" />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import { getSingerList} from '../../utils/http'
import commonParams from '@/base/commonParams'
export default {
  name: 'singer',
  data(){
    return {
      indexList: ['A','B','C','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z'],
      singerList: []
    }
  },
  mounted(){
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 1664029744, 
    })
    // 获取歌手列表
    getSingerList(data).then( res=>{
      if(res.data.code == 0){
        this.singerList = res.data.data.list
      }
    })
  },
  methods: {
    // 点击歌手
    singerClick(val){
      this.$router.push('/search/' + val.Fsinger_mid)
    }
  }
}
</script>
<style lang="scss" scoped>
  .content{
    margin-top: 160px;
  }
  .content /deep/ .van-cell{
    background: #222;
  }
  .content /deep/ .van-cell:not(:last-child)::after{
    border: none;
  }
  .content /deep/ .van-cell__title span{
    color: rgba(255,255,255,0.5);
  }
  .content /deep/ .van-index-anchor{
    color: rgba(255,255,255,0.5);
    background: #333;
  }
</style>
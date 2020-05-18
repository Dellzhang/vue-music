import axios from 'axios'
import base from '../base/index'
import qs from 'qs'

const  port  = 'http://122.51.204.124:4000'
var instance = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

// 获取首页轮播图
export const getSwiper = (params) => {
  return instance.post(port + base.swiper, qs.stringify(params))
}
// 首页推荐
export const getRecommendList =  (params) => {
  return instance.post( port + base.remcommendList, qs.stringify(params) )
}
// 获取歌手列表
export const getSingerList  = (params) => {
  return instance.post( port+  base.getSingerList, qs.stringify(params))
}

// 获取排行榜
export const getRankingList = (params) => {
  return instance.post( port+base.getRankingList, qs.stringify(params))
}

// 获取热搜热词
export const getHotKey = (params) => {
  return instance.post(port+base.getHotKey, qs.stringify(params))
}

// 显示搜索
export const getsearchList = (params) => {
  return instance.post(port+base.getsearchList, qs.stringify(params))
}

// 获取歌曲
export const getMusic = (params) => {
  return instance.post(port+base.getMusic, qs.stringify(params))
}

// 获取歌曲歌词
export const getMusicKey = (params) => {
  return instance.post(port+base.getMusicKey, qs.stringify(params))
}

// 获取歌手歌曲
export const getSingerDetail = (params) => {
  return instance.post(port+base.getSingerDetail, qs.stringify(params))
}

// 获取榜单详情歌曲
export const getTopLIst = (params) => {
  return instance.post(port+base.getTopLIst, qs.stringify(params))
}

// 获取热门推荐详情
export const getrecommendDetail = (params) => {
  return instance.post(port+base.recommendDetail,qs.stringify(params))
}
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let loveList = []
if(JSON.parse(localStorage.getItem('loveList'))){
  loveList = JSON.parse(localStorage.getItem('loveList'))
}

export default new Vuex.Store({
  state: {
    // 播放链接
    src: '',
    // 播放器显示
    hide: false,
    // 歌曲对象
    Singer: {},
    // 歌曲暂停按钮显示
    show: false,
    Lyrics: '',
    // 点击图片不让歌词加载
    noload: false,
    // 歌词对象
    currentLyric: { lines: [] },
    // 喜欢歌词列表
    loveList: loveList,
    //临时播放列表
    temporaryList: [],
    // 临时播放音乐索引
    Index: null,
    // 播放状态
    playState: 0,
    // 记录缩小播放器
    firstSuo: false
  },
  mutations: {
    setSrc(state, val){
      state.src = val
    },
    setHide(state,val) {
      state.hide = val
    },
    setSinger(state,val){
      state.Singer = val
    },
    setShow(state,val){
      state.show = val
    },
    setLyrics(state, val){
      state.Lyrics = val
    },
    setNoload(state, val){
      state.noload = val
    },
    setCurrentLyric(state, val){
      state.currentLyric = val
    },
    setloveList(state, val){
      if(val.type == 'Add'){
        state.loveList.push(val.data)
        localStorage.setItem('loveList', JSON.stringify(state.loveList))
        console.log(state.loveList)
      }else if(val.type == 'delete'){
        for(let i =0; i< state.loveList.length; i++){
          if(val.data.Singer.albummid === state.loveList[i].Singer.albummid){
            state.loveList.splice(i, 1)
            localStorage.setItem('loveList', JSON.stringify(state.loveList))
          }
        }
      }
    },
    setTemporaryList(state, val){
      state.temporaryList = []
      state.temporaryList.push(...val)
      console.log(state.temporaryList)
    },
    setIndex(state, val){
      state.Index = val
    },
    setPlayState(state, val){
      state.playState = val
    },
    setfirstSuo(state, val){
      state.firstSuo = val
    },
    updateTemporaryList(state, val){
      state.temporaryList.splice(val,1)
    }
    
  },
  actions: {
    setSrc ({commit},src){
      commit('setSrc',src)
    },
    setHide ({commit}, hide){
      commit('setHide', hide)
    },
    setSinger({commit},val){
      commit('setSinger', val)
    },
    setShow({commit},val){
      commit('setShow', val)
    },
    setLyrics({commit},val){
      commit('setLyrics', val)
    },
    setNoload({commit},val){
      commit('setNoload', val)
    },
    setCurrentLyric({commit},val){
      commit('setCurrentLyric', val)
    },
    setloveList({commit},val){
      commit('setloveList', val)
    },
    setTemporaryList({commit},val){
      commit('setTemporaryList', val)
    },
    setIndex({commit},val){
      commit('setIndex', val)
    },
    setPlayState({commit},val){
      commit('setPlayState', val)
    },
    setfirstSuo({commit},val){
      commit('setfirstSuo', val)
    },
    updateTemporaryList({commit},val){
      commit('updateTemporaryList', val)
    }
  },
  modules: {
  }
})

##### 音乐webapp

##### 项目在线预览地址
* http://122.51.204.124


##### webApp项目建立

* 四个页面分类(推荐,歌手,排行,搜索)
* 基本样式结构搭建  颜色黑色背景为主
* 首页页 : 1.轮播图  2热门歌曲推荐
* 歌手页 : 展示歌手列表
* 排行榜 : 各个歌曲排行榜
* 我的页面 : 个人设置部分 (细节待定 暂为空)


##### 使用数据(数据为QQ音乐官方接口,仅供学习)

* 功能 :
* 跑通页面跳转路由 vue-router
* 没有使用原生ajax , 而是使用了axios插件代替原生ajax进行接口调用
* 列表渲染将数据渲染到页面  v-for
* 事件处理器 对被渲染在页面上的歌曲做操作  v-on

---

##### 增加功能
* 使用vuex储存当前的播放歌曲的状态和播放歌曲的进度，
* 可以把歌曲加入喜欢列表，使用了了localStorage和vuex相结合的技术，实现关闭页面也能记录用户的喜欢列表
* 使用了better-scroll和lyric-parser插件，实现了歌词和歌曲可以同步滚动。
* 使用了vuex储存了用户的搜索记录。
* 使用了vue中的transition的组件，实现了页面间切换的动画。
* 使用了vant组件库，作为项目的ui组件库
* 使用了vue-lazyload插件实现了，排行榜页面图片的懒加载



##### VueX的加入
* 使用vuex作为数据存储空间与多个组件间的通信功能
* 减少了路由跳转页面 变为组件与组件间的跳转
* 页面结构变更 新增底部的播放器

## Start
+ npm install

## Develop
+ npm run serve

## Build
+ npm run build
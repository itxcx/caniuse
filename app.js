//app.js
var shareUrlId = ""
App({
  onLaunch: function (res) {
    // wx.getStorage({
    //   key: 'caniuseData',
    //   success: function(res) {
    //     console.log(res.data)
    //     console.log("缓存读取成功")
    //   },
    //   fail: function() {
    //     console.log("缓存读取失败了！！！！！！！")
    //   }
    // }),
    // console.log(res.query.queryKey)
    shareUrlId = res.query

    if(res.query == "" || res.query == undefined){
      this.globalData.queryKey = ""
    }else{
      this.globalData.queryKey = res.query
    }
  },
  globalData:{
    queryKey: ""
  }
})
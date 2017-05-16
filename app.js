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
    // console.log(this.globalData.queryKey)
  },
  // getUserInfo:function(cb){
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
  //     wx.login({
  //       success: function () {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  globalData:{
    // userInfo:null,
    queryKey: ""
  }
})
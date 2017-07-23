//app.js

App({
  onLaunch: function () {
  	// wx.setStorageSync("ver","2.0.0")
  	if(wx.getStorageSync("_timeStamp") == "") {
      wx.redirectTo({
        url:"/pages/load/load"
      })
    }
  },

  onShow: function() {
  	
  },

  globalData:{

  }
})
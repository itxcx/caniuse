var app = getApp()
var timestamp = ""
var list = {}
var listKeys = []
var listItemNum = 0
Page({
	onLoad: function() {
		var that = this
		try{
      var storageKeys = wx.getStorageInfoSync()
      
      for(let k in storageKeys.keys) {
        if(storageKeys.keys[k] == "t") {
          timestamp = wx.getStorageSync(storageKeys.keys[k])
          var date = new Date(timestamp * 1000);
        	var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        	that.setData({
	          data: {
	            message: "数据更新时间：" + formattedDate
	          }
	        })
        }
      }
    }catch(e){
    	console.log("出错了，数据没了！")
    }
	},

	updata: function() {
		var that = this

    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

		wx.request({
      url: "https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json",
      data: {},
      method: 'GET',
      header: {
          'content-type': 'application/json'
      },

      success: function(res) {
        wx.clearStorageSync()

        timestamp = res.data.updated;
        var date = new Date(timestamp * 1000);
        var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

        app.post = res.data.data

        wx.setStorageSync("t", timestamp)

        for(let r in app.post){
        	listItemNum++
          wx.setStorageSync(r, app.post[r])
          wx.getStorageSync(r, app.post[r])
          console.log("数据加载 " + listItemNum + " 条")
        }
        
        wx.showToast({
          title: '加载完成！',
          icon: 'success',
          duration: 1500
        })

				that.setData({
          data: {
            message: "数据更新时间：" + formattedDate
          }
        })
        
      }
    })
	}
})
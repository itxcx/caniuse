var app = getApp()
var attrLstArray = []

// ✔︎ 数据写入data之后，考虑如何读取出来
Page({
  onLoad: function (res) {
    var that = this
    // 判断本地 storage 中是否存在时间戳
    // 如果有则直接读取 localStorage 内容
    // localStorage 没有时间戳则显示加载按钮提示加载 json 文件
    that.setData({
      _jsonTotal: wx.getStorageSync("jsonTotal"),
      _timeStamp: wx.getStorageSync("timeStamp")
    })
    if (wx.getStorageSync("timeStamp")) {
      wx.showToast({
        title: '数据加载完毕',
        duration: 1000
      })
      // console.log(wx.getStorageSync("jsonTotal")) // Json 数据总量
      wx.getStorageInfo({
        success: function(res) {
          console.log(res)
          console.log(res.keys)
          // console.log(res.currentSize)
          // console.log(res.limitSize)
          console.log(res.keys.length)
          for(let i = 0; i < res.keys.length - 2; i++){
            if(res.keys[i].match(/png/ig)){
              console.log(res.keys[i])
              console.log(wx.getStorageSync(res.keys[i]))
              that.setData({
                [res.keys[i]]: wx.getStorageSync(res.keys[i])
              })
            }
          }
        }
      })
      that.setData({
        _getJsonBtnStatus: "none"
      })
    } else {
      that.setData({
        _getJsonBtnStatus: "" // 加载按钮显示出来
      })
    }
  },

  // 通过点击加载按钮加载 json 文件
  getJson: function () {
    var that = this
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType
        if(networkType == "wifi"){
          that.setData({
            _getJsonBtnStatus: "" // 加载按钮显示出来
          })
        loadJson()
        }else{
          wx.showModal({
            title: '网络状态提醒',
            content: '目前你所连接的是 ' + networkType + " 网络，并非 wifi 网络，该数据请求可能需要 200K 以上的流量请求，确定更新？",
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  _getJsonBtnStatus: "", // 加载按钮显示出来
                  _userCancelUpdate: ""
                })
              var _loadJson = that.loadJson() // 开始使用加载 json 的函数
              } else if (res.cancel) {
                that.setData({
                  _getJsonBtnStatus: "", // 加载按钮显示出来
                  _userCancelUpdate: "用户主动取消更新"
                })
              }
            }
          })
        }
      }
    })
  },

  // 加载 json 数据
  loadJson: function(){
    var that = this
    wx.showLoading({
      title: "开始加载数据",
      mask: true
    })
    wx.request({
      url: "https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json",
      data: {},
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var listNum = 0 // 计算属性列表的总数
        for (let attrList in res.data.data) {
          listNum++
          console.log(listNum)
          that.setData({
            _listNum: listNum
          })
          wx.setStorageSync(attrList, res.data.data[attrList])
          // wx.setStorageSync(attrList, attrList)
        }
        // json 数据包的更新时间转换格式
        var timestamp = res.data.updated;
        var date = new Date(timestamp * 1000);
        var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        wx.setStorageSync("timeStamp", formattedDate) // 在 localstorage 中的继属性列表之后增加时间戳格式
        wx.setStorageSync("jsonTotal", listNum) // 在 localstorage 中的继属性列表之后增加属性列表的总数
        // json 数据包的更新时间写入data
        that.setData({
          _jsonTotal: listNum,
          _getJsonBtnStatus: "none",
          _timeStamp: wx.getStorageSync("timeStamp")
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  }
})
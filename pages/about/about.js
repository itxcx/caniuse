var app = getApp()

Page({
  onLoad: function() {
    var that = this
    
    that.setData({
      _timeStamp: wx.getStorageSync("timeStamp")
    })
  },

  // 通过判断网络状态的类型后，点击加载按钮加载 json 文件
  getJson: function () {
    wx.clearStorage()
    wx.switchTab({
      url: '/pages/index/index'
    })
    
    var that = this
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType
        if(networkType == "wifi"){ // 根据网络类型选择是否提示直接加载
          // wifi情况下直接开始加载
          wx.clearStorage()
          var _loadJson = that.loadJson() // 开始使用加载 json 的函数
        }else{
          // 非 wifi 情况下提示需要消耗流量加载，确定之后即可加载数据
          wx.showModal({
            title: '网络状态提醒',
            content: '目前你所连接的是 ' + networkType + " 网络，并非 wifi 网络，该数据请求可能需要 200K 以上的流量请求，确定更新？",
            success: function(res) {
              if (res.confirm) {
                wx.clearStorage()
                var _loadJson = that.loadJson() // 开始使用加载 json 的函数
              }
            }
          })
        }
      }
    })
  },

  // 点击加载按钮后开始，加载 json 数据
  loadJson: function(){
    var that = this
    wx.showLoading({
      title: "开始初始化数据……",
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
        var attrSearchList = []
        for (let attrList in res.data.data) {
          listNum++
          attrSearchList.push([
            attrList,
            res.data.data[attrList].title,
            res.data.data[attrList].keywords,
            res.data.data[attrList].description
            ])
          wx.setStorageSync(attrList, res.data.data[attrList])
        }
        wx.setStorageSync("_attrSearchList",attrSearchList)
        that.setData({
          _attrSearchList: attrSearchList
        })

        var CSS2List = [
          'background-color',
          'background-image',
          'background-position (2 params)',
          'background-repeat (repeat | repeat-x | repeat-y | no-repeat)',
          'border-collapse (collapse | separate)',
          'border-color',
          'border-spacing',
          'border-style',
          'bottom',
          'color',
          'clear (none | left | right | both)',
          'display (none | inline | block | list-item)',
          'float (none | left | right)',
          'font-family',
          'font-size',
          'font-style (normal | italic | oblique)',
          'font-variant (normal | small-caps)',
          'font-weight',
          'height',
          'left',
          'line-height',
          'list-style',
          'list-style-image',
          'list-style-position',
          'margin',
          'overflow (visible | hidden | scroll | auto)',
          'padding',
          'position (static | relative | absolute)',
          'right',
          'text-align (left | right | center | justify)',
          'text-decoration (none | underline | overline | line-through)',
          'text-indent',
          'text-transform (capitalize | uppercase | lowercase | none)',
          'top',
          'width',
          'word-spacing',
          'visibility (visible | hidden)',
          'z-index'
        ]

        // json 数据包的更新时间转换格式
        var timestamp = res.data.updated;
        var date = new Date(timestamp * 1000);
        var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        wx.setStorageSync("timeStamp", "数据最后更新时间：" + formattedDate) // 在 localstorage 中的继属性列表之后增加时间戳格式
        wx.setStorageSync("jsonTotal", listNum) // 在 localstorage 中的继属性列表之后增加属性列表的总数

        wx.setStorageSync("CSS2",CSS2List)

        wx.setStorageSync("ver","2.0.0")

        // json 数据包的更新时间写入data
        that.setData({
          _timeStamp: wx.getStorageSync("timeStamp"),
        })

        wx.vibrateShort()

        wx.showToast({
          title: "更新完成",
          mask: true,
          duration: 2000
        })
      },
      complete: function () {
        wx.hideLoading()
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },
})
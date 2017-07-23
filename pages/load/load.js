var app = getApp()

Page({
  onLoad: function() {    
    this.requestJson()
  },

  requestJson: function(res) {
    wx.showLoading({
      title: "数据请求加载",
      mask: true
    })
    wx.request({
      url: "https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json",
      data: {},
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: "数据处理中",
          mask: true
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
        // dataTotal = 0

        // json 数据包的更新时间转换格式
        var timestamp = res.data.updated;
        var date = new Date(timestamp * 1000);
        var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

        // console.log(res.data.data)
        for(var dataLen in res.data.data) {
          // dataTotal++
          wx.setStorage({
            key: dataLen,
            data: res.data.data[dataLen]
          })
        }

        wx.setStorageSync("_CSS2",CSS2List)

        wx.setStorageSync("_timeStamp", "数据最后更新时间：" + formattedDate) // 在 localstorage 中的继属性列表之后增加时间戳格式

        wx.showToast({
          title: "数据加载完成",
          duration: 2000
        })
        wx.hideLoading()
        var storageLen = wx.getStorageInfoSync()
        // console.log(storageLen)
        // wx.setStorageSync("_dataTotal", storageLen.keys.length) // 在 localstorage 中的继属性列表之后增加属性列表的总数
        // console.log(storageLen.keys)
        // console.log(wx.getStorageSync("_dataTotal"))
      // }

        wx.reLaunch({
          url: "/pages/index/index"
        })
      }
    })
  },
})
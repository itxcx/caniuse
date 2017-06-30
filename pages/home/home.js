var app = getApp()

Page({
  onLoad: function (res) {
    var that = this
    // ✔︎ 判断本地 storage 中是否存在时间戳
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
      wx.getStorageInfo({
        success: function(res) {
          let attrDetailArray = [],
              attrNameArray = []
              // testArray = []
          for(let i = 0, j = 0; i < res.keys.length - 2; i++){
            if(res.keys[i].match(/png/ig)){
              // console.log(res.keys[i])
              attrNameArray.push(res.keys[i])
              attrDetailArray.push(wx.getStorageSync(res.keys[i]))

              attrNameArray.push([
                attrDetailArray[j].title,
                attrDetailArray[j].description,
                attrDetailArray[j].spec,
                attrDetailArray[j].usage_perc_y,
                attrDetailArray[j].usage_perc_a,
                attrDetailArray[j].notes
                ])

              let browserTypeArray = [],
                  // browserVerArray = [],
                  compatibility = []
              for(let type in attrDetailArray[j].stats) {
                // console.log(attrDetailArray[j])
                // console.log(attrDetailArray[j].title)
                // console.log(attrDetailArray[j].description)
                // console.log(attrDetailArray[j].spec)
                // console.log(attrDetailArray[j].usage_perc_y)
                // console.log(attrDetailArray[j].usage_perc_a)
                // console.log(attrDetailArray[j].notes)
                // browserTypeArray.push(type) // 把浏览器类型写入到 AppData 中,
                  // testArray = []
                let brwoserVerY = 0,
                    brwoserVerN = 0,
                    brwoserVerU = 0,
                    brwoserVerA = 0
                for(let ver in attrDetailArray[j].stats[type]) {
                  // browserVerArray.push(ver) // 把所有浏览器的版本写入到 AppData 中
                  var temp = attrDetailArray[j].stats[type]

                  compatibility = attrDetailArray[j].stats[type][ver] // 兼容性列表
                  if(compatibility.match(/y/ig)){
                    brwoserVerY = that.judgeVer(brwoserVerY,ver)
                  }else if(compatibility.match(/n/ig)) {
                    brwoserVerN = that.judgeVer(brwoserVerN,ver)
                  }else if(compatibility.match(/u/ig)) {
                    brwoserVerU = that.judgeVer(brwoserVerU,ver)
                  }else if(compatibility.match(/a|p/ig)) {
                    brwoserVerA = that.judgeVer(brwoserVerA,ver)
                  }
                }
                // console.log("全兼容 " + brwoserVerY) // 全兼容 最高版本的浏览器
                // console.log("一点都不兼容 " + brwoserVerN) // 不兼容 最高版本的浏览器
                // console.log("是否支持还不知道 " + brwoserVerU) // 未知兼容 最高版本的浏览器
                // console.log("部分支持 " + brwoserVerA) // 部分兼容 最高版本的浏览器
                // console.log("当前浏览器 "+type+" 版本判断结束\n-----------------------------------------")
                // attrNameArray.push(type,brwoserVerY,brwoserVerN,brwoserVerU,brwoserVerA)
                browserTypeArray.push(type,[brwoserVerY,brwoserVerN,brwoserVerU,brwoserVerA])
                // browserTypeArray.push(testArray)
              }

              attrNameArray.push(browserTypeArray)
              that.setData({
                attrNameArray
              })
              // console.log(attrNameArray)
              // attrNameArray.push(browserVerArray)

              // that.setData({
              //   attrDetail: attrDetailArray
              // })

              j++
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

  judgeVer: function(brwoserVerTemp,version) {
    // let brwoserVerTemp = 0
    // 判断浏览器的版本，获取最高版本
    // console.log(brwoserVerTemp)
    // console.log(version)
    if(version.match(/\-/ig)){
      version = version.split(/\-/ig)[1]
    }
    if(brwoserVerTemp < parseFloat(Number(version))) {
      brwoserVerTemp = version
    }else if(isNaN(Number(version)) && version == "all") {
      brwoserVerTemp = version
    }
    return brwoserVerTemp
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
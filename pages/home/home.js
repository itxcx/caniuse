var app = getApp(),
    findCSS3 = 0

Page({
  onLoad: function (res) {
    var that = this
    var _attrSearchList = []
    // todo list ✔︎
    // 搜索
    //   |- ✔︎ 搜索判断结果展示（无结果、错误信息）
    //   |- ✔︎ 搜索结果数据不全的问题
    //   |- 美化搜索结果展示
    // 数据过多时分段加载（点击或者下拉）
    // “分享”页面增加
    //   |- 选择其中一条信息后转发分享
    //   |- 通过分享进入时如果未加载过数据，给提示是否加载数据
    //   |- 通过分享进入时，直接展示所分享的页面，并提供进入搜索页的入口
    // “说明”页面
    // ✔︎ 页面样式美化
    //   |- ✔︎ 兼容性颜色块的位置调整
    //   |- ✔︎ 手机中输入框自动获取焦点频繁的问题
    // 加载数据时，添加一个 loading 动画效果

    // ✔︎ 真机中与开发工具中看到的 json 队列不同，导致最终数据的错误
    that.setData({
      _jsonTotal: wx.getStorageSync("jsonTotal"),
      _timeStamp: wx.getStorageSync("timeStamp"),
      _CSS2Title: ""
    })
    for(var p=0;p<that.data._jsonTotal;p++){
      // console.log(wx.getStorageSync("_attrSearchList")[p])
      _attrSearchList.push(wx.getStorageSync("_attrSearchList")[p])
    }
    // console.log(_attrSearchList)
    that.setData({
      _attrSearchList: _attrSearchList
    })
    if (wx.getStorageSync("timeStamp")) {
      wx.showToast({
        title: '数据加载完毕',
        duration: 1000
      })
      // var _showJson = that.showJson(); // 展示数据
      that.setData({
        _getJsonBtnStatus: "none",
        inputFocus: true
      })
    } else {
      that.setData({
        _getJsonBtnStatus: "",
        inputFocus: false,
        _getJsonBtnText: "加载数据" // 加载按钮显示出来
      })
    }
  },

  onPullDownRefresh: function() {
    var that = this
    that.setData({
      _timeStamp: wx.getStorageSync("timeStamp")
    })
    wx.showModal({
      title: '重新加载数据',
      content: '确定要重新加载数据？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            _getJsonBtnStatus: "none" // 加载按钮显示出来
          })
        var _loadJson = that.loadJson() // 开始使用加载 json 的函数
        } else if (res.cancel) {
          that.setData({
            _getJsonBtnStatus: "" // 加载按钮显示出来
            // _userCancelUpdate: "用户主动取消更新"
          })
        }
      }
    })
  },

  onReachBottom: function() {
    var total = 0
    total += 1;
    // 网络请求
    console.log("下拉下拉 啊啊啊啊"+findCSS3)
  },

  beginSearch: function(e) {
    var that = this
    that.setData({
      inputValue: e.detail.value.replace(/(^\s*)|(\s*$)/ig,"").toLowerCase()
    })
  },

  bindconfirm: function() {
    var that = this,
        getValue = that.data.inputValue
    if( getValue == "" || getValue == undefined ) {
      wx.showToast({
        title: "你确认输入东西？",
        duration: 1000
      })
      that.setData({ // 输入为空时，清空已展示的列表
        _CSS2List: "",
        _CSS2Title: "",
        _CSS2Descrtion: "",
        attrNameArray: ""
      })
    }else{
      var _showJson = that.showJson(getValue)
      // console.log(getValue)
    }
  },
  
  // 判断浏览器的版本，获取最高版本
  judgeVer: function(brwoserVerTemp,version) {
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

  // 判断浏览器的版本，获取最高版本
  judgeVerThan: function(brwoserVerTemp,version) {
    if(version.match(/\-/ig)){
      version = version.split(/\-/ig)[1]
    }
    if(brwoserVerTemp < parseFloat(Number(version))) {
      if( brwoserVerTemp == 0) {
        brwoserVerTemp = version
      }
    }else if(isNaN(Number(version)) && version == "all") {
      brwoserVerTemp = version
    }
    return brwoserVerTemp
  },

  // 通过判断网络状态的类型后，点击加载按钮加载 json 文件
  getJson: function () {
    var that = this
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType
        if(networkType == "wifi"){ // 根据网络类型选择是否提示直接加载
          // wifi情况下直接开始加载
          that.setData({
            _getJsonBtnStatus: "none" // 加载按钮显示出来
          })
        var _loadJson = that.loadJson() // 开始使用加载 json 的函数
        }else{
          // 非 wifi 情况下提示需要消耗流量加载，确定之后即可加载数据
          wx.showModal({
            title: '网络状态提醒',
            content: '目前你所连接的是 ' + networkType + " 网络，并非 wifi 网络，该数据请求可能需要 200K 以上的流量请求，确定更新？",
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  _getJsonBtnStatus: "none" // 加载按钮显示出来
                })
              var _loadJson = that.loadJson() // 开始使用加载 json 的函数
              } else if (res.cancel) {
                that.setData({
                  _getJsonBtnStatus: "" // 加载按钮显示出来
                  // _userCancelUpdate: "用户主动取消更新"
                })
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
        var attrSearchList = []
        for (let attrList in res.data.data) {
          listNum++
          console.log(attrList)
          attrSearchList.push([
            attrList,
            res.data.data[attrList].title,
            res.data.data[attrList].keywords,
            res.data.data[attrList].description
            ])
          // wx.setStorage({
          //   key: attrList,
          //   data: res.data.data[attrList]
          // })
          wx.setStorageSync(attrList, res.data.data[attrList])
          // wx.setStorageSync(attrSearchList, [
          //   res.data.data[attrList].title,
          //   res.data.data[attrList].keywords,
          //   res.data.data[attrList].description
          //   ])
          // console.log(res.data.data[attrList].title)
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

        // json 数据包的更新时间写入data
        that.setData({
          _jsonTotal: listNum,
          _getJsonBtnStatus: "none",
          _timeStamp: wx.getStorageSync("timeStamp"),
          _CSS2Title: ""
        })
        // var _showJson = that.showJson(); // 展示数据
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  showJson: function(findValue) {
    var that = this
    wx.getStorageInfo({
      success: function(res) {
        let attrDetailArray = [],
            attrNameArray = [],
            _CSS2List = [],
            C2List = wx.getStorageSync("CSS2"),
            findCSS2 = 0

        for (let c2 = 0; c2 < C2List.length; c2++) {
          if(C2List[c2].toLowerCase().match(new RegExp(findValue))) {
            _CSS2List.push(C2List[c2])
            that.setData({
              _CSS2List,
              _CSS2Title: "CSS 2.1 属性：",
              _CSS2Descrtion: "该区域内 绿色 文字的属性都已经支持目前所有浏览器（包含 IE6+, Firefox 2+, Chrome 1+ 等）。"
            })
            findCSS2++
          }
        }
        if(findCSS2 == 0){
          that.setData({ // 当 CSS2 属性找不到时，清除 CSS2 的列表
            _CSS2List: "",
            _CSS2Title: "",
            _CSS2Descrtion: "",
            inputFocus: false
          })
        }

        console.log(res.keys.length)

        for(let i = 0, j = 0; i < that.data._jsonTotal; i++){
          // console.log(res.keys[i])
          // console.log(res.keys[i]) // 从 localStorage 中获取的keys值
          // console.log(that.data._attrSearchList[i][j])
          if(that.data._attrSearchList[i][0].match(new RegExp(findValue)) || that.data._attrSearchList[i][1].match(new RegExp(findValue)) || that.data._attrSearchList[i][2].match(new RegExp(findValue)) || that.data._attrSearchList[i][3].match(new RegExp(findValue))) {
            console.log(that.data._attrSearchList[i][1])
            console.log(that.data._jsonTotal)
            console.log(res.keys.length)
          }
          if(that.data._attrSearchList[i][0].match(new RegExp(findValue)) || that.data._attrSearchList[i][1].match(new RegExp(findValue)) || that.data._attrSearchList[i][2].match(new RegExp(findValue)) || that.data._attrSearchList[i][3].match(new RegExp(findValue))) {
            // console.log(res.keys[i].match(new RegExp(findValue)) || that.data._attrSearchList[i][0].match(new RegExp(findValue)) || that.data._attrSearchList[i][1].match(new RegExp(findValue)) || that.data._attrSearchList[i][2].match(new RegExp(findValue)))
            // console.log(wx.getStorageSync(res.keys[i]).title)
            // console.log(res.keys[i])
            // console.log("搜："+ that.data._attrSearchList[i][1])
            // for(var findAttr = 0; findAttr < res.keys.length-1; findAttr++){
            //   if(wx.getStorageSync(res.keys[findAttr]).title == that.data._attrSearchList[i][1]) {
            //     console.log("终于找到了： " + wx.getStorageSync(res.keys[findAttr]).title) 
            //   }
            // }
            

            // for(var findAttr = 0; findAttr < res.keys.length-1; findAttr++){
            //   if(attrNameArray[j] == that.data._attrSearchList[i][0]) {
            //     console.log("=============")
            //     console.log(attrDetailArray[j].title)
            //     console.log("找到了啊")
            //     continue
            //   }
            // }

              attrNameArray.push(res.keys[i])
              // attrDetailArray.push(wx.getStorageSync(res.keys[i])) // 搜索后所得的详细内容
              // console.log(attrDetailArray)
              console.log("----------------")
              // console.log("attrDetailArray[j].title    " + attrDetailArray[j].title)
              // console.log("that.data._attrSearchList[i][1]   " + that.data._attrSearchList[i][1])

            for(var findAttr = 0; findAttr < res.keys.length-1; findAttr++){
              if(wx.getStorageSync(res.keys[findAttr]).title == that.data._attrSearchList[i][1]) {

                console.log("终于找到了：")
                // console.log(wx.getStorageSync(res.keys[findAttr]))
                attrDetailArray.push(wx.getStorageSync(res.keys[findAttr])) // 搜索后所得的详细内容
                console.log(attrDetailArray)
              // if(that.data._attrSearchList[i][0]) {
                attrNameArray.push([
                  attrDetailArray[j].title,
                  attrDetailArray[j].description,
                  // attrDetailArray[j].spec,
                  "浏览器支持率：" + attrDetailArray[j].usage_perc_y,
                  "部分支持情况： "+attrDetailArray[j].usage_perc_a
                  // attrDetailArray[j].notes
                ])

                let browserTypeArray = [],
                    compatibility = []
                for(let type in attrDetailArray[j].stats) {
                  let brwoserVerY = 0,
                      brwoserVerN = 0,
                      brwoserVerU = 0,
                      brwoserVerA = 0
                  for(let ver in attrDetailArray[j].stats[type]) {
                    compatibility = attrDetailArray[j].stats[type][ver] // 兼容性列表
                    if(compatibility.match(/y/ig)){
                      brwoserVerY = that.judgeVerThan(brwoserVerY,ver)
                    }else if(compatibility.match(/n/ig)) {
                      brwoserVerN = that.judgeVer(brwoserVerN,ver)
                    }else if(compatibility.match(/u/ig)) {
                      brwoserVerU = that.judgeVer(brwoserVerU,ver)
                    }else if(compatibility.match(/a|p/ig)) {
                      brwoserVerA = that.judgeVer(brwoserVerA,ver)
                    }
                  }
                  browserTypeArray.push([type,brwoserVerY,brwoserVerN,brwoserVerU,brwoserVerA])
                }

                attrNameArray.push(browserTypeArray)
                that.setData({
                  attrNameArray, // 获取最终筛选后 json 的列表信息
                  inputValue: findValue
                })

                j++
                findCSS3++
              }
            }
            
          }
        }

        console.log(findCSS3)

        if(findCSS3 == 0){
          that.setData({ // 当 CSS3 属性找不到时，清除 CSS3 的列表
            attrNameArray: ""
          })
        }

        if(findCSS2 == 0 && findCSS3 == 0) { // 当 CSS2 和 CSS3 属性都找不到的时候，提示找不到任何东西
          wx.showToast({
            title: "输入的是什么东西，找不到啊！",
            duration: 1500
          })
        }
      }
    })
  }
})
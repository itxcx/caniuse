var app = getApp(),
    pager = 0,
    againNumber = 0

Page({
  onLoad: function (res) {
    var that = this
    var _attrSearchList = []
    
    that.setData({
      _jsonTotal: wx.getStorageSync("jsonTotal"),
      _timeStamp: wx.getStorageSync("timeStamp"),
      _CSS2Title: "",
      inputDisabled: true
    })
    for(var p=0;p<that.data._jsonTotal;p++){
      _attrSearchList.push(wx.getStorageSync("_attrSearchList")[p])
    }
    that.setData({
      _attrSearchList: _attrSearchList
    })
    if (wx.getStorageSync("timeStamp")) {
      wx.showToast({
        title: '数据初始化……',
        duration: 1000
      })
      that.setData({
        _getJsonBtnStatus: "none",
        inputDisabled: false,
        inputFocus: true
      })
    } else {
      that.setData({
        _getJsonBtnStatus: "",
        inputDisabled: true,
        inputFocus: false,
        _getJsonBtnText: "初始化数据" // 加载按钮显示出来
      })
    }
  },

  beginSearch: function(e) {
    var that = this
    that.setData({
      inputValue: e.detail.value.replace(/(^\s*)|(\s*$)/ig,"").toLowerCase()
    })
  },

  bindconfirm: function() {
    var that = this,
        getValue = that.data.inputValue,
        pager = 0
    if( getValue == "" || getValue == undefined ) {
      wx.showToast({
        title: "你确认输入东西？",
        duration: 1000
      })
      that.setData({ // 输入为空时，清空已展示的列表
        _CSS2List: "",
        _CSS2Title: "",
        _CSS2Descrtion: "",
        attrNameArray: "",
        ___pager: 0,
        _____lastList: ""
      })
    }else{
      var _showJson = that.showJson(getValue)
    }
  },
  
  // 判断浏览器的版本，获取最低版本
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

        // json 数据包的更新时间写入data
        that.setData({
          _jsonTotal: listNum,
          _getJsonBtnStatus: "none",
          _timeStamp: wx.getStorageSync("timeStamp"),
          ___pager: pager,
          _CSS2Title: "",
          inputDisabled: false,
          inputFocus: true
        })
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
            findCSS2 = 0,
            findCSS3 = 0
        pager = 0
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

        wx.showLoading({
          title: "加载数据……"
        })
        that.setData({
          attrNameArray: "",
          ___pager: pager
        })

        for(let i = 0, j = 0; i < that.data._jsonTotal; i++){
          if(that.data._attrSearchList[i][0].match(new RegExp(findValue)) || that.data._attrSearchList[i][1].match(new RegExp(findValue)) || that.data._attrSearchList[i][2].match(new RegExp(findValue)) || that.data._attrSearchList[i][3].match(new RegExp(findValue))) {
            
            attrNameArray.push(res.keys[i])
            let browserTypeArray = []

            for(var findAttr = 0; findAttr < res.keys.length-1; findAttr++){
              if(wx.getStorageSync(res.keys[findAttr]).title == that.data._attrSearchList[i][1]) {

                attrDetailArray.push(wx.getStorageSync(res.keys[findAttr])) // 搜索后所得的详细内容

                let compatibility = []
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
                attrNameArray.push([
                  (j + 1) + "、" + attrDetailArray[j].title,
                  attrDetailArray[j].description,
                  "浏览器支持率：" + attrDetailArray[j].usage_perc_y,
                  "部分支持情况： "+attrDetailArray[j].usage_perc_a
                ])
                attrNameArray.push(browserTypeArray)
                j++
                findCSS3++
              }
            }
          }
        }

        that.setData({
          attrNameArray, // 获取最终筛选后 json 的列表信息
          inputValue: findValue,
          _listNumber: findCSS3*3,
          ___pager: pager,
          _listShowNumber: 0
        })

        var reachBottom = that.onReachBottom();        

        wx.hideLoading()

        wx.showToast({
          title: "共有 " + findCSS3 + " 条数据",
          duration: 1500
        })

        if(findCSS3 == 0){
          that.setData({ // 当 CSS3 属性找不到时，清除 CSS3 的列表
            attrNameArray: "",
            _____lastList: ""
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
  },

  onReachBottom: function() {
    var that = this,
        lastNumber = 0,
        againNumber = 0,
        nextList = []

    if(pager<that.data._listNumber/3){
      pager++
      that.setData({
        ___pager: pager
      })

      // if(test*3 >= that.data._listNumber) {
      //   console.log("加载到头了！")
      // }else{
        var test = 1;
        for(;test<=that.data.___pager;test++){
          for(; againNumber <= that.data.___pager * 3 - 1; againNumber++) {
            nextList.push(that.data.attrNameArray[againNumber])
          }
            that.setData({
              _____lastList: nextList
            })
          lastNumber++
          that.setData({
            _listShowNumber: lastNumber,
          })
        }
      // }

    }
  }
})
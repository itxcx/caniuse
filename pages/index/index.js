var app = getApp()
// var nick = ""
var path = ""
var findTips404 = ""
var findTips404Text = ""
var loadMore = ""
var refreshAgain = 0;
var filePath = ""
var timestamp = ""
var list = {}
var listKeys = []
Page({
  onShareAppMessage: function () {
    return {
      title: '关于 ' + app.pageTitle + ' 的兼容性列表信息',
      path: '/pages/share/share?queryKey=' + app.pageTitle,
      success: function(res) {
        wx.showToast({
          title: '成功分享',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'warn',
          duration: 2000
        })
      }
    }
  },

  onLoad: function (res) {
    var that = this;
    var timestamp = "";

      that.setData({
        post: [],
        css3_s: [],
        data: {
          message: "数据加载中...",
        },
        inputBtn: {
          focus: false,
          disabled: true,
          disabledBtn: true
        }
      })
      wx.showLoading({
        title: '数据加载中',
        mask: true
      })
    try{
      var storageKeys = wx.getStorageInfoSync()
      

      for(let y in storageKeys.keys) {
        // console.log(storageKeys.keys[y])
        // if(storageKeys.keys[y] == "xhr2") {
        //   console.log("------------------------")
        //   console.log(storageKeys.keys[y])
        //   console.log("------------------------")
        // }
        if(storageKeys.keys[y] == "t") {
          // console.log(storageKeys.keys[y])
          console.log(timestamp = wx.getStorageSync(storageKeys.keys[y]))
          // console.log(wx.removeStorageSync(storageKeys.keys[y]))
        }else{
          list[y] = wx.getStorageSync(storageKeys.keys[y])
          listKeys[y] = storageKeys.keys[y]
        }
      }

      // console.log(listKeys)
      // app.post = storageKeys.keys
      // console.log(app.post)
      // console.log(wx.getStorageSync(storageKeys.keys[1]))
      // console.log(wx.getStorageSync(storageKeys.keys[2]))
      if( timestamp ){

        // timestamp = wx.getStorageSync(storageKeys.keys[1]);
        var date = new Date(timestamp * 1000);
        var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

        wx.showToast({
          title: '加载完成！',
          icon: 'success',
          duration: 1500
        })

        that.setData({
          data: {
            message: "数据更新时间：" + formattedDate
          },
          inputBtn: {
            focus: true,
            disabled: false,
            disabledBtn: true
          }
        })
        // console.log(list = wx.getStorageSync(storageKeys.keys))
        console.log("同步数据，缓存读取成功")
      }else{

        wx.request({
          url: "https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json",
          data: {},
          method: 'GET',
          header: {
              'content-type': 'application/json'
          },

          success: function(res) {

            timestamp = res.data.updated;
            var date = new Date(timestamp * 1000);
            var formattedDate = date.getFullYear() + "/" + ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

            app.post = res.data.data

            wx.setStorageSync("t", timestamp)

            for(let r in app.post){
              wx.setStorageSync(r, app.post[r])
            }

            var storageKeys = wx.getStorageInfoSync()
      
            for(let y in storageKeys.keys) {
              // console.log(storageKeys.keys[y])
              // list[y] = wx.getStorageSync(storageKeys.keys[y])
              if(storageKeys.keys[y] == "t") {
                // console.log(storageKeys.keys[y])
                console.log(timestamp = wx.getStorageSync(storageKeys.keys[y]))
                // console.log(wx.removeStorageSync(storageKeys.keys[y]))
              }else{
                list[y] = wx.getStorageSync(storageKeys.keys[y])
                listKeys[y] = storageKeys.keys[y]
              }
            }
            
            wx.showToast({
              title: '加载完成！',
              icon: 'success',
              duration: 1500
            })

            that.setData({
              data: {
                message: "数据更新时间：" + formattedDate
              },
              inputBtn: {
                focus: true,
                disabled: false,
                disabledBtn: true
              }
            })
          }
        })
        console.log("同步失败，设置开始设置缓存用于同步处理")
      }
    }catch (e){
      console.log("储存空间不够用啊！")
    }
  },


  beginSearch: function(e) {
    refreshAgain = 0;
    var css3_s = [];
    e.detail.value = e.detail.value.replace(/(^\s*)|(\s*$)/ig, "")
    this.setData({
      inputValue: e.detail.value,
      css2: [
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
      ],
      c3Result: {},
      inputBtn:{
        focus: true,
        disabled: false,
        disabledBtn: false
      },
      findTips404: "",
      findTips404Text: "",
    })
  },

  bindconfirm: function() {

    var css3_s = [];
    var css3_sR = [];

    refreshAgain += 4;

    app.pageTitle = this.data.inputValue;
      
    if(this.data.css2 == undefined) {
      this.setData({
        findTips404: "findTips404",
        findTips404Text: "你确定你输入了内容"
      })
    }else{
      if(this.data.inputValue == "" || this.data.inputValue.length == 0) {
        this.setData({
          findTips404: "findTips404",
          findTips404Text: "是不是忘了输入什么了"
        })
      }else{
        for(var i=0;i<=this.data.css2.length-1;i++){
          if(this.data.css2[i].toLowerCase().match(this.data.inputValue.toLowerCase())){
            this.data.css2[i] = this.data.css2[i]
          }else{
            this.data.css2[i] = ""
          }

          this.setData({
            css2_s: this.data.css2
          })
        }

        var c3temp = 0;
        var c3B = 0;
        var loopNum = 0;

        for(let p in list) {
          // console.log(list[p])
          
          if(listKeys[p].toLowerCase().match(this.data.inputValue.toLowerCase()) || list[p].title.toLowerCase().match(this.data.inputValue.toLowerCase()) || list[p].keywords.toLowerCase().match(this.data.inputValue.toLowerCase())|| list[p].description.toLowerCase().match(this.data.inputValue.toLowerCase())) {

            console.log(list[p])

            var temp_n = 0;
            var temp_a = 0;
            var temp_y = 0;

            css3_sR[0] = css3_s[0] = temp_n = "";
            css3_sR[1] = css3_s[1] = temp_a = "";
            css3_sR[2] = css3_s[2] = temp_y = "";

            for(let a in list[p].stats.ie){
              if(list[p].stats.ie[a].match(/n|不支持/ig)){
                list[p].stats.ie[a] = "版本：" + a + " 及以下【不支持】"
                css3_s[0] = Number.parseFloat(a.replace(/(\d.*)[-]/ig,0));
              }else if(list[p].stats.ie[a].match(/a|p|部分支持/ig)){
                list[p].stats.ie[a] = "版本：" + a + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[1] = Number.parseFloat(a.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.ie[a].match(/y|已支持/ig)){
                list[p].stats.ie[a] = "版本：" + a + " 【已支持】"
                css3_s[2] = Number.parseFloat(a.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n > Number.parseFloat(css3_s[0]) && temp_n != 0) {
                css3_s[0] = temp_n;
              }else{
                temp_n = css3_s[0];
              }

              if(temp_a <= Number.parseFloat(css3_s[1]) && temp_a != 0) {
                css3_s[1] = temp_a;
              }else{
                temp_a = css3_s[1];
              }

              if(temp_y <= Number.parseFloat(css3_s[2]) && temp_y != 0) {
                css3_s[2] = temp_y;
              }else{
                temp_y = css3_s[2];
              }

              if(temp_n != undefined){
                css3_sR[0] = temp_n
              }

              if(temp_a != undefined){
                css3_sR[1] = temp_a
              }

              if(temp_y != undefined){
                css3_sR[2] = temp_y
              }
            }

            var temp_n1 = 0;
            var temp_a1 = 0;
            var temp_y1 = 0;     

            css3_sR[3] = css3_s[3] = temp_n1 = "";
            css3_sR[4] = css3_s[4] = temp_a1 = "";
            css3_sR[5] = css3_s[5] = temp_y1 = "";       
            for(let a1 in list[p].stats.edge){
              if(list[p].stats.edge[a1].match(/n|不支持/ig)){
                list[p].stats.edge[a1] = "版本：" + a1 + " 及以下【不支持】"
                css3_s[3] = Number.parseFloat(a1.replace(/(\d.*)[-]/ig,0));
              }else if(list[p].stats.edge[a1].match(/a|p|部分支持/ig)){
                list[p].stats.edge[a1] = "版本：" + a1 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[4] = Number.parseFloat(a1.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.edge[a1].match(/y|已支持/ig)){
                list[p].stats.edge[a1] = "版本：" + a1 + " 【已支持】"
                css3_s[5] = Number.parseFloat(a1.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n1 > Number.parseFloat(css3_s[3]) && temp_n1 != 0) {
                css3_s[3] = temp_n1;
              }else{
                temp_n1 = css3_s[3];
              }

              if(temp_a1 <= Number.parseFloat(css3_s[4]) && temp_a1 != 0) {
                css3_s[4] = temp_a1;
              }else{
                temp_a1 = css3_s[4];
              }

              if(temp_y1 <= Number.parseFloat(css3_s[5]) && temp_y1 != 0) {
                css3_s[5] = temp_y1;
              }else{
                temp_y1 = css3_s[5];
              }

              if(temp_n1 != undefined){
                css3_sR[3] = temp_n1
              }

              if(temp_a1 != undefined){
                css3_sR[4] = temp_a1
              }

              if(temp_y1 != undefined){
                css3_sR[5] = temp_y1
              }
            }
            
            var temp_n2 = 0;
            var temp_a2 = 0;
            var temp_y2 = 0;

            css3_sR[6] = css3_s[6] = temp_n2 = "";
            css3_sR[7] = css3_s[7] = temp_a2 = "";
            css3_sR[8] = css3_s[8] = temp_y2 = "";
            for(let a2 in list[p].stats.firefox){
              if(list[p].stats.firefox[a2].match(/n|不支持/ig)){
                list[p].stats.firefox[a2] = "版本：" + a2 + " 及以下【不支持】"
                css3_s[6] = Number.parseFloat(a2.replace(/(\d.*)[-]/ig,0));
              }else if(list[p].stats.firefox[a2].match(/a|p|部分支持/ig)){
                list[p].stats.firefox[a2] = "版本：" + a2 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[7] = Number.parseFloat(a2.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.firefox[a2].match(/y|已支持/ig)){
                list[p].stats.firefox[a2] = "版本：" + a2 + " 【已支持】"
                css3_s[8] = Number.parseFloat(a2.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n2 > css3_s[6] && temp_n2 != 0) {
                css3_s[6] = temp_n2;
              }else{
                temp_n2 = css3_s[6];
              }

              if(temp_a2 <= Number.parseFloat(css3_s[7]) && temp_a2 != 0) {
                css3_s[7] = temp_a2;
              }else{
                temp_a2 = css3_s[7];
              }

              if(temp_y2 <= Number.parseFloat(css3_s[8]) && temp_y2 != 0) {
                css3_s[8] = temp_y2;
              }else{
                temp_y2 = css3_s[8];
              }

              if(temp_n2 != undefined){
                css3_sR[6] = temp_n2
              }

              if(temp_a2 != undefined){
                css3_sR[7] = temp_a2
              }

              if(temp_y2 != undefined){
                css3_sR[8] = temp_y2
              }
            }
            
            var temp_n3 = 0;
            var temp_a3 = 0;
            var temp_y3 = 0;

            css3_sR[9] = css3_s[9] = temp_n3 = "";
            css3_sR[10] = css3_s[10] = temp_a3 = "";
            css3_sR[11] = css3_s[11] = temp_y3 = "";
            for(let a3 in list[p].stats.chrome){
              if(list[p].stats.chrome[a3].match(/n|不支持/ig)){
                list[p].stats.chrome[a3] = "版本：" + a3 + " 及以下【不支持】"
                css3_s[9] = Number.parseFloat(a3.replace(/(\d.*)[-]/ig,0));
              }else if(list[p].stats.chrome[a3].match(/a|p|部分支持/ig)){
                list[p].stats.chrome[a3] = "版本：" + a3 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[10] = Number.parseFloat(a3.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.chrome[a3].match(/y|已支持/ig)){
                list[p].stats.chrome[a3] = "版本：" + a3 + " 【已支持】"
                css3_s[11] = Number.parseFloat(a3.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n3 > css3_s[9] && temp_n3 != 0) {
                css3_s[9] = temp_n3;
              }else{
                temp_n3 = css3_s[9];
              }

              if(temp_a3 <= Number.parseFloat(css3_s[10]) && temp_a3 != 0) {
                css3_s[10] = temp_a3;
              }else{
                temp_a3 = css3_s[10];
              }

              if(temp_y3 <= Number.parseFloat(css3_s[11]) && temp_y3 != 0) {
                css3_s[11] = temp_y3;
              }else{
                temp_y3 = css3_s[11];
              }

              if(temp_n3 != undefined){
                css3_sR[9] = temp_n3
              }

              if(temp_a3 != undefined){
                css3_sR[10] = temp_a3
              }

              if(temp_y3 != undefined){
                css3_sR[11] = temp_y3
              }
            }
            
            var temp_n4 = 0;
            var temp_a4 = 0;
            var temp_y4 = 0;

            css3_sR[12] = css3_s[12] = temp_n4 = "";
            css3_sR[13] = css3_s[13] = temp_a4 = "";
            css3_sR[14] = css3_s[14] = temp_y4 = "";
            for(let a4 in list[p].stats.safari){
              if(list[p].stats.safari[a4].match(/n|不支持/ig)){
                list[p].stats.safari[a4] = "版本：" + a4 + " 及以下【不支持】"
                css3_s[12] = Number.parseFloat(a4.replace(/(\d.*)[-]/ig,0));
                Number.parseFloat(a4)?css3_s[12] = a4:css3_s[12] = 1
              }else if(list[p].stats.safari[a4].match(/a|p|部分支持/ig)){
                list[p].stats.safari[a4] = "版本：" + a4 + " 及以下【部分支持，可能需要浏览器前缀】"
                Number.parseFloat(a4)?css3_s[13] = a4:css3_s[13] = 1
                css3_s[13] = Number.parseFloat(a4.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.safari[a4].match(/y|已支持/ig)){
                list[p].stats.safari[a4] = "版本：" + a4 + " 【已支持】"
                Number.parseFloat(a4)?css3_s[14] = a4:css3_s[14] = 10000
              }

              if(temp_n4 > Number.parseFloat(css3_s[12]) && temp_n4 != 0) {
                css3_s[12] = temp_n4;
              }else{
                temp_n4 = css3_s[12];
              }

              if(temp_a4 <= Number.parseFloat(css3_s[13]) && temp_a4 != 0) {
                css3_s[13] = temp_a4;
              }else{
                temp_a4 = css3_s[13];
              }

              if(temp_y4 <= Number.parseFloat(css3_s[14]) && temp_y4 != 0) {
                css3_s[14] = temp_y4;
              }else{
                temp_y4 = css3_s[14];
              }
                
              if(temp_n4 != undefined){
                css3_sR[12] = temp_n4
              }

              if(temp_a4 != undefined){
                css3_sR[13] = temp_a4
              }

              if(temp_y4 != undefined){
                css3_sR[14] = temp_y4
              }
            }
            
            var temp_n5 = 0;
            var temp_a5 = 0;
            var temp_y5 = 0;

            css3_sR[15] = css3_s[15] = temp_n5 = "";
            css3_sR[16] = css3_s[16] = temp_a5 = "";
            css3_sR[17] = css3_s[17] = temp_y5 = "";
            for(let a5 in list[p].stats.opera){
              if(list[p].stats.opera[a5].match(/n|不支持/ig)){
                list[p].stats.opera[a5] = "版本：" + a5 + " 及以下【不支持】"
                css3_s[15] = a5;
              }else if(list[p].stats.opera[a5].match(/a|p|部分支持/ig)){
                list[p].stats.opera[a5] = "版本：" + a5 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[16] = a5;
              }else if(list[p].stats.opera[a5].match(/y|已支持/ig)){
                list[p].stats.opera[a5] = "版本：" + a5 + " 【已支持】"
                css3_s[17] = a5;
              }

              if(temp_n5 > Number.parseFloat(css3_s[15]) && temp_n5 != 0) {
                css3_s[15] = temp_n5;
              }else{
                temp_n5 = css3_s[15];
              }

              if(temp_a5 <= Number.parseFloat(css3_s[16]) && temp_a5 != 0) {
                css3_s[16] = temp_a5;
              }else{
                temp_a5 = css3_s[16];
              }

              if(temp_y5 <= Number.parseFloat(css3_s[17]) && temp_y5 != 0) {
                css3_s[17] = temp_y5;
              }else{
                temp_y5 = css3_s[17];
              }

                
              if(temp_n5 != undefined){
                css3_sR[15] = temp_n5
              }

              if(temp_a5 != undefined){
                css3_sR[16] = temp_a5
              }

              if(temp_y5 != undefined){
                css3_sR[17] = temp_y5
              }
            }
            
            var temp_n6 = 0;
            var temp_a6 = 0;
            var temp_y6 = 0;

            css3_sR[18] = css3_s[18] = temp_n6 = "";
            css3_sR[19] = css3_s[19] = temp_a6 = "";
            css3_sR[20] = css3_s[20] = temp_y6 = "";
            for(let a6 in list[p].stats.ios_saf){
              if(list[p].stats.ios_saf[a6].match(/n|不支持/ig)){
                list[p].stats.ios_saf[a6] = "版本：" + a6 + " 及以下【不支持】"
                css3_s[18] = a6;
                css3_s[18] = Number.parseFloat(a6.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.ios_saf[a6].match(/a|p|部分支持/ig)){
                list[p].stats.ios_saf[a6] = "版本：" + a6 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[19] = Number.parseFloat(a6.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.ios_saf[a6].match(/y|已支持/ig)){
                list[p].stats.ios_saf[a6] = "版本：" + a6 + " 【已支持】"
                css3_s[20] = Number.parseFloat(a6.replace(/[-](\d.*)/ig,".0"));
              }



              if(temp_n6 > Number.parseFloat(css3_s[18]) && temp_n6 != 0) {
                css3_s[18] = temp_n6;
              }else{
                temp_n6 = css3_s[18];
              }

              if(temp_a6 <= Number.parseFloat(css3_s[19]) && temp_a6 != 0) {
                css3_s[19] = temp_a6;
              }else{
                temp_a6 = css3_s[19];
              }

              if(temp_y6 <= Number.parseFloat(css3_s[20]) && temp_y6 != 0) {
                css3_s[20] = temp_y6;
              }else{
                temp_y6 = css3_s[20];
              }

                
              if(temp_n6 != undefined){
                css3_sR[18] = temp_n6
              }

              if(temp_a6 != undefined){
                css3_sR[19] = temp_a6
              }

              if(temp_y6 != undefined){
                css3_sR[20] = temp_y6
              }
            }
            
            var temp_n7 = 0;
            var temp_a7 = 0;
            var temp_y7 = 0;

            css3_sR[21] = css3_s[21] = temp_n7 = "";
            css3_sR[22] = css3_s[22] = temp_a7 = "";
            css3_sR[23] = css3_s[23] = temp_y7 = "";
            for(let a7 in list[p].stats.op_mini){
              if(a7.match(/all/ig)){
                if(list[p].stats.op_mini[a7].match(/n|不支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 及以下【不支持】"
                  css3_sR[21] = css3_s[21] = a7;
                }else if(list[p].stats.op_mini[a7].match(/a|p|部分支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 及以下【部分支持，可能需要浏览器前缀】"
                  css3_sR[22] = css3_s[22] = a7;
                }else if(list[p].stats.op_mini[a7].match(/y|已支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 【已支持】"
                  css3_sR[23] = css3_s[23] = a7;
                }
              }else{
                if(list[p].stats.op_mini[a7].match(/n|不支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 及以下【不支持】"
                  css3_s[21] = a7;
                  css3_s[21] = Number.parseFloat(a7.replace(/(\d.*)[-]/ig,0))
                }else if(list[p].stats.op_mini[a7].match(/a|p|部分支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 及以下【部分支持，可能需要浏览器前缀】"
                  css3_s[22] = Number.parseFloat(a7.replace(/[-](\d.*)/ig,".0"));
                  if(css3_s[22].match(/all/ig)){
                    css3_s[22] = a7
                  }
                }else if(list[p].stats.op_mini[a7].match(/y|已支持/ig)){
                  list[p].stats.op_mini[a7] = "版本：" + a7 + " 【已支持】"
                  css3_s[23] = Number.parseFloat(a7.replace(/[-](\d.*)/ig,".0"));
                  if(css3_s[23].match(/all/ig)){
                    css3_s[23] = a7
                  }
                }
              }

              if(temp_n7 > Number.parseFloat(css3_s[21]) && temp_n7 != 0) {
                css3_s[21] = temp_n7;
              }else{
                temp_n7 = css3_s[21];
              }

              if(temp_a7 <= Number.parseFloat(css3_s[22]) && temp_a7 != 0) {
                css3_s[22] = temp_a7;
              }else{
                temp_a7 = css3_s[22];
              }

              if(temp_y7 <= Number.parseFloat(css3_s[23]) && temp_y7 != 0) {
                css3_s[23] = temp_y7;
                console.log(list[p].stats.op_mini)
              }else{
                temp_y7 = css3_s[23];
              }

                
              if(temp_n7 != undefined){
                css3_sR[21] = temp_n7
              }

              if(temp_a7 != undefined){
                css3_sR[22] = temp_a7
              }

              if(temp_y7 != undefined){
                css3_sR[23] = temp_y7
              }
            }
            
            var temp_n8 = 0;
            var temp_a8 = 0;
            var temp_y8 = 0;

            css3_sR[23] = css3_s[23] = temp_n8 = "";
            css3_sR[25] = css3_s[25] = temp_a8 = "";
            css3_sR[26] = css3_s[26] = temp_y8 = "";
            for(let a8 in list[p].stats.android){
              if(list[p].stats.android[a8].match(/n|不支持/ig)){
                list[p].stats.android[a8] = "版本：" + a8 + " 及以下【不支持】"
                css3_s[24] = a8;
                css3_s[24] = Number.parseFloat(a8.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.android[a8].match(/a|p|部分支持/ig)){
                list[p].stats.android[a8] = "版本：" + a8 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[25] = Number.parseFloat(a8.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.android[a8].match(/y|已支持/ig)){
                list[p].stats.android[a8] = "版本：" + a8 + " 【已支持】"
                css3_s[26] = Number.parseFloat(a8.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n8 > Number.parseFloat(css3_s[24]) && temp_n8 != 0) {
                css3_s[24] = temp_n8;
              }else{
                temp_n8 = css3_s[24];
              }

              if(temp_a8 <= Number.parseFloat(css3_s[25]) && temp_a8 != 0) {
                css3_s[25] = temp_a8;
              }else{
                temp_a8 = css3_s[25];
              }

              if(temp_y8 <= Number.parseFloat(css3_s[26]) && temp_y8 != 0) {
                css3_s[26] = temp_y8;
              }else{
                temp_y8 = css3_s[26];
              }

              if(temp_n8 != undefined){
                css3_sR[24] = temp_n8
              }

              if(temp_a8 != undefined){
                css3_sR[25] = temp_a8
              }

              if(temp_y8 != undefined){
                css3_sR[26] = temp_y8
              }
            }
            
            var temp_n9 = 0;
            var temp_a9 = 0;
            var temp_y9 = 0;

            css3_sR[27] = css3_s[27] = temp_n9 = "";
            css3_sR[28] = css3_s[28] = temp_a9 = "";
            css3_sR[29] = css3_s[29] = temp_y9 = "";
            for(let a9 in list[p].stats.bb){
              if(list[p].stats.bb[a9].match(/n|不支持/ig)){
                list[p].stats.bb[a9] = "版本：" + a9 + " 及以下【不支持】"
                css3_s[27] = a9;
                css3_s[27] = Number.parseFloat(a9.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.bb[a9].match(/a|p|部分支持/ig)){
                list[p].stats.bb[a9] = "版本：" + a9 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[28] = Number.parseFloat(a9.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.bb[a9].match(/y|已支持/ig)){
                list[p].stats.bb[a9] = "版本：" + a9 + " 【已支持】"
                css3_s[29] = Number.parseFloat(a9.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n9 > Number.parseFloat(css3_s[27]) && temp_n9 != 0) {
                css3_s[27] = temp_n9;
              }else{
                temp_n9 = css3_s[27];
              }

              if(temp_a9 <= Number.parseFloat(css3_s[28]) && temp_a9 != 0) {
                css3_s[28] = temp_a9;
              }else{
                temp_a9 = css3_s[28];
              }

              if(temp_y9 <= Number.parseFloat(css3_s[29]) && temp_y9 != 0) {
                css3_s[29] = temp_y9;
              }else{
                temp_y9 = css3_s[29];
              }

              if(temp_n9 != undefined){
                css3_sR[27] = temp_n9
              }

              if(temp_a9 != undefined){
                css3_sR[28] = temp_a9
              }

              if(temp_y9 != undefined){
                css3_sR[29] = temp_y9
              }
            }
            
            var temp_n10 = 0;
            var temp_a10 = 0;
            var temp_y10 = 0;

            css3_sR[30] = css3_s[30] = temp_n10 = "";
            css3_sR[31] = css3_s[31] = temp_a10 = "";
            css3_sR[32] = css3_s[32] = temp_y10 = "";
            for(let a10 in list[p].stats.op_mob){
              if(list[p].stats.op_mob[a10].match(/n|不支持/ig)){
                list[p].stats.op_mob[a10] = "版本：" + a10 + " 及以下【不支持】"
                css3_s[30] = a10;
                css3_s[30] = Number.parseFloat(a10.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.op_mob[a10].match(/a|p|部分支持/ig)){
                list[p].stats.op_mob[a10] = "版本：" + a10 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[31] = Number.parseFloat(a10.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.op_mob[a10].match(/y|已支持/ig)){
                list[p].stats.op_mob[a10] = "版本：" + a10 + " 【已支持】"
                css3_s[32] = Number.parseFloat(a10.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n10 > Number.parseFloat(css3_s[30]) && temp_n10 != 0) {
                css3_s[30] = temp_n10;
              }else{
                temp_n10 = css3_s[30];
              }

              if(temp_a10 <= Number.parseFloat(css3_s[31]) && temp_a10 != 0) {
                css3_s[31] = temp_a10;
              }else{
                temp_a10 = css3_s[31];
              }

              if(temp_y10 <= Number.parseFloat(css3_s[32]) && temp_y10 != 0) {
                css3_s[32] = temp_y10;
              }else{
                temp_y10 = css3_s[32];
              }

              if(temp_n10 != undefined){
                css3_sR[30] = temp_n10
              }

              if(temp_a10 != undefined){
                css3_sR[31] = temp_a10
              }

              if(temp_y10 != undefined){
                css3_sR[32] = temp_y10
              }
            }
            
            var temp_n11 = 0;
            var temp_a11 = 0;
            var temp_y11 = 0;

            css3_sR[33] = css3_s[33] = temp_n11 = "";
            css3_sR[34] = css3_s[34] = temp_a11 = "";
            css3_sR[35] = css3_s[35] = temp_y11 = "";
            for(let a11 in list[p].stats.and_chr){
              if(list[p].stats.and_chr[a11].match(/n|不支持/ig)){
                list[p].stats.and_chr[a11] = "版本：" + a11 + " 及以下【不支持】"
                css3_s[33] = a11;
                css3_s[33] = Number.parseFloat(a11.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.and_chr[a11].match(/a|p|部分支持/ig)){
                list[p].stats.and_chr[a11] = "版本：" + a11 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[34] = Number.parseFloat(a11.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.and_chr[a11].match(/y|已支持/ig)){
                list[p].stats.and_chr[a11] = "版本：" + a11 + " 【已支持】"
                css3_s[35] = Number.parseFloat(a11.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n11 > Number.parseFloat(css3_s[33]) && temp_n11 != 0) {
                css3_s[33] = temp_n11;
              }else{
                temp_n11 = css3_s[33];
              }

              if(temp_a11 <= Number.parseFloat(css3_s[34]) && temp_a11 != 0) {
                css3_s[34] = temp_a11;
              }else{
                temp_a11 = css3_s[34];
              }

              if(temp_y11 <= Number.parseFloat(css3_s[35]) && temp_y11 != 0) {
                css3_s[35] = temp_y11;
              }else{
                temp_y11 = css3_s[35];
              }

              if(temp_n11 != undefined){
                css3_sR[33] = temp_n11
              }

              if(temp_a11 != undefined){
                css3_sR[34] = temp_a11
              }

              if(temp_y11 != undefined){
                css3_sR[35] = temp_y11
              }
            }
            
            var temp_n12 = 0;
            var temp_a12 = 0;
            var temp_y12 = 0;

            css3_sR[36] = css3_s[36] = temp_n12 = "";
            css3_sR[37] = css3_s[37] = temp_a12 = "";
            css3_sR[38] = css3_s[38] = temp_y12 = "";
            for(let a12 in list[p].stats.and_ff){
              if(list[p].stats.and_ff[a12].match(/n|不支持/ig)){
                list[p].stats.and_ff[a12] = "版本：" + a12 + " 及以下【不支持】"
                css3_s[36] = a12;
                css3_s[36] = Number.parseFloat(a12.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.and_ff[a12].match(/a|p|部分支持/ig)){
                list[p].stats.and_ff[a12] = "版本：" + a12 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[37] = Number.parseFloat(a12.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.and_ff[a12].match(/y|已支持/ig)){
                list[p].stats.and_ff[a12] = "版本：" + a12 + " 【已支持】"
                css3_s[38] = Number.parseFloat(a12.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n12 > Number.parseFloat(css3_s[36]) && temp_n12 != 0) {
                css3_s[36] = temp_n12;
              }else{
                temp_n12 = css3_s[36];
              }

              if(temp_a12 <= Number.parseFloat(css3_s[37]) && temp_a12 != 0) {
                css3_s[37] = temp_a12;
              }else{
                temp_a12 = css3_s[37];
              }

              if(temp_y12 <= Number.parseFloat(css3_s[38]) && temp_y12 != 0) {
                css3_s[38] = temp_y12;
              }else{
                temp_y12 = css3_s[38];
              }

              if(temp_n12 != undefined){
                css3_sR[36] = temp_n12
              }

              if(temp_a12 != undefined){
                css3_sR[37] = temp_a12
              }

              if(temp_y12 != undefined){
                css3_sR[38] = temp_y12
              }
            }
            
            var temp_n13 = 0;
            var temp_a13 = 0;
            var temp_y13 = 0;

            css3_sR[39] = css3_s[39] = temp_n13 = "";
            css3_sR[40] = css3_s[40] = temp_a13 = "";
            css3_sR[41] = css3_s[41] = temp_y13 = "";
            for(let a13 in list[p].stats.ie_mob){
              if(list[p].stats.ie_mob[a13].match(/n|不支持/ig)){
                list[p].stats.ie_mob[a13] = "版本：" + a13 + " 及以下【不支持】"
                css3_s[39] = a13;
                css3_s[39] = Number.parseFloat(a13.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.ie_mob[a13].match(/a|p|部分支持/ig)){
                list[p].stats.ie_mob[a13] = "版本：" + a13 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[40] = Number.parseFloat(a13.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.ie_mob[a13].match(/y|已支持/ig)){
                list[p].stats.ie_mob[a13] = "版本：" + a13 + " 【已支持】"
                css3_s[41] = Number.parseFloat(a13.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n13 > Number.parseFloat(css3_s[39]) && temp_n13 != 0) {
                css3_s[39] = temp_n13;
              }else{
                temp_n13 = css3_s[39];
              }

              if(temp_a13 <= Number.parseFloat(css3_s[40]) && temp_a13 != 0) {
                css3_s[40] = temp_a13;
              }else{
                temp_a13 = css3_s[40];
              }

              if(temp_y13 <= Number.parseFloat(css3_s[41]) && temp_y13 != 0) {
                css3_s[41] = temp_y13;
              }else{
                temp_y13 = css3_s[41];
              }

              if(temp_n13 != undefined){
                css3_sR[39] = temp_n13
              }

              if(temp_a13 != undefined){
                css3_sR[40] = temp_a13
              }

              if(temp_y13 != undefined){
                css3_sR[41] = temp_y13
              }
            }
            
            var temp_n14 = 0;
            var temp_a14 = 0;
            var temp_y14 = 0;

            css3_sR[42] = css3_s[42] = temp_n14 = "";
            css3_sR[43] = css3_s[43] = temp_a14 = "";
            css3_sR[44] = css3_s[44] = temp_y14 = "";
            for(let a14 in list[p].stats.and_uc){
              if(list[p].stats.and_uc[a14].match(/n|不支持/ig)){
                list[p].stats.and_uc[a14] = "版本：" + a14 + " 及以下【不支持】"
                css3_s[42] = a14;
                css3_s[42] = Number.parseFloat(a14.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.and_uc[a14].match(/a|p|部分支持/ig)){
                list[p].stats.and_uc[a14] = "版本：" + a14 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[43] = Number.parseFloat(a14.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.and_uc[a14].match(/y|已支持/ig)){
                list[p].stats.and_uc[a14] = "版本：" + a14 + " 【已支持】"
                css3_s[44] = Number.parseFloat(a14.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n14 > Number.parseFloat(css3_s[42]) && temp_n14 != 0) {
                css3_s[42] = temp_n14;
              }else{
                temp_n14 = css3_s[42];
              }

              if(temp_a14 <= Number.parseFloat(css3_s[43]) && temp_a14 != 0) {
                css3_s[43] = temp_a14;
              }else{
                temp_a14 = css3_s[43];
              }

              if(temp_y14 <= Number.parseFloat(css3_s[44]) && temp_y14 != 0) {
                css3_s[44] = temp_y14;
              }else{
                temp_y14 = css3_s[44];
              }

              if(temp_n14 != undefined){
                css3_sR[42] = temp_n14
              }

              if(temp_a14 != undefined){
                css3_sR[43] = temp_a14
              }

              if(temp_y14 != undefined){
                css3_sR[44] = temp_y14
              }
            }
            
            var temp_n15 = 0;
            var temp_a15 = 0;
            var temp_y15 = 0;

            css3_sR[45] = css3_s[45] = temp_n15 = "";
            css3_sR[46] = css3_s[46] = temp_a15 = "";
            css3_sR[47] = css3_s[47] = temp_y15 = "";
            for(let a15 in list[p].stats.samsung){
              if(list[p].stats.samsung[a15].match(/n|不支持/ig)){
                list[p].stats.samsung[a15] = "版本：" + a15 + " 及以下【不支持】"
                css3_s[45] = a15;
                css3_s[45] = Number.parseFloat(a15.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.samsung[a15].match(/a|p|部分支持/ig)){
                list[p].stats.samsung[a15] = "版本：" + a15 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[46] = Number.parseFloat(a15.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.samsung[a15].match(/y|已支持/ig)){
                list[p].stats.samsung[a15] = "版本：" + a15 + " 【已支持】"
                css3_s[47] = Number.parseFloat(a15.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n15 > Number.parseFloat(css3_s[45]) && temp_n15 != 0) {
                css3_s[45] = temp_n15;
              }else{
                temp_n15 = css3_s[45];
              }

              if(temp_a15 <= Number.parseFloat(css3_s[46]) && temp_a15 != 0) {
                css3_s[46] = temp_a15;
              }else{
                temp_a15 = css3_s[46];
              }

              if(temp_y15 <= Number.parseFloat(css3_s[47]) && temp_y15 != 0) {
                css3_s[47] = temp_y15;
              }else{
                temp_y15 = css3_s[47];
              }

              if(temp_n15 != undefined){
                css3_sR[45] = temp_n15
              }

              if(temp_a15 != undefined){
                css3_sR[46] = temp_a15
              }

              if(temp_y15 != undefined){
                css3_sR[47] = temp_y15
              }
            }
            
            var temp_n16 = 0;
            var temp_a16 = 0;
            var temp_y16 = 0;

            css3_sR[48] = css3_s[48] = temp_n16 = "";
            css3_sR[49] = css3_s[49] = temp_a16 = "";
            css3_sR[50] = css3_s[50] = temp_y16 = "";
            for(let a16 in list[p].stats.and_qq){
              if(list[p].stats.and_qq[a16].match(/n|不支持/ig)){
                list[p].stats.and_qq[a16] = "版本：" + a16 + " 及以下【不支持】"
                css3_s[48] = a16;
                css3_s[48] = Number.parseFloat(a16.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.and_qq[a16].match(/a|p|部分支持/ig)){
                list[p].stats.and_qq[a16] = "版本：" + a16 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[49] = Number.parseFloat(a16.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.and_qq[a16].match(/y|已支持/ig)){
                list[p].stats.and_qq[a16] = "版本：" + a16 + " 【已支持】"
                css3_s[50] = Number.parseFloat(a16.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n16 > Number.parseFloat(css3_s[48]) && temp_n16 != 0) {
                css3_s[48] = temp_n16;
              }else{
                temp_n16 = css3_s[48];
              }

              if(temp_a16 <= Number.parseFloat(css3_s[49]) && temp_a16 != 0) {
                css3_s[49] = temp_a16;
              }else{
                temp_a16 = css3_s[49];
              }

              if(temp_y16 <= Number.parseFloat(css3_s[50]) && temp_y16 != 0) {
                css3_s[50] = temp_y16;
              }else{
                temp_y16 = css3_s[50];
              }

              if(temp_n16 != undefined){
                css3_sR[48] = temp_n16
              }

              if(temp_a16 != undefined){
                css3_sR[49] = temp_a16
              }

              if(temp_y16 != undefined){
                css3_sR[50] = temp_y16
              }
            }
            
            var temp_n17 = 0;
            var temp_a17 = 0;
            var temp_y17 = 0;

            css3_sR[51] = css3_s[51] = temp_n17 = "";
            css3_sR[52] = css3_s[52] = temp_a17 = "";
            css3_sR[53] = css3_s[53] = temp_y17 = "";
            for(let a17 in list[p].stats.baidu){
              if(list[p].stats.baidu[a17].match(/n|不支持/ig)){
                list[p].stats.baidu[a17] = "版本：" + a17 + " 及以下【不支持】"
                css3_s[51] = a17;
                css3_s[51] = Number.parseFloat(a17.replace(/(\d.*)[-]/ig,0))
              }else if(list[p].stats.baidu[a17].match(/a|p|部分支持/ig)){
                list[p].stats.baidu[a17] = "版本：" + a17 + " 及以下【部分支持，可能需要浏览器前缀】"
                css3_s[52] = Number.parseFloat(a17.replace(/[-](\d.*)/ig,".0"));
              }else if(list[p].stats.baidu[a17].match(/y|已支持/ig)){
                list[p].stats.baidu[a17] = "版本：" + a17 + " 【已支持】"
                css3_s[53] = Number.parseFloat(a17.replace(/[-](\d.*)/ig,".0"));
              }

              if(temp_n17 > Number.parseFloat(css3_s[51]) && temp_n17 != 0) {
                css3_s[51] = temp_n17;
              }else{
                temp_n17 = css3_s[51];
              }

              if(temp_a17 <= Number.parseFloat(css3_s[52]) && temp_a17 != 0) {
                css3_s[52] = temp_a17;
              }else{
                temp_a17 = css3_s[52];
              }

              if(temp_y17 <= Number.parseFloat(css3_s[53]) && temp_y17 != 0) {
                css3_s[53] = temp_y17;
              }else{
                temp_y17 = css3_s[53];
              }

              if(temp_n17 != undefined){
                css3_sR[51] = temp_n17
              }

              if(temp_a17 != undefined){
                css3_sR[52] = temp_a17
              }

              if(temp_y17 != undefined){
                css3_sR[53] = temp_y17
              }
            }

            this.setData({
              ['c3Result['+c3temp+']']: {
                c3T: c3temp + "、" + list[p].title,
                c3D: list[p].description,
                c3K: list[p].keywords,
                c3N: list[p].notes,
                c3UA: list[p].usage_perc_a,
                c3UY: list[p].usage_perc_y,
                c3Browser: list[p].stats,
                csBrowser_ieN: css3_sR[0],
                csBrowser_ieA: css3_sR[1],
                csBrowser_ieY: css3_sR[2],
                csBrowser_edgeN: css3_sR[3],
                csBrowser_edgeA: css3_sR[4],
                csBrowser_edgeY: css3_sR[5],
                csBrowser_firefoxN: css3_sR[6],
                csBrowser_firefoxA: css3_sR[7],
                csBrowser_firefoxY: css3_sR[8],
                csBrowser_chromeN: css3_sR[9],
                csBrowser_chromeA: css3_sR[10],
                csBrowser_chromeY: css3_sR[11],
                csBrowser_safariN: css3_sR[12],
                csBrowser_safariA: css3_sR[13],
                csBrowser_safariY: css3_sR[14],
                csBrowser_operaN: css3_sR[15],
                csBrowser_operaA: css3_sR[16],
                csBrowser_operaY: css3_sR[17],
                csBrowser_ios_safN: css3_sR[18],
                csBrowser_ios_safA: css3_sR[19],
                csBrowser_ios_safY: css3_sR[20],
                csBrowser_op_miniN: css3_sR[21],
                csBrowser_op_miniA: css3_sR[22],
                csBrowser_op_miniY: css3_sR[23],
                csBrowser_androidN: css3_sR[24],
                csBrowser_androidA: css3_sR[25],
                csBrowser_androidY: css3_sR[26],
                csBrowser_bbN: css3_sR[27],
                csBrowser_bbA: css3_sR[28],
                csBrowser_bbY: css3_sR[29],
                csBrowser_op_mobN: css3_sR[30],
                csBrowser_op_mobA: css3_sR[31],
                csBrowser_op_mobY: css3_sR[32],
                csBrowser_and_chrN: css3_sR[33],
                csBrowser_and_chrA: css3_sR[34],
                csBrowser_and_chrY: css3_sR[35],
                csBrowser_and_ffN: css3_sR[36],
                csBrowser_and_ffA: css3_sR[37],
                csBrowser_and_ffY: css3_sR[38],
                csBrowser_ie_mobN: css3_sR[39],
                csBrowser_ie_mobA: css3_sR[40],
                csBrowser_ie_mobY: css3_sR[41],
                csBrowser_and_ucN: css3_sR[42],
                csBrowser_and_ucA: css3_sR[43],
                csBrowser_and_ucY: css3_sR[44],
                csBrowser_samsungN: css3_sR[45],
                csBrowser_samsungA: css3_sR[46],
                csBrowser_samsungY: css3_sR[47],
                csBrowser_and_qqN: css3_sR[48],
                csBrowser_and_qqA: css3_sR[49],
                csBrowser_and_qqY: css3_sR[50],
                csBrowser_baiduN: css3_sR[51],
                csBrowser_baiduA: css3_sR[52],
                csBrowser_baiduY: css3_sR[53]
              },
              loadMore: "",
              loadMoreClass: ""
            })

            if(loopNum >= refreshAgain) {
              wx.showToast({
                title: '加载前 ' + c3temp + ' 条数据',
                icon: 'loading',
                mask: true,
                duration: 3000
              }),
              this.setData({
                loadMore: "getMoreList",
                loadMoreClass: "moreListCollapse"
              }),
              c3temp = refreshAgain;
            }

            c3temp++;
            loopNum++;
          }
          // else{
          //   find404++;
          // }
        }

        if(c3temp == 0){
          this.setData({
            findTips404: "findTips404",
            findTips404Text: "你确定要输入的这个属性是："
          })
        }
      }
    }
  }
})
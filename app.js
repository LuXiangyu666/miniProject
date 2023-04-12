// app.js
App({
  onLaunch() {
    const positon = wx.getStorageSync('positon');     
    if(!positon){           //当缓存中没有位置信息时才进行获取
      this.getLocation();
    }
  },

  //获取用户定位
  getLocation: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var positon = {latitude,longitude}
        wx.setStorageSync('positon', positon)
      },
      complete(r) {
        console.log(r)
        console.log(222)
      }
    })
  },

  globalData: {
    index:-1,
  }
})

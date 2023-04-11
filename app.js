// app.js
App({
  onLaunch() {
   this.getLocation();
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

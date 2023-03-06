//导入request请求工具类
import {
  getBaseUrl,
  requestUtil
} from '../../utils/requestUtil';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '',
    img_arr: [],
    formdata: '',
    name: '请选择您的位置',
    address: '',
    latitude: '',
    longitude: '',
    price: '',
    chooseMode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
  },

  //点击发布按钮
  formSubmit() {
    this.uploadFile(0)
  },
  //上传图片
  uploadFile: function (index) {
    var that = this
    //如果所有图片都已经上传完，就不再往下执行
    if (index >= that.data.img_arr.length) {
      return
    }
    wx.uploadFile({
      url: 'http://192.168.16.122:8080/upload/picture', //自己的Java后台接口地址
      filePath: that.data.img_arr[index],
      name: 'content',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        'Authorization': 'okgoodit' //若有token，此处换上你的token，没有的话省略
      },
      formData: ({ //上传图片所要携带的参数
        username: "编程小石头",
        password: '2501902696'
      }),
      success: function (res) {
        console.log(`第${index+1}张上传成功`, res)
        index++
        that.uploadFile(index)
      },
      fail(res) {
        console.log(`第${index+1}张上传失败`, res)
      }
    })
  },

  //选择图片
  chooseImg() {
    var that = this;
    //这里小程序规定最好只能选9张，我这里随便填的3，你也可以自己改
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          });
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },

  //获取定位
  getLocation: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
      },
      complete(r){
        console.log(r)
        console.log(222)
      }
    })
  },

  priceBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      price: value
    })
  },

  handleChooseMode() {
    var that = this;
    let chooseMode = '';
    wx.showActionSheet({
      itemList: ['线上邮寄', '线下自提'],
      itemColor: '#007aff',
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex === 0) {
          chooseMode = "线上邮寄";
        } else if (res.tapIndex === 1) {
          chooseMode = "线下自提";
        }
        that.setData({
          chooseMode
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
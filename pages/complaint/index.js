//导入request请求工具类
import {
  getBaseUrl,
  requestUtil
} from '../../utils/requestUtil';
import regeneratorRuntime from '../../lib/runtime/runtime';

const upload = require('../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '',
    productObj:'',
    productId:'',
    sellerId:'',
    buyerId:'',
    content:'',
    img_arr:[],
    url: [],
    state:['投诉未通过','投诉中','投诉成功']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options); //用options.id获取参数id
    const baseUrl = getBaseUrl();
    let buyerId = wx.getStorageSync('user_id');
    this.getProductDetail(options.id);
    this.setData({
      baseUrl,
      productId:options.id,
      sellerId:options.sellerId,
      buyerId
    })
  },

  //发布投诉
  async handleComplaint() {
    const buyerId = this.data.buyerId;
    const sellerId = this.data.sellerId;
    const content = this.data.content;
    const pic = this.data.img_arr[0];
    console.log(pic);
    let complaintImg = [];
    this.data.img_arr.forEach(v => complaintImg.push({
      image: v,
    }))
    const complaintParam = {
      buyerId,
      sellerId,
      content,
      pic,
      complaintImg,
    }
    const res = await requestUtil({
      url: "/complaint/createComplaint",
      method: "POST",
      data: complaintParam
    });
    console.log(res);
    //发布投诉成功
    //跳转到订单页面
    wx.redirectTo({
      url: "/pages/order/index?type=0",
    })
  },

    //选择要上传的图片
    chooseImage: function (e) {
      var that = this;
      if (this.data.img_arr.length < 3) {
        wx.chooseImage({
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let tempFilePaths = res.tempFilePaths;
            that.setData({
              url: that.data.url.concat(tempFilePaths),
            })
            console.log("url成功")
            upload("/shop/complaintImg", tempFilePaths).then(res => {
              let data = JSON.parse(res.data)
              console.log(data)
              // let img_arr = [];
              // img_arr.concat(data.msg);
              that.setData({
                //url: that.data.baseUrl + '/upload/${data.message}',
                img_arr: that.data.img_arr.concat(data.msg)
              })
              console.log("img_arr成功")
            })
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



    //输入投诉内容双向绑定
    descriptionBind: function (e) {
      // 获取输入框当前value值
      let value = e.detail.value
      // 及时更新数据
      this.setData({
        content: value
      })
    },

  //获取商品详情
  async getProductDetail(id) {
    const result = await requestUtil({
      url: '/product/detail',
      data: {
        id
      },
      method: "GET"
    });
    this.setData({
      productObj: result.message,
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
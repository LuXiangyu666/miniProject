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
    myProductList: [],
    productState: ['审核未通过', '审核中', '已上架', '未发货', '已发货', '卖家已收货'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //console.log(options.id);      //用options.id获取参数id
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
    this.getMyProductList(options.id);

  },


  //发货
  async handleFaHuo(event) {
    //console.log(event);
    let index = event.currentTarget.dataset.index;
    if (this.data.myProductList[index].state == 3) {
      let id = event.currentTarget.dataset.id;
      const result = await requestUtil({
        url: '/product/fahuo',
        method: "GET",
        data: {id},
      });
      console.log(result);
      this.getMyProductList(this.data.myProductList[0].sellerId);
      wx.showToast({
        title: '发货成功',
        icon: 'success',
        duration: 500 //持续的时间
      })
    }
  },



  //获取我的商品
  async getMyProductList(id) {
    const result = await requestUtil({
      url: '/product/myproduct',
      method: "GET",
      data: {
        id
      },
    });
    this.setData({
      myProductList: result.message,
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
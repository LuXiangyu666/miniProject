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
    myProductList:[],
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

  //获取我的商品
  async getMyProductList(id) {
    const result = await requestUtil({
      url: '/product/myproduct',
      method: "GET",
      data:{id},
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
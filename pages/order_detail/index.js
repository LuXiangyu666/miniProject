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
    orderId:'',
    productList: [],
    productState: ['', '审核中', '已上架', '未发货', '已发货', '已收货'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id); //用options.id获取参数id
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
    this.getProductList(options.id);
    this.setData({
      orderId:options.id,
    })

  },

  //收货
  async handleShouHuo(event) {
    //console.log(event);
    let index = event.currentTarget.dataset.index;
    if (this.data.productList[index].state == 4) {
      let id = event.currentTarget.dataset.id;
      const result = await requestUtil({
        url: '/product/shouhuo',
        method: "GET",
        data: {id},
      });
      console.log(result);
      //this.getProductList(this.data.productList[0].sellerId);
      this.setData({
        productList:[],
      })
      this.getProductList(this.data.orderId);
      wx.showToast({
        title: '收货成功',
        icon: 'success',
        duration: 800 //持续的时间
      })
    }
  },

  //获取订单商品列表
  async getProductList(id) {
    const result = await requestUtil({
      url: '/my/order/productIdList',
      method: "GET",
      data: {
        id
      },
    });
    console.log(result.message);
    var result_id = result.message;
    for (var key in result_id) {
      console.log(key); // key值
      console.log(result_id[key]); // value值
      let id = result_id[key].goodsId;
      this.getProductDetail(id);
    }
  },



  //获取商品详情
  async getProductDetail(id) {
    const result = await requestUtil({
      url: '/product/detail',
      data: {id},
      method: "GET"
    });
    let productList = this.data.productList;
    productList.push(result.message);
    this.setData({
      productList
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
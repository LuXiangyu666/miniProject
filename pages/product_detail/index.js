// pages/product_detail/index.js

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
    productObj:{},
    activeIndex:0,
  },

  productInfo:{

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
    this.getProductDetail(options.id);
  },

  //商品详细信息切换点击事件
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    // console.log(e);
    this.setData({
      activeIndex:index
    })
  },

  //获取商品详情
  async getProductDetail(id) {
    const result = await requestUtil({
      url: '/product/detail',
      data:{id},
      method: "GET"
    });
    this.productInfo = result.message;
    this.setData({
      productObj: result.message,
    })
  },

  //点击事件 商品加入购物车,同时提示加入成功
  handleCartAdd(){
    this.setCartAdd();
    this.showToast();
  },
  

  //点击事件 商品加入购物车
  setCartAdd(){
    let cart = wx.getStorageSync('cart')||[];
    let index = cart.findIndex(v=>v.id===this.productInfo.id);
    if(index === -1){      // 购物车不存在当前商品
      this.productInfo.num = 1;         //定义商品的数量属性，初始化为1
      this.productInfo.checked = true;
      cart.push(this.productInfo);      //将此商品对象加入缓存
    }else{                 //当前商品已存在
      cart[index].num++;                //商品数量加一
      console.log(cart[index].num);
    }
    wx.setStorageSync('cart', cart)     //将购物车加入缓存
  },

  //提示加入购物车成功
  showToast(){
    wx.showToast({
      title: '加入成功！',
      icon:'success',
      mask:true,
    })
  },

  //点击立即购买
  handleBuy(){
    this.setCartAdd();
    wx:wx.switchTab({
      url: '/pages/cart/index',
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
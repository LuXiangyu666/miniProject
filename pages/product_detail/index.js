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
    productObj: {},
    activeIndex: 0,
    distance: 0, //距离
    wxuserImg: '',    //用户头像图片名
    remark:'',        //留言内容
    remarkList:[],
    user_id:'',
  },

  productInfo: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //console.log(options.id);      //用options.id获取参数id
    const baseUrl = getBaseUrl();
    this.getProductDetail(options.id);
    let wxuserImg = wx.getStorageSync('wxuserImg');
    const user_id = wx.getStorageSync('user_id');
    this.setData({
      baseUrl,
      wxuserImg,
      user_id
    })
    this.getRemarkList(options.id)
  },

  //发布留言
  async handleCreateRemark(){
    const user_id = this.data.user_id;
    const product_id = this.data.productObj.id;
    const content = this.data.remark;
    const wxuserImg = this.data.wxuserImg;
    const user_name = wx.getStorageSync('userInfo')[1];
    const remarkParam = {
      user_id,
      product_id,
      content,
      wxuserImg,
      user_name,
    }
    const res = await requestUtil({
      url: "/remark/createRemark",
      method: "POST",
      data: remarkParam
    });
    let remark = '';
    this.setData({
      remark,
    })
    this.getRemarkList(this.data.productObj.id);
  },

  //获取留言
  async getRemarkList(id) {
    const result = await requestUtil({
      url: '/remark/getRemark',
      method: "GET",
      data:{id},
    });
    this.setData({
      remarkList: result.message,
    })
    //console.log(result.message);
  },

  //商品留言双向绑定
  descriptionBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      remark: value
    })
  },

  //删除留言
   handleDeleteRemark: function (e){
    //console.log(e);
    let id = e.currentTarget.dataset.id;
    const result =  requestUtil({
      url: '/remark/delete',
      data: {id},
      method: "GET"
    });
    //console.log(result);
    this.getRemarkList(this.data.productObj.id);
  },



  // 计算距离函数
  Rad(d) {
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance(lat1, lng1, lat2, lng2) {
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    console.log(s);
    s = s.toFixed(1) + 'km' //保留两位小数
    console.log('经纬度计算的距离:' + s)
    return s
  },


  //商品详细信息切换点击事件
  handleItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    // console.log(e);
    if(index==1){
      this.getRemarkList(this.data.productObj.id);
    }
    this.setData({
      activeIndex: index
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
    this.productInfo = result.message;
    this.setData({
      productObj: result.message,
    })

    let lat1 = wx.getStorageSync('positon').latitude; // lat1用户的纬度 lng1用户的经度 lat2商家的纬度  lng2商家的经度
    let lng1 = wx.getStorageSync('positon').longitude;
    let lat2 = this.data.productObj.latitude;
    let lng2 = this.data.productObj.longitude;
    let distance = this.getDistance(lat1, lng1, lat2, lng2);
    console.log(distance);
    this.setData({
      distance,
    })
  },

  //点击事件 商品加入购物车,同时提示加入成功
  handleCartAdd() {
    this.setCartAdd();
    this.showToast();
  },


  //点击事件 商品加入购物车
  setCartAdd() {
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.id === this.productInfo.id);
    if (index === -1) { // 购物车不存在当前商品
      this.productInfo.num = 1; //定义商品的数量属性，初始化为1
      this.productInfo.checked = true;
      cart.push(this.productInfo); //将此商品对象加入缓存
    } else { //当前商品已存在
      cart[index].num++; //商品数量加一
      console.log(cart[index].num);
    }
    wx.setStorageSync('cart', cart) //将购物车加入缓存
  },

  //提示加入购物车成功
  showToast() {
    wx.showToast({
      title: '加入成功！',
      icon: 'success',
      mask: true,
    })
  },

  //点击立即购买
  handleBuy() {
    this.setCartAdd();
    wx: wx.switchTab({
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
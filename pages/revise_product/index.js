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
    productMsg:{},
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
    this.getProductList(options.id);
  },

  
  //创建商品
  async reviseProduct() {
    const productParam = this.data.productMsg;
    const res = await requestUtil({
      url: "/product/revise",
      method: "POST",
      data: productParam
    });
    console.log(res);
   
    //跳转到新创建的商品的详情页
    wx.redirectTo({
      url: "/pages/product_detail/index?id=" + this.data.productMsg.id,
    })
  },


  //获取商品信息
  async getProductList(id) {
    const result = await requestUtil({
      url: '/product/detail',
      method: "GET",
      data:{id},
    });
    this.setData({
      productMsg: result.message,
    })
    console.log(result.message);
  },

  
  //商品名称双向绑定
  productNameBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      ['productMsg.name']: value,
    })
  },

  //商品价格双向绑定
  priceBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      ['productMsg.price']: value,
    })
  },

  //商品库存双向绑定
  stockBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      ['productMsg.stock']: value
    })
  },

  
  //商品描述双向绑定
  descriptionBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      ['productMsg.description']: value
    })
  },


  //选择交易方式
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
          ['productMsg.chooseMode']: chooseMode
        })
      }
    })
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
          ['productMsg.address']: address,
          ['productMsg.latitude']: latitude,
          ['productMsg.longitude']: longitude
        })
      },
      complete(r) {
        console.log(r)
        console.log(222)
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
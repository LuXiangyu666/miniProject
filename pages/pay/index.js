//导入request请求工具类
import {
  getBaseUrl,
  getWxLogin,
  //getUserMsg,
  requestUtil,
} from '../../utils/requestUtil';
import regeneratorRuntime from '../../lib/runtime/runtime';

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    baseUrl: '',
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    avatarUrl: defaultAvatarUrl, //用户头像地址
    nickName: '',
    UserMsg: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl,
    })
    var avatarUrl = wx.getStorageSync('userInfo')[0];
    var nickName = wx.getStorageSync('userInfo')[1];
    var token = wx.getStorageSync('token');
    this.setData({
      avatarUrl,
      nickName,
      token
    })
  },

  //载入用户头像
  onChooseAvatar(e) {
    console.log(e);
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
  },

  //将用户名载入页面数据
  formSubmit(e) {
    //console.log('昵称：',e.detail.value.nickname)
    const nickName = e.detail.value.nickname
    //console.log(nickName);
    this.setData({
      nickName
    })
  },

  //用户头像、昵称封装
  getAjax2() {
    return new Promise((resolve, reject) => {
      let url = this.data.avatarUrl;
      let name = this.data.nickName;
      let UserMsg = [];
      UserMsg.push(url);
      UserMsg.push(name);
      this.setData({
        UserMsg,
      })
      resolve(this.data.UserMsg);
      reject('失败');
    });
  },


  //处理订单支付
  async handleOrderPay() {
    const token = wx.getStorageSync('token');
    if (!token) {
      let p2 = this.getAjax2();
      Promise.all([getWxLogin(), p2]).then((res) => {
        console.log("code是  " + res[0].code);
        console.log("头像地址  " + res[1][0]);
        console.log("昵称  " + res[1][1]);
        let loginParam = {
          code: res[0].code,
          nickName: res[1][1],
          avatarUrl: res[1][0],
        }
        console.log(loginParam);
        wx.setStorageSync('userInfo', res[1]);
        this.wxlogin(loginParam);
      })
    } else {
      console.log("token存在：" + token);
      console.log("支付继续，创建订单");
      this.createOrder();
    }
  },

  //请求后端获取用户token
  async wxlogin(loginParam) {
    const result = await requestUtil({
      url: "/user/wxlogin",
      data: loginParam,
      method: "post"
    })
    console.log(result);
    const token = result.token;
    if (result.code === 0) {
      //存储token到缓存
      wx.setStorageSync('token', token);
      //继续创建订单
      console.log("支付继续，创建订单");
      this.createOrder();
    }
  },

  //创建订单
  async createOrder() {
    //const totalPrice = this.data.totalPrice;
    const address = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo;
    const consignee = this.data.address.userName;
    const telNumber = this.data.address.telNumber;
    let goods = [];
    //修改各个商品状态
    this.data.cart.forEach(async function(item){
      let id = item.id;
      const result = await requestUtil({
        url: '/product/noFaHuo',
        method: "GET",
        data: {id},
      });
      console.log(result);
    })

    //依次将购物车中的商品生成各自的订单
    this.data.cart.forEach(async function(v){
      let goods=[];
      goods.push({
        goodsId: v.id,
        goodsNumber: v.num,
        goodsPrice: v.price,
        goodsName: v.name,
        goodsPic: v.proPic
      })
      console.log(goods);
      const orderParam = {
        totalPrice:v.num*v.price,
        address,
        consignee,
        telNumber,
        goods
      }
      const res = await requestUtil({
        url: "/my/order/create",
        method: "POST",
        data: orderParam
      });
      console.log("orderNo=" + res.orderNo);
    //跳转到新创建的订单页
    wx.redirectTo({
      url: "/pages/order/index?type=0",
    })
    })

    // this.data.cart.forEach(v => goods.push({
    //   goodsId: v.id,
    //   goodsNumber: v.num,
    //   goodsPrice: v.price,
    //   goodsName: v.name,
    //   goodsPic: v.proPic
    // }))
  
    // const orderParam = {
    //   totalPrice,
    //   address,
    //   consignee,
    //   telNumber,
    //   goods
    // }
    // const res = await requestUtil({
    //   url: "/my/order/create",
    //   method: "POST",
    //   data: orderParam
    // });
    // console.log("orderNo=" + res.orderNo);
    // //跳转到新创建的订单页
    // wx.redirectTo({
    //   url: "/pages/order/index?type=0",
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked); //购物车过滤，只要已选中的商品
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => { //遍历购物车中每一条商品
      totalNum += v.num; //计算选中的商品总数
      totalPrice += v.price * v.num; //计算选中的商品总价
    })
    this.setData({
      cart,
      address,
      totalNum,
      totalPrice
    })
  },

})
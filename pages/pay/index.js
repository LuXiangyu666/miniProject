//导入request请求工具类
import {
  getBaseUrl,
  getWxLogin,
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
    avatarUrl: defaultAvatarUrl,   //用户头像地址
    nickName:'',
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

  //载入用户头像
  onChooseAvatar(e) {
    console.log(e);
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  //将用户名载入页面数据
  formSubmit(e){
    //console.log('昵称：',e.detail.value.nickname)
    const  nickName  = e.detail.value.nickname
    //console.log(nickName);
    this.setData({
      nickName
    })
  }, 

  //处理订单支付
  async handleOrderPay(){
    // wx.login({
    //   timeout:5000,
    //   success: (res) => {
    //     console.log(res.code);
    //   },
    // })
    let res = await getWxLogin();
    console.log(res.code);
    console.log(this.data.avatarUrl);
    console.log(this.data.nickName);
   

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v=>v.checked);     //购物车过滤，只要已选中的商品
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
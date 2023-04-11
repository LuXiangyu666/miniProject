//导入request请求工具类
import {
  getBaseUrl,
  getWxLogin,
  //getUserMsg,
  requestUtil,
} from '../../utils/requestUtil';
import regeneratorRuntime from '../../lib/runtime/runtime';

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: defaultAvatarUrl, //用户头像地址
    nickName: '请选择昵称',
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
    // var avatarUrl = wx.getStorageSync('userInfo')[0];
    // var nickName = wx.getStorageSync('userInfo')[1];
    // console.log("头像地址是："+avatarUrl);
    // console.log("昵称是："+nickName);
    // this.setData({
    //   avatarUrl,
    //   nickName
    // })
  },

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
        console.log("loginParam="+loginParam);
        wx.setStorageSync('userInfo', res[1]);
        this.wxlogin(loginParam);
        this.setData({
          userInfo: res[1],
        })
      })
    } else {
      console.log("token存在：" + token);
      const userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      })
    }
    // let that = this
    // that.onLoad();
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
    const sellerId = result.id;
    if (result.code === 0) {
      //存储token到缓存
      wx.setStorageSync('token', token);
      wx.setStorageSync('sellerId', sellerId);
    }
  },

  //载入用户头像
  onChooseAvatar(e) {
    console.log(e);
    const {avatarUrl} = e.detail
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

  // 点击 编辑收货地址
  handleEditAddress(){
    wx.chooseAddress({
      success: (result) => {},
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
    var avatarUrl = wx.getStorageSync('userInfo')[0];
    var nickName = wx.getStorageSync('userInfo')[1];
    var token = wx.getStorageSync('token');
    console.log("头像地址是："+avatarUrl);
    console.log("昵称是："+nickName);
    this.setData({
      avatarUrl,
      nickName,
      token,
    })
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
// pages/category/index.js

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
    scrollTop: 0, //设置竖向滚动条位置
    currentIndex: 0, //左侧菜单当前选中的索引
    leftMenuList: [], //左侧菜单数据
    rightContext: [], //右侧商品数据
  },

  Cates: [], //  所有数据

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
    this.getCates();
  },

  //获取商品分类数据
  async getCates() {
    const result = await requestUtil({
      url: '/bigType/findCategories',
      method: "GET"
    });
    this.Cates = result.message;
    let leftMenuList = this.Cates.map((v) => {
      return v.name;
    })
    let rightContext = this.Cates[0].smallTypeList;
    this.setData({
      leftMenuList,
      rightContext
    })
  },


  //获取商品分类数据02  从首页跳转来
  async getCates2(index) {
    const result = await requestUtil({
      url: '/bigType/findCategories',
      method: "GET"
    });
    this.Cates = result.message;
    let leftMenuList = this.Cates.map((v) => {
      return v.name;
    })
    let rightContext = this.Cates[index].smallTypeList;
    this.setData({
      leftMenuList,
      rightContext,
      scrollTop: 0, //设置竖向滚动条位置
      currentIndex: index, //左侧菜单当前选中的索引
    })
  },


  //左侧菜单点击切换事件
  handleMenuItemChange(e) {
    const {
      index
    } = e.currentTarget.dataset;
    // const index = e.currentTarget.dataset.index;     当只取一个参数时，使用{}解构
    console.log("index =" + index)
    let rightContext = this.Cates[index].smallTypeList;
    this.setData({
      currentIndex: index,
      rightContext,
      scrollTop: 0
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
    const app = getApp();
    const {index} = app.globalData;
    console.log("index = " + index);

    if (index != -1) { //从首页跳转过来
      // let rightContext = this.Cates[index].smallTypeList;      
      // this.setData({               //getCates方法是异步方法，与onShow同时执行，导致获取不到cates
      //   leftMenuList,
      //   rightContext
      // })
      this.getCates2(index);
      app.globalData.index = -1; //  重置index
    }
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
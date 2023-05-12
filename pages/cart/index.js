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
    address:{},
    baseUrl: '',
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },

  handleChooseAddress(){
    wx.chooseAddress({
      success:(result)=>{
        console.log(result);
        wx.setStorageSync('address', result)
      }
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart')||[];
    this.setData({
      address,
    })
    this.setCart(cart);
  },

  //购物车复选框选中商品
  handleItemChange(e){
    const {id} = e.currentTarget.dataset;      //获取商品id
    let {cart} = this.data;                    //解构cart
    let index = cart.findIndex(v=>v.id===id);  //获取点击商品的索引值
    cart[index].checked = !cart[index].checked;//是否选中布尔值取反
    this.setCart(cart);                        //重新计算加载购物车底部工具栏

  },

  //商品全选事件处理
  handleItemAllCheck(){
    let {cart , allChecked} = this.data;                    //解构cart,allChecked
    allChecked = !allChecked;                               //全选取反
    cart.forEach(v=>v.checked=allChecked);                  //遍历cart，让每一项的checked与allChecked相同
    this.setCart(cart);                                     //重新计算加载购物车底部工具栏
  },

  //商品数量编辑功能
  handleItemNumEdit(e){
    const {id,operation} = e.currentTarget.dataset;      //获取商品id
    console.log(id,operation)
    let {cart} = this.data;                    //解构cart
    let index = cart.findIndex(v=>v.id===id);  //获取点击商品的索引值
    if(cart[index].num===1 && operation===-1){      //当商品数量为1且点击减号时
      wx.showModal({
        title: '系统提示',
        content: '是否确定删除该商品',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index,1);                   //购物车数组从下标index起删除1个元素
            this.setCart(cart);
          }
        }
      })
    }else{
      cart[index].num += operation;
      this.setCart(cart);                                     //重新计算加载购物车底部工具栏
    }
  },

  //点击结算
  handlePay(){
    const user_score = wx.getStorageSync('user_score');
    if(user_score<80){
      wx.showToast({
        title: '您的信用分过低',
        icon: 'error',
        mask: true,
      })
      return ;
    }
    const {totalNum,address} = this.data;
    if(!address){
      wx.showToast({
        title: '请先选择收货地址！',
        icon:'none',
      })
      return;
    }
    if(!totalNum){
      wx.showToast({
        title: '请先选择要下单的商品及数量！',
        icon:'none',
      })
      return;
    }
    wx.navigateTo({
      url: '../pay/index',
    })
  },

  //重新计算购物车页面底部工具栏的各项数据
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{                   //遍历购物车中每一条商品
      if(v.checked){
        totalNum += v.num;              //计算选中的商品总数
        totalPrice += v.price*v.num;    //计算选中的商品总价
      }else{
        allChecked = false;
      }
    })
    allChecked = cart.length!=0?allChecked:false;    //购物车为空时，allChecked为false
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })

    //cart设置到缓存中
    wx.setStorageSync('cart', cart);
  },


})
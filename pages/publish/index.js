//导入request请求工具类
import {
  getBaseUrl,
  getWxLogin,
  requestUtil
} from '../../utils/requestUtil';
import regeneratorRuntime from '../../lib/runtime/runtime';

const upload = require('../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '',
    img_arr: [],
    url: [],
    formdata: '',
    addressName: '请选择您的位置', //显示在页面的地址
    address: '', //地址
    latitude: '', //纬度
    longitude: '', //经度
    name: '', //商品名称
    price: '',
    stock: '',
    chooseMode: '',
    chooseCategory:'',
    typeId: '',
    description: '',
    productId:'',
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
      //继续创建商品
      console.log("创建商品");
      this.createProduct();
    }
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

  //处理创建商品
  async handleCreateProduct() {
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
      this.createProduct();     //获取token后创建商品
    } else {
      console.log("token存在：" + token);
      console.log("创建订单");
      this.createProduct();
    }
  },

  //创建商品
  async createProduct() {
    const name = this.data.name;
    const price = this.data.price;
    const stock = this.data.stock;
    const chooseMode = this.data.chooseMode;
    const typeId = this.data.typeId;
    const description = this.data.description;
    const address = this.data.address;
    const longitude = this.data.longitude;
    const latitude = this.data.latitude;
    const proPic = this.data.img_arr[0];
    let swiperTab=[];
    // for(var i = 0; i<this.data.img_arr.length; i++){
    //   swiperTab[i].image = this.data.img_arr[i];
    //   swiperTab[i].sort = i;
    // }
    //var i = 0;
    this.data.img_arr.forEach(v=>swiperTab.push({
      image: v,
      //sort: v.index,
    }))
    const productParam = {
      name,
      price,
      stock,
      chooseMode,
      typeId,
      description,
      address,
      longitude,
      latitude,
      proPic,
      swiperTab,
    }
    const res = await requestUtil({
      url: "/my/order/createProduct",
      method: "POST",
      data: productParam
    });
    console.log(res);
    // 创建商品成功，将后端返回的productId存到APPdata
    this.setData({
      productId: res.productId    
    })
    //跳转到新创建的商品的详情页
    wx.redirectTo({
      url: "/pages/product_detail/index?id="+this.data.productId,
    })
  },

  //点击发布按钮
  // formSubmit() {
  //   this.uploadFile(0)
  // },

  //上传图片
  // uploadFile: function (index) {
  //   var that = this
  //   //如果所有图片都已经上传完，就不再往下执行
  //   if (index >= that.data.img_arr.length) {
  //     return
  //   }
  //   wx.uploadFile({
  //     url: 'http://10.12.57.113:8080/upload/picture', //自己的Java后台接口地址
  //     filePath: that.data.img_arr[index],
  //     name: 'content',
  //     header: {
  //       "Content-Type": "multipart/form-data",
  //       'accept': 'application/json',
  //       'Authorization': 'okgoodit' //若有token，此处换上你的token，没有的话省略
  //     },
  //     formData: ({ //上传图片所要携带的参数
  //       username: "编程小石头",
  //       password: '2501902696'
  //     }),
  //     success: function (res) {
  //       console.log(`第${index+1}张上传成功`, res)
  //       index++
  //       that.uploadFile(index)
  //     },
  //     fail(res) {
  //       console.log(`第${index+1}张上传失败`, res)
  //     }
  //   })
  // },
  // 选择要上传的图片
  // upimg: function () {
  //   var that = this;
  //   //这里小程序规定最好只能选9张，我这里随便填的3，你也可以自己改
  //   if (this.data.img_arr.length < 3) {
  //     wx.chooseImage({
  //       sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //       sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //       success: function (res) {
  //         var tempFilePaths = res.tempFilePaths
  //         console.log(tempFilePaths);
  //         that.setData({
  //           img_arr: that.data.img_arr.concat(res.tempFilePaths)
  //         });
  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '最多上传三张图片',
  //       icon: 'loading',
  //       duration: 3000
  //     });
  //   }
  // },

  chooseImage: function (e) {
    var that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          that.setData({
            url:that.data.url.concat(tempFilePaths),
          })
          console.log("url成功")
          upload("/shop/uploadImg", tempFilePaths).then(res => {
            let data = JSON.parse(res.data)
            console.log(data)
            // let img_arr = [];
            // img_arr.concat(data.msg);
            that.setData({
              //url: that.data.baseUrl + '/upload/${data.message}',
              img_arr: that.data.img_arr.concat(data.msg)
            })
            console.log("img_arr成功")
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }

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
          addressName: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
      },
      complete(r) {
        console.log(r)
        console.log(222)
      }
    })
  },

  //商品名称双向绑定
  productNameBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      name: value
    })
  },

  //商品价格双向绑定
  priceBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      price: value
    })
  },

  //商品库存双向绑定
  stockBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      stock: value
    })
  },

  //商品描述双向绑定
  descriptionBind: function (e) {
    // 获取输入框当前value值
    let value = e.detail.value
    // 及时更新数据
    this.setData({
      description: value
    })
  },

  //选择商品类别
  handleChooseCategory() {
    var that = this;
    let chooseCategory = '';
    let bigType = wx.getStorageSync('bigType');
    wx.showActionSheet({
      itemList: bigType,
      itemColor: '#007aff',
      success(res) {
        console.log(res.tapIndex);
        chooseCategory = bigType[res.tapIndex];
        that.setData({
          typeId:res.tapIndex+1,
          chooseCategory,
        })
      }
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
          chooseMode
        })
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
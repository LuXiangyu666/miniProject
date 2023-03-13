//定义请求根路径baseUrl
//const baseUrl ="http://localhost:8080";         
const baseUrl ="http://10.12.57.113:8080";          //BUU
//const baseUrl ="http://192.168.43.163:8080";      //手机wifi
//const baseUrl ="http://192.168.16.122:8080";       //晶晶哥家

//同时并发请求的次数
let ajaxTimes = 0;

//返回请求根路径baseUrl
export const getBaseUrl=()=>{
  return baseUrl;
}

//wx.login封装
export const getWxLogin=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:5000,
      success: (res) => {
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  });
}

//用户头像、昵称封装
export const getUserMsg=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:5000,
      success: (res) => {
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  });
}

//后端请求工具类
export const requestUtil = (params)=>{

  var start = new Date().getTime();
  console.log(start);


  ajaxTimes++;          //每次请求时，ajaxTimes加一
  wx.showLoading({
    title: '加载中',
    mask:true,
  })

  //模拟网络延迟加载
  while(true){
    if(new Date().getTime()-start>=1*100) break;
  }

  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url : baseUrl+params.url,
      success:(result)=>{
        resolve(result.data)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTimes--;            //每次请求完成，ajaxTimes减一
        if(ajaxTimes==0){       //避免页面多个请求时出错
          wx.hideLoading();     //关闭加载图标
        }
      }
    })
  });
}
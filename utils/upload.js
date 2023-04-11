// 上传文件网络请求
/**
 * path: 接口地址(相对)
 * tempFilePaths: 上传文件数组 []
 * data:携带的数据对象 {}
 */
module.exports = function(path,tempFilePaths,data){
  return new Promise((resolve,reject) => {
    wx.uploadFile({
      url:  'http://localhost:8080//shop/uploadImg',  //接口地址
      filePath: tempFilePaths[0],
      name: 'file',
      formData: data,
      //这里有一个坑！巨坑！
      //成功返回的data数据是一个字符串，所以要自己转换成JSON数据
      success: resolve, 
      // 请求失败执行fail操作
      fail: () => {
        reject()
        wx.showModal({
          showCancel: false,
          title: '服务器繁忙'
        })
      }
    })
    
  })
}
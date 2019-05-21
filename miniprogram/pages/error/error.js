// miniprogram/pages/error/error.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorType: null,
    footerTopLine: {
      topLine: true // appFooterTemplate 模板的顶部边线显示控制标志
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.warn(options);
    // 获取错误码，若无错误码默认无错
    if (!options.errorType){
      this.setData({ errorType: app.globalData.ErrorType["_100"] });
    } else {
      this.setData({ errorType: app.globalData.ErrorType[options.errorType] });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(()=>{
      if(this.data.errorType.errorCode==='100'){
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  openSettingCallback(res){
    // console.log(res)
    // 修改给定权限后跳转回index页面
    this.setData({ errorType: app.globalData.ErrorType["_100"] });
    // console.log(1, this.data.errorType.errorCode);
  },

  /**
   * 重新登陆
   */
  reLogin(){
    wx.redirectTo({
      url: '/pages/index/index'
    });
  }
})
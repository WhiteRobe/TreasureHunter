// miniprogram/pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    treasure_box_pic_mode: "aspectFit",
    totalSafeHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({ totalSafeHeight: res.windowHeight}); // 设置为全屏显示
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let page = this;
    wx.getSetting({
      success(res) {
        // 获取地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              page.jumpToGameBegin();
            },
            fail() {
              page.jumpToError("_200");
            }
          })
        } else if (res.authSetting['scope.userLocation'] === false){
          page.jumpToError("_200");
        } else {
          page.jumpToGameBegin();
        }
      }
    })
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

  jumpToError(msg){
    //console.error("用户不同意地理位置授权")
    wx.redirectTo({
      url: '/pages/error/error?errorType=' + msg
    });
  },

  jumpToGameBegin(){
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/gamebegin/gamebegin'
      });
    }, 500);
  }
})
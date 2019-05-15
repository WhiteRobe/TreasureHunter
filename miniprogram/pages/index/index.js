// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treasure_box_pic_mode: "aspectFit"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (true) {
    //   setTimeout(() => {
    //     console.log('鉴权通过，跳转到游戏开始页面')
    //     wx.navigateTo({
    //       url: '/pages/gamebegin/gamebegin',
    //     })
    //   }, 1000);
    // } else {
    //   console.error('鉴权不通过，跳转到错误')
    //   wx.navigateTo({
    //     url: '/pages/error/error',
    //   });
    // }

    wx.getSetting({
      success(res) {
        // // 获取用户信息
        // if (!res.authSetting['scope.userInfo']) {
        //   wx.authorize({
        //     scope: 'scope.userInfo',
        //     success() {
        //     },
        //     fail(){

        //     }
        //   })
        // }
        // 获取地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
            },
            fail() {
              console.error("用户不同意地理位置授权")
              wx.navigateTo({
                url: '/pages/error/error',
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
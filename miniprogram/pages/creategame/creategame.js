// miniprogram/pages/creategame/creategame.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    mapHeight: 0,
    buttonDisabled: false, // 按钮禁用，用于异步调用云函数
    game_center: {
      longitude: 108.93984,
      latitude: 34.34127
    },
    showMap: true // 显示地图，用于平滑动画效果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 读取初始化数据
    this.setData({
      openid: options.openid,
      game_center: {
        latitude: options.latitude,
        longitude: options.longitude
      }
    });
    // 确认地图高度
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let custom = wx.getMenuButtonBoundingClientRect();
        let statusBarHeight = custom.bottom + custom.top - res.statusBarHeight;
        let cubarHeightRPX = 100;
        let buttonHeightRPX = 80; // 按钮lg 80rpx + padding 40rpx
        let bottomHeightRPX = 5; // 距离底部10rpx
        let rpx2px = res.screenWidth / 750.0;
        that.setData({
          mapHeight: res.windowHeight - (buttonHeightRPX + bottomHeightRPX + cubarHeightRPX) * rpx2px - statusBarHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  /**
   * 设置埋点
   */
  setPoint() {

  },
  
  /**
   * 发布游戏 
   */
  publish() {

  }
})
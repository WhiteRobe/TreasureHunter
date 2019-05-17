// miniprogram/pages/creategame/creategame.js
// const common = require('../../mod/modules/common.js');
const factory = require('../../mod/modules/factory.js');
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
    markers: [], // 已标记的点 @see ../mod/module/factory.js
    showMap: false, // 显示地图，用于平滑动画效果
    helpModalShow: true, // 帮助内容模态框显示控制标志，同时需要showMap以切换到map
    errorModalShow: null, // 错误模态框显示控制标志
    errorMsg: "错误提示信息"
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
   * 添加一个标记点
   */
  addOneMarker(marker) {
    let that = this;
    this.data.markers.push(marker);
    this.setData({
      markers: that.data.markers
    });
  },

  /**
   * 移除指定id的点
   */
  removeOneMarker(marker_id) {
    let that = this;
    this.data.markers.splice(marker_id, 1);
    this.setData({
      markers: that.data.markers
    });
  },

  /**
   * 设置埋点
   */
  setPoint() {
    this.setData({
      buttonDisabled: true
    });
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        //console.log('纬度', res.latitude, '经度', res.longitude);
        var geo = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        var geoName = "名字";
        var currentMarkId = that.data.markers.length;
        var ext_info = {
          _gamecode: "A1B2C3",
          text: "样例谜题",
          img: "样例图地址",
          condition: [{
            _gamecode: "A1B2C3",
            _geoname: "$_geoname",
          }]
        };
        var geo = factory.buildMarker(currentMarkId, geoName, geo, ext_info);
        console.log(geo);
        that.addOneMarker(geo);
      },
      fail: err => {
        that.handleError(err);
      },
      complete: res => {
        that.setData({
          buttonDisabled: false
        });
      }
    });
  },

  /**
   * 发布游戏 
   */
  publish() {
    this.setData({
      buttonDisabled: true
    });

    console.log("发布游戏");
  },

  /**
   *隐藏帮助内容模态框
   */
  hideHelpModalShow() {
    this.setData({
      helpModalShow: null,
      showMap: true
    });
  },

  /**
   * 隐藏底部错误提示信息框
   */
  hideBottomErrorModel() {
    this.setData({
      errorModalShow: null
    });
  },

  /**
   * 处理异步异常
   */
  handleError(err) {
    let errorDismissDelay = 3000; // 错误提示框自动关闭的计时事件
    if (err.errMsg === "getLocation:fail:timeout") {
      this.setData({
        errorModalShow: true,
        errorMsg: "启动游戏失败：获取地理位置信息超时 QAQ"
      });
    } else {
      // 未知启动错误
      this.setData({
        errorModalShow: true,
        errorMsg: "启动游戏失败：" + err.errMsg
      });
    }

    // $errorDismissDelay 毫秒后自动关闭
    setTimeout(() => {
      this.setData({
        errorModalShow: null
      })
    }, errorDismissDelay);
  }
})
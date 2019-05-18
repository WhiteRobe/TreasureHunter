// miniprogram/pages/ingame/ingame.js
const common = require('../../mod/modules/common.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createrOpenid:"",
    myOpenid:"",
    gamecode:"null",
    gamemarkers:null,
    mymarkers:[],
    mapHeight: 0,
    buttonDisabled: false, // 按钮禁用，用于异步调用云函数
    game_center:{
      longitude: 108.93984,
      latitude: 34.34127
    },
    showMap: true, // 显示地图，用于平滑动画效果
    packageName: null, // 背包抽屉
    buttonDisabled: false, // 按钮禁用方案
    errorModalShow: null, // 错误模态框显示控制标志
    errorMsg: "错误提示信息"
  },

  /**
   * 玩家背包的展开与收起
   */
  showPackage(e){
    this.setData({
      packageName: e.currentTarget.dataset.target,
      showMap: false
    });
  },

  hidePackage(e) {
    this.setData({
      packageName: null
    });
    setTimeout(() => { this.setData({ showMap: true });}, 450); // 0.4~0.5秒的抽屉动画之后显示地图
  },

  /**
   * 尝试挖掘
   */
  tryDig(){
    this.setData({
      buttonDisabled: true
    });
  },

  /**
   * 地图点击事件
   */
  mapclicked(e){
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let custom = wx.getMenuButtonBoundingClientRect();
        let statusBarHeight = custom.bottom + custom.top - res.statusBarHeight;
        //console.log(res.windowHeight - statusBarHeight);
        
        let cubarHeightRPX = 100;
        let buttonHeightRPX = 80; // 按钮lg 80rpx + padding 40rpx
        let bottomHeightRPX = 5; // 距离底部10rpx
        let rpx2px = res.screenWidth / 750.0;

        that.setData({ mapHeight: res.windowHeight - (buttonHeightRPX + bottomHeightRPX + cubarHeightRPX) * rpx2px - statusBarHeight}); 
      }
    });

    // console.log(app.globalData.currentGameroom)
    // 载入游戏数据
    this.setData({
      gamecode: options.gamecode,
      game_center: {
        latitude: app.globalData.currentGameroom._geo.latitude,
        longitude: app.globalData.currentGameroom._geo.longitude
      },
      gamemarkers: app.globalData.currentGameroom._markers,
      createrOpenid: app.globalData.currentGameroom._openid,
      myOpenid: app.globalData.myOpenid,
    });

    // 如果是自己创建的房间，直接认为已通关
    if (this.data.createrOpenid===this.data.myOpenid){
      this.setData({
        mymarkers: app.globalData.currentGameroom._markers,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onShareAppMessage: function () {}

})
// pages/gamebegin/gamebegin
const common = require('../../mod/modules/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageAddress: '../../resources/images/bg.jpg',
    swiperList: [{
      id: 0,
      type: 'image',
      url: '../../resources/images/help1.png'
    }, {
      id: 1,
      type: 'image',
        url: '../../resources/images/help2.png'
    }, {
      id: 2,
      type: 'image',
        url: '../../resources/images/help3.png'
    }],
    toggleDelay: false, // 按钮上浮效果
    buttonDisabled: false // 按钮禁用方案
  },

  /**
   * 创建一局游戏
   */
  createGame: function() {
    this.setData({ buttonDisabled: true });
    //获取用户ID
    common.getOpenid()
      .then(res => {
        let openid = res;
        console.log(openid);
        common.getLocation()
          .then(res => {
            console.log('纬度', res.latitude, '经度', res.longitude)
            let latitude = res.latitude;
            let longitude = res.longitude;
            console.log('纬度', latitude, '经度', longitude);
            wx.navigateTo({
              url: '/pages/creategame/creategame?openid=' + openid + '&latitude=' + latitude + '&longitude=' + longitude
            })
          })
      })
      .catch(err => {
        console.log(err)
      })

  },
  /**
   * 加入一局游戏
   */
  joinGame: function() {
    this.setData({ buttonDisabled: true});
    //获取用户ID
    common.getOpenid()
      .then(res => {
        let openid = res;
        console.log(openid);
        common.getLocation()
          .then(res => {
            console.log('纬度', res.latitude, '经度', res.longitude)
            let latitude = res.latitude;
            let longitude = res.longitude;
            console.log('纬度', latitude, '经度', longitude);
            wx.navigateTo({
              url: '/pages/ingame/ingame?openid=' + openid + '&latitude=' + latitude + '&longitude=' + longitude
            })
          })
      })
      .catch(err => {
        console.log(err)
      })
  },

  startAnimation(){
    var that = this;
    setTimeout(function () {
      //console.log(that.data.toggleDelay);
      that.setData({
        toggleDelay: true
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.startAnimation();
    this.setData({buttonDisabled: false }); // 进入此页面后按钮处于可用状态
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
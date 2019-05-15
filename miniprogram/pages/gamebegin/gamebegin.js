// pages/gamebegin/gamebegin
const common = require('../../mod/modules/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageAddress: '../../resources/images/pikaqiu.jpg',
  },

  /**
   * 创建一局游戏
   */
  createGame: function() {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onShareAppMessage: function() {

  }
})
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
    buttonDisabled: false, // 按钮禁用方案
    warnModalShow: null, // 版本过低的警告模态框
    errorModalShow: null, // 错误模态框显示控制标志
    errorMsg: "错误提示信息"
  },

  /**
   * 创建一局游戏
   */
  createGame: function() {
    this.setData({
      buttonDisabled: true
    });
    let that = this;
    //获取用户ID
    common.getOpenid()
      .then(res => {
        let openid = res;
        common.getLocation()
          .then(res => {
            let latitude = res.latitude;
            let longitude = res.longitude;
            console.log('纬度', latitude, '经度', longitude);
            wx.navigateTo({
              url: '/pages/creategame/creategame?openid=' + openid + '&latitude=' + latitude + '&longitude=' + longitude
            });
          })
          .catch(err => {
            console.error(err);
            that.setData({
              buttonDisabled: false
            });
            that.handleError(err);
          });
      })
      .catch(err => {
        console.error(err);
        that.setData({
          buttonDisabled: false
        });
        that.handleError(err);
      });
  },

  /**
   * 加入一局游戏
   */
  joinGame: function() {
    this.setData({
      buttonDisabled: true
    });
    //获取用户ID
    // common.getOpenid()
    //   .then(res => {
    //     let openid = res;
    //     console.log(openid);
    //     common.getLocation()
    //       .then(res => {
    //         console.log('纬度', res.latitude, '经度', res.longitude)
    //         let latitude = res.latitude;
    //         let longitude = res.longitude;
    //         console.log('纬度', latitude, '经度', longitude);
    //         wx.navigateTo({
    //           url: '/pages/ingame/ingame?openid=' + openid + '&latitude=' + latitude + '&longitude=' + longitude
    //         })
    //       })
    //   })
    //   .catch(err => {
    //     this.setData({ buttonDisabled: false });
    //     console.log(err)
    //   })
    wx.navigateTo({
      url: '/pages/ingame/ingame'
    })
  },

  /**
   * 隐藏版本过低的警告模态框
   */
  hideWarnModal() {
    this.setData({
      warnModalShow: null
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

  startAnimation() {
    var that = this;
    setTimeout(function() {
      //console.log(that.data.toggleDelay);
      that.setData({
        toggleDelay: true
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        //console.log('sdk', res.SDKVersion); console.log('version', res.version);
        let sdk_cmp = that.compareVersion(res.SDKVersion, '2.7.0');
        let version_cmp = that.compareVersion(res.version, '6.6.3');
        let min_sdk_cmp = that.compareVersion(res.SDKVersion, '2.4.0');
        if (min_sdk_cmp < 0) {
          // 无法正常渲染视图，直接跳到错误页面
          wx.redirectTo({
            url: '/pages/error/error?errorType=_500'
          });
        } else if (sdk_cmp < 0 || version_cmp < 0) {
          // 弹出版本太低的模态框
          that.setData({
            warnModalShow: true
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.startAnimation();
    this.setData({
      buttonDisabled: false
    }); // 进入此页面后按钮处于可用状态
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
  onShareAppMessage: function() {},

  /**
   * 比较系统版本
   */
  compareVersion: function(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
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
    }
    else {
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
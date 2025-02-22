// pages/gamebegin/gamebegin
const common = require('../../mod/modules/common.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: '../../resources/images/help1.jpg'
    }, {
      id: 1,
      type: 'image',
      url: '../../resources/images/help2.jpg'
    }],
    toggleDelay: false, // 按钮上浮动画效果的延迟控制标志
    buttonDisabled: true, // 按钮禁用方案(含载入框)
    warnModalShow: null, // 版本过低的警告模态框
    errorModalShow: null, // 错误模态框显示控制标志
    errorMsg: "错误提示信息",
    gamecodeInputModalShow: null, // 游戏邀请码输入框
    gamecode:[], // 游戏邀请码
    alradyInputLength: 0, // 已输入的邀请码长度
    tempInputString:"",
    currentVersion: "v1.0.0", // 当前游戏版本 @See app.js-globalData.currentVersion
    easterEggClickCounter: 0, // 彩蛋点击计数条 @See versionBarClicked(当前版本)
    footerTopLine: {
      topLine: true  // appFooterTemplate 模板的顶部边线显示控制标志
    }
  },

  /**
   * 创建一局游戏
   */
  createGame: function() {
    this.setData({
      buttonDisabled: true
    });
    wx.navigateTo({
      url: '/pages/creategame/creategame?openid=' + app.globalData.myOpenid + 
        '&latitude=' + app.globalData.myGeo.latitude + 
        '&longitude=' + app.globalData.myGeo.longitude
    });
    this.setData({
      buttonDisabled: false
    });
  },

  /**
   * 通过邀请码搜寻一场游戏
   */
  searchGameByCode(){
    let that = this;
    let gamecode = this.data.gamecode.join().replace(/,/g, ''); // 获得邀请码
    this.setData({
      gamecodeInputModalShow: null,
      hiddenInputOnFocus: false,
      buttonDisabled:true
    });
    const db = wx.cloud.database({
      env: app.globalData.database_env
    });
    const collection = db.collection('c_gamerooms');
    collection.where({
      _gamecode: gamecode
    }).get()
    .then(res => {
      let gameinfos = res.data;
      if (gameinfos.length == 0){ // 没有找到游戏
        that.handleError({ errMsg:"no game founded"});
      } else {
        app.globalData.currentGameroom = gameinfos[0]; // 为了避免多次查询，把游戏数据存到本地全局变量中
        wx.showToast({
          title: '正在加入活动', // '活动' 字眼替代 '游戏'
          icon: 'loading',
          mask: true,
          duration: 500
        })
        wx.navigateTo({
          url: '/pages/ingame/ingame?gamecode=' + gamecode
        });
      } 
      this.setData({
        buttonDisabled: false
      });
    })
    .catch(err =>{
      console.error(err);
      that.handleError(err);
      this.setData({
        buttonDisabled: false
      });
    });
  },


  /**
   * 绑定游戏邀请码输入框
   */
  inputGamecodeCallback(e){
    let that = this;
    this.data.gamecode = [];
    let values = e.detail.value.split('');
    for (var i = 0; i < values.length; i++) {
      this.data.gamecode.push(values[i].toUpperCase()); // 自动转为全大写
    }
    this.data.alradyInputLength = this.data.gamecode.length;
    this.setData({
      gamecode: that.data.gamecode,
      alradyInputLength: that.data.alradyInputLength
    });
    // 输入完6位后自动触发
    if (this.data.alradyInputLength == 6){
      setTimeout(() => { that.searchGameByCode();}, 200); // 延迟0.2秒以获得较好的体验
    }
  },

  /**
   * 隐藏的输入框获取焦点
   */
  setHiddenInputOnFocus(){
    this.setData({
      hiddenInputOnFocus: true
    });
  },

  /**
   * 隐藏的输入框隐藏焦点
   */
  setHiddenInputNotOnFocus(){
    this.setData({
      hiddenInputOnFocus: false
    });
  },

  /**
   * 加入一局游戏
   */
  joinGame: function() {
    this.setData({
      //buttonDisabled: true,
      gamecode:[],
      alradyInputLength:0,
      gamecodeInputModalShow: true,
      tempInputString:"",
      hiddenInputOnFocus: true
    });
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
   * 隐藏游戏邀请码输入框
   */
  hideGamecodeInputModal(){
    this.setData({
      gamecodeInputModalShow: null,
      hiddenInputOnFocus:false
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
    this.setData({ currentVersion: app.globalData.currentVersion});
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

    //获取用户ID和位置
    common.getOpenid(app.globalData.cloudfunction_env)
      .then(res => {
        let openid = res;
        common.getLocation()
          .then( res => {
            app.globalData.myOpenid = openid;
            app.globalData.myGeo.latitude = res.latitude;
            app.globalData.myGeo.longitude = res.longitude;
            console.log('游戏参与者的openid', openid, '游戏参与者的纬度', res.latitude, '游戏参与者的经度', res.longitude);
            that.setData({
              buttonDisabled: false
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
  onShareAppMessage: function() {
    return {
      title: '喜欢户外解谜?来《校园探宝》吧!',
      path: '/pages/index/index'
    }
  },

  /**
   * 点击版本条之后的操作
   */
  versionBarClicked(){
    // 点击五次之后跳转到error页面
    if (this.data.easterEggClickCounter==4){
      this.jumpToErrorWithNavigateTo('_000'); // 测试操作跳转
    } else {
      let newCouneter = this.data.easterEggClickCounter+1;
      this.setData({ easterEggClickCounter: newCouneter});
    }
  },

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

  openSettingCallback(res){
    wx.reLaunch({
      url: '/pages/index/index?type=mannulModifiedAuth'
    });
  },

  /**
   * 跳转到错误页面(有返回的jump)
   * msg: 错误码 @see app.js.globalData.ErrorType
   */
  jumpToErrorWithNavigateTo(msg) {
    wx.navigateTo({
      url: '/pages/error/error?errorType=' + msg
    });
  },

  /**
   * 处理异步异常
   */
  handleError(err) {
    let errorDismissDelay = 5000; // 错误提示框自动关闭的计时事件
    if (err.errMsg === "getLocation:fail:timeout") {
      this.setData({
        errorModalShow: true,
        errorMsg: "启动活动失败：获取地理位置信息超时 QAQ"
      });
    }
    else if (err.errMsg.indexOf("collection") > -1) {
      this.setData({
        errorModalShow: true,
        errorMsg: "网络不通畅：获取活动信息超时，请稍后重试 QAQ" // 数据库问题
      });
    }
    else if (err.errMsg.indexOf("getLocation:fail")>-1) {
      this.setData({
        errorModalShow: true,
        errorMsg: "启动活动失败：请保证您的地理信息能够被获取"
      });
    }
    else if (err.errMsg.indexOf("connect ETIMEDOUT")>-1) {
      this.setData({
        errorModalShow: true,
        errorMsg: "网络不通畅：获取活动信息超时，请稍后重试 QAQ"
      });
    }
    else if (err.errMsg === "no game founded"){
      this.setData({
        errorModalShow: true,
        errorMsg: "没有找到相应的活动 QAQ"
      });
    }
    else {
      // 未知启动错误
      const logger = wx.getLogManager({ level: 1 });
      logger.debug('【debug log】', 'gamebegin.js', "" + new Date(), err);
      this.setData({
        errorModalShow: true,
        errorMsg: "启动活动失败：*请确保网络连接通畅" // + err.errMsg
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
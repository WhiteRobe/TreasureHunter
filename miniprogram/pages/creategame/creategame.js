// miniprogram/pages/creategame/creategame.js
const common = require('../../mod/modules/common.js');
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
    errorMsg: "错误提示信息",

    markerForInputModal: {
      id:-1,
      name: "",
      longitude: "",
      latitude: "",
      text: "",
      img: "",
      condition: []
    }, // 进行操作的埋点之输入数据 @see cleanMarkerForInputModalValue()
    markerInputModalShow: null, // 进行操作的埋点模态框显示控制标志
    markerInputModalShowWithType: 'new', // 进行操作的模态框类型 ： new | edit
    selectedMarkerInputModalTabId: 0 // 0 for text; 1 for pictur
  },

  /**
   * 初始化操作埋点的值，应当双向绑定 this.data.markerForInputModal
   */
  cleanMarkerForInputModalValue() {
    this.data.markerForInputModal.id = -1;
    this.data.markerForInputModal.name = "";
    this.data.markerForInputModal.longitude = "";
    this.data.markerForInputModal.latitude = "";
    this.data.markerForInputModal.text = "";
    this.data.markerForInputModal.img = "";
    this.data.markerForInputModal.condition = [];
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
    this.data.markers.splice(marker_id, 1); // 删除指定id的marker
    for (var i = marker_id; i < this.data.markers.length; i++) { // 修正之后的marker的id
      this.data.markers[marker_id].id = this.data.markers[marker_id].id - 1;
    }
    this.setData({
      markers: that.data.markers
    });
  },

  /**
   * 点击气泡或标记点
   */
  markerClicked(res) {
    let marker_id = res.markerId;
    let marker = this.data.markers[parseInt(marker_id)]; // 当期所点击的标记点
    this.setData({
      showMap: false
    }); // 隐藏地图
    // console.log(marker);

    this.data.markerForInputModal.id = marker.id;
    this.data.markerForInputModal.name = marker.callout.content;
    this.data.markerForInputModal.longitude = marker.longitude;
    this.data.markerForInputModal.latitude = marker.latitude;
    this.data.markerForInputModal.text = marker.extend.text;
    this.data.markerForInputModal.img = marker.extend.img;
    this.data.markerForInputModal.condition = marker.extend.condition;

    this.onMarkerInputModalShow('edit');
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
        this.data.markerForInputModal.longitude = res.longitude;
        this.data.markerForInputModal.latitude = res.latitude;

        that.onMarkerInputModalShow('new');
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
   * 埋点输入框唤醒
   * type : 'new' | 'edit'
   */
  onMarkerInputModalShow(type) {
    let that = this;
    this.setData({
      markerInputModalShowWithType: type,
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: true,
      showMap: false
    });
  },

  onMarkerInputModalCancel() {
    this.cleanMarkerForInputModalValue();
    let that = this;
    this.setData({
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });
  },

  onMarkerInputModalConfirm() {
    // that.addOneMarker(geo);
    let that = this;
    // console.log(this.data.markerForInputModal);
    // 这里缺个正则检验
    this.setData({
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });
    // 向数据中添加新点
    let extInfo = {
      text: that.data.markerForInputModal.text,
      img: that.data.markerForInputModal.img,
      condition: [] // 尚待完善
    }
    let marker = factory.buildMarker(this.data.markers.length, this.data.markerForInputModal.name, {
      latitude: that.data.markerForInputModal.latitude,
      longitude: that.data.markerForInputModal.longitude
    }, extInfo);
    //console.log(marker);
    this.addOneMarker(marker);
    this.cleanMarkerForInputModalValue();
  },

  onMarkerInputModalDelete() {
    // 移除一个点
    let markerId = this.data.markerForInputModal.id;
    this.removeOneMarker(markerId);

    this.cleanMarkerForInputModalValue();
    let that = this;
    this.setData({
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });
  },

  onMarkerInputModalEdit() {
    let that = this;
    let markerId = this.data.markerForInputModal.id;
    let marker = this.data.markers[markerId];

    // 能够进行修改的项
    marker.callout.content = that.data.markerForInputModal.name;
    marker.extend.text = that.data.markerForInputModal.text;
    marker.extend.img = that.data.markerForInputModal.img;
    marker.extend.condition = [] // 尚待完善;

    this.data.markers[markerId] = marker;

    // 修改数据
    this.setData({
      markers: that.data.markers,
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });
    this.cleanMarkerForInputModalValue();
  },

  /**
   * 绑定埋点名的输入事件
   */
  markerNameInputCallback(e) {
    let that = this;
    this.data.markerForInputModal.name = e.detail.value;
    this.setData({
      markerForInputModal: that.data.markerForInputModal
    });
  },

  /**
   * 绑定埋点谜题文字部分的输入事件
   */
  markerTextInputCallback(e) {
    let that = this;
    this.data.markerForInputModal.text = e.detail.value;
    this.setData({
      markerForInputModal: that.data.markerForInputModal
    });
  },

  /**
   * 导航标签栏切换
   */
  markerInputModalTabSelect(e) {
    this.setData({
      selectedMarkerInputModalTabId: e.currentTarget.dataset.id // 0 for text; 1 for pictur
    })
  },

  ChooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 从相册或相机选择
      success: (res) => {
        //console.log(res.tempFilePaths);
        that.data.markerForInputModal.img = res.tempFilePaths[0];
        that.setData({
          markerForInputModal: that.data.markerForInputModal
        });
      }
    });
  },

  ViewImage(e) {
    let that = this;
    wx.previewImage({
      urls: [that.data.markerForInputModal.img],
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    let that = this;
    this.data.markerForInputModal.img = "";
    this.setData({
      markerForInputModal: that.data.markerForInputModal
    });
  },

  /**
   * 发布游戏 
   */
  publish() {
    let that = this;
    this.setData({
      buttonDisabled: true,
      showMap: false
    });

    // 从小程序端直接插入数据库
    const db = wx.cloud.database({
      env: 'xdu-treasure-hunter'
    });
    const c_gamerooms = db.collection('c_gamerooms');
    let gamecode = common.getRamdon4Code(); // 游戏序列码
    let starttime = db.serverDate();
    let lasttime = 7; // 目前默认一周
    c_gamerooms.add({
      data: {
        _gamecode: gamecode,
        _geo: db.Geo.Point(parseFloat(that.data.game_center.longitude), parseFloat(that.data.game_center.latitude)),
        _starttime: starttime,
        _lasttime: lasttime,
        _markers: that.data.markers
      },
      success(res) {
        //console.log(res);
        // 提示发布游戏成功
        wx.showModal({
          title:"游戏发布成功",
          content: '游戏生成时间：' + new Date().format("yyyy-MM-dd") + "，将持续" + lasttime + 
            "天，邀请码为【"+gamecode+"】，您可以分享给您的朋友。",
          showCancel: false,
          confirmText: "我已了解",
          confirmColor: "#0081ff",
          complete:()=>{
            // 设置剪贴板消息
            wx.setClipboardData({
              data: "我在微信小程序【校园探宝】，创建了一场户外解谜游戏，游戏邀请码【" + gamecode + "】，快来加入吧！"
            });
          }
        });

        // 延时跳转到首页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }, 10000);
      },
      fail(err){
        //console.error(err);
        that.handleError(err);
      },
      complete(res){
        that.setData({
          buttonDisabled: false,
          showMap: true
        });
      }
    })
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
  hideBottomErrorModal() {
    this.setData({
      errorModalShow: null
    });
  },

  /**
   * 处理异步异常
   */
  handleError(err) {
    let errorDismissDelay = 3500; // 错误提示框自动关闭的计时事件
    if (err.errMsg === "getLocation:fail:timeout") {
      this.setData({
        errorModalShow: true,
        errorMsg: "启动游戏失败：获取地理位置信息超时 QAQ"
      });
    }
    else if (err.errMsg.indexOf("FailedOperation.Insert" !== -1) ){
      // 实际上是重复的 gamecode 被插入了，简单处理一下
      this.setData({
        errorModalShow: true,
        errorMsg: "启动游戏失败：服务器繁忙请稍后再试"
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
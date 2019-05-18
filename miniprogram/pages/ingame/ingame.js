// miniprogram/pages/ingame/ingame.js
const common = require('../../mod/modules/common.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minLimitDis: 25, // 有效挖掘距离(米)
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
    packageShow: false, // 背包抽屉
    buttonDisabled: false, // 按钮禁用方案
    errorModalShow: null, // 错误模态框显示控制标志
    errorMsg: "错误提示信息",

    markerForShowModal:{
      id: -1,
      name: "",
      longitude: "",
      latitude: "",
      text: "",
      img: "",
      condition: []
    },
    markerShowModalShow: false,  // 进行显示的埋点模态框显示控制标志
    selectedMarkerShowModalTabId: 0 // 0 for text; 1 for pictur
  },

  /**
   * 初始化显示埋点的值，应当双向绑定 this.data.markerForShowModal
   */
  cleanmarkerForShowModalValue() {
    this.data.markerForShowModal.id = -1;
    this.data.markerForShowModal.name = "";
    this.data.markerForShowModal.longitude = "";
    this.data.markerForShowModal.latitude = "";
    this.data.markerForShowModal.text = "";
    this.data.markerForShowModal.img = "";
    this.data.markerForShowModal.condition = [];
  },

  /**
   * 玩家背包的展开与收起
   */
  showPackage(e){
    this.setData({
      packageShow: true,
      showMap: false
    });
  },

  hidePackage(e) {
    this.setData({
      packageShow: false
    });
    setTimeout(() => { this.setData({ showMap: true });}, 450); // 0.4~0.5秒的抽屉动画之后显示地图
  },

  /**
   * 尝试挖掘
   */
  tryDig(){
    let that = this;
    this.setData({
      buttonDisabled: true,
      showMap: false
    });
    let currentGeo = {
      longitude:0,
      latitude:0
    };
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        // console.log('挖掘者当前纬度', res.latitude, '挖掘者当前经度', res.longitude);
        currentGeo.longitude = res.longitude;
        currentGeo.latitude = res.latitude;
        let markerToDig = that.findNearestDiggableMarker(currentGeo); // 计算得到一个可被挖掘的点
        if(markerToDig !== null){
          console.log("找到一个可供挖掘的点", markerToDig);
          // 更新 我的线索
          that.data.mymarkers.push(markerToDig);
          that.setData({
            mymarkers: that.data.mymarkers
          });
          wx.showToast({
            title: '获得新的线索',
            icon: 'none',
            image: "../../resources/images/find_treasure.png",
            mask: true,
            duration: 2500 // 2.5秒冷却以限制挖掘频率
          });
        } else {
          // 没有发现任何可用线索
          wx.showToast({
            title: '一无所获',
            icon: 'none',
            image: "../../resources/images/find_nothing.png",
            mask: true,
            duration: 3000 // 3秒冷却以限制挖掘频率
          });
        }
      },
      fail: err => {
        that.handleError(err);
      },
      complete: res => {
        that.setData({
          buttonDisabled: false,
          showMap: true
        });
      }
    });
  },

  /**
   * 找到最近的可挖掘点，返回一个marker
   */
  findNearestDiggableMarker(currentGeo){
    for(var i = 0;i<this.data.gamemarkers.length;i++){
      let marker = this.data.gamemarkers[i]; // 当前尝试挖掘的点
      let conditions = marker.extend.condition; // 挖掘这个点的前置条件

      if(this.data.mymarkers.indexOf(marker)>-1){ // 这个线索已经拥有
        // console.log("线索已拥有", marker);
        continue;
      }

      let fitCount = 0; // 满足所有挖掘条件的标志
      for (var j = 0; j < conditions.length; j++){
        for(var k = 0; k < this.data.mymarkers; k++){
          let name = this.data.mymarkers[k].callout.centent; // 拥有线索(埋点)的名字
          if(conditions[j] === name){ // 匹配了一个前置条件
            fitCount++;
            break;
          }
        }
      }
      if(fitCount != conditions.length){
        continue;  // 这个点不满足挖掘条件就跳过
      }

      // 满足挖掘条件就计算距离
      let markerGeo = {
        longitude: marker.longitude,
        latitude: marker.latitude
      };
      let dis = common.getDistanceBetween2Geo(currentGeo, markerGeo); // 计算距离(米)
      console.log("距离目标点", marker, "距离为", dis);
      if(dis <= this.data.minLimitDis){ // 该点被挖掘
        return marker;
      }
    }
    return null; // 没有任何一个点可以被挖掘
  },

  /**
   * 地图点击事件
   */
  mapclicked(e){
    // console.log(e);
  },

  /**
   * 线索点被点击
   */
  markerClicked(res) {
    let marker_id = res.markerId;
    let marker = this.data.mymarkers[parseInt(marker_id)]; // 当期所点击的标记点
    this.setData({
      showMap: false
    }); // 隐藏地图
    // console.log(marker);

    this.data.markerForShowModal.id = marker.id;
    this.data.markerForShowModal.name = marker.callout.content;
    this.data.markerForShowModal.longitude = marker.longitude;
    this.data.markerForShowModal.latitude = marker.latitude;
    this.data.markerForShowModal.text = marker.extend.text;
    this.data.markerForShowModal.img = marker.extend.img;
    this.data.markerForShowModal.condition = marker.extend.condition;

    this.onMarkerShowModalShow();
  },

  /**
   * 显示数据的模态框的相关操作
   */
  onMarkerShowModalShow(){
    let that = this;
    this.setData({
      markerForShowModal: that.data.markerForShowModal,
      markerShowModalShow: true,
      showMap: false
    });
  },

  onMarkerShowModalClose(){
    this.cleanmarkerForShowModalValue();
    let that = this;
    this.setData({
      markerForShowModal: that.data.markerForShowModal,
      markerShowModalShow: false,
      showMap: true,
      selectedMarkerShowModalTabId: 0
    });
  },

  /**
   * 文字/图片 导航标签栏切换
   */
  markerShowModalTabSelect(e){
    this.setData({
      selectedMarkerShowModalTabId: e.currentTarget.dataset.id // 0 for text; 1 for pictur
    })
  },

  /**
   * 线索背包被点击
   */
  markerItemClicked(e){
    // 线索背包被点击的物品的索引id
    let id = e.currentTarget.dataset.id;
    this.markerClicked({ markerId: id});
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

    // 初始化地图上可标注的点(已拥有的线索)
    //if (this.data.createrOpenid===this.data.myOpenid){ // 暂时注释
    if (false) {// 如果是自己创建的房间，直接认为已通关
      this.setData({
        mymarkers: app.globalData.currentGameroom._markers,
      });
    } else{
      // 把第一个点放入背包
      this.data.mymarkers.push(this.data.gamemarkers[0]);
      this.setData({
        mymarkers: that.data.mymarkers
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
  onShareAppMessage: function () {},

  ViewImage(e) {
    let that = this;
    wx.previewImage({
      urls: [that.data.markerForShowModal.img],
      current: e.currentTarget.dataset.url
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
    else if (err.errMsg === "timeout") {
      this.setData({
        errorModalShow: true,
        errorMsg: "网络不通畅：请求超时 QAQ"
      });
    }
    else if (err.errMsg.indexOf("FailedOperation.Insert" !== -1)) {
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
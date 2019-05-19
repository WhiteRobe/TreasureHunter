// miniprogram/pages/ingame/ingame.js
const common = require('../../mod/modules/common.js');
const factory = require('../../mod/modules/factory.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameWinned: false, // 是否已经赢得胜利
    minLimitDis: 50, // 有效挖掘距离(米)
    createrOpenid: "",
    myOpenid: "",
    packageId: "", // 数据库上的索引ID[_id], 用于doc
     gamecode: "null",
    gamemarkers: null,
    mymarkers: [],
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

  // 拷贝通关证明码
  copyTongGuanMa(){
    let that = this;
    wx.setClipboardData({
      data: factory.buildTongGuanMa(that.data.myOpenid, that.data.gamecode)
    });
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
          wx.showLoading({title: '服务器同步中'});
          // 更新数据库
          const db = wx.cloud.database({
            env: app.globalData.database_env
          });
          const collection = db.collection('c_packages');
          collection.doc(that.data.packageId).set({
            data:{
              _gamecode: that.data.gamecode,
              _package: that.data.mymarkers
            },
            success: res => {
              console.log("发送背包信息到数据库", res);
              let isAddNewData = res.stats.created > 0;
              wx.showToast({
                title: '获得新的线索',
                icon: 'none',
                image: "../../resources/images/find_treasure.png",
                mask: true,
                duration: 2500 // 2.5秒冷却以限制挖掘频率
              });
              // 判断是否赢得胜利
              if (that.judgeIsWin()) { // 如果挖到了最后一个点
                that.setData({ gameWinned: true });
              }
            },
            fail: err => {
              console.error(err)
              that.data.mymarkers.pop(); // 数据库写入失败 本地移除该点
              that.handleError(err);
            },
            complete: res => {
              console.log(res);
              wx.hideLoading();
              that.setData({ // 确认本地的背包状态
                mymarkers: that.data.mymarkers
              });
            }
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
   * 判断是否取得胜利
   */
  judgeIsWin(){
    let lastOneMarker = this.data.gamemarkers[this.data.gamemarkers.length - 1];
    for (var i = 0; i < this.data.mymarkers.length; i++){
      if (this.data.mymarkers[i].callout.content === lastOneMarker.callout.content){
        return true;
      }
    }
    return false;
  },

  /**
   * 找到最近的可挖掘点，返回一个marker
   */
  findNearestDiggableMarker(currentGeo){
    for(var i = 0;i<this.data.gamemarkers.length;i++){
      let marker = this.data.gamemarkers[i]; // 当前尝试挖掘的点
      let conditions = marker.extend.condition; // 挖掘这个点的前置条件

      let alreadyHave = false; // 排查已拥有的线索
      for (var p = 0; p < this.data.mymarkers.length; p++){
        if (marker.callout.content === this.data.mymarkers[p].callout.content){
          alreadyHave = true;
          break;
        }
      }
      if (alreadyHave){ // 这个线索已经拥有
        console.log("线索已拥有", marker);
        continue;
      }

      let fitCount = 0; // 满足所有挖掘条件的标志
      for (var j = 0; j < conditions.length; j++){
        for (var k = 0; k < this.data.mymarkers.length; k++){
          let name = this.data.mymarkers[k].callout.content; // 拥有线索(埋点)的名字
          if(conditions[j] === name){ // 匹配了一个前置条件
            fitCount++;
            break;
          }
        }
      }
      if(fitCount != conditions.length){
        console.log("前置条件不满足", conditions);
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
      showMap: that.data.packageShow? false: true,
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
        let buttonHeightRPX = 80 + 20; // 按钮lg 80rpx + .btn-group padding 20rpx
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

    wx.showLoading({ title: '获取数据中', mask: true }); // 载入数据前的遮罩框
    // 初始化地图上可标注的点(已拥有的线索)
    //if (this.data.createrOpenid===this.data.myOpenid){ // 暂时注释
    if (false) {// 如果是自己创建的房间，直接认为已通关
      this.setData({
        mymarkers: app.globalData.currentGameroom._markers,
      });
    } else { // 否则初始化背包项目
      const db = wx.cloud.database({
        env: app.globalData.database_env
      });
      const collection = db.collection('c_packages');
      collection.where({
        _openid: app.globalData.myOpenid,
        _gamecode: that.data.gamecode
      }).get().then( res => {
        let hasMemory = res.data.length > 0;
        console.log("从数据库请求背包数据", res);
        if (hasMemory){
          // 找到记录则读取记录
          that.setData({
            mymarkers: res.data[0]._package,
            packageId: res.data[0]._id
          });
          if (that.judgeIsWin()) { // 如果已经挖到了最后一个点
            that.setData({ gameWinned: true });
          }
          wx.hideLoading();
        } else {
          // 没有找到记录则创建记录
          // 把第一个点放入背包
          that.data.mymarkers = [];
          that.data.mymarkers.push(that.data.gamemarkers[0]);
          that.setData({
            mymarkers: that.data.mymarkers
          });
          // 尝试从服务器创建一个背包
          collection.add({
            data:{
              _gamecode: that.data.gamecode,
              _package: that.data.mymarkers
            },
            success: res => { 
              wx.hideLoading();
              that.setData({ // 绑定服务器上的数据
                packageId: res._id
              });
            },
            fail: err => {
              wx.hideLoading();
              console.error("初始化背包写入数据库失败", err);
              that.jumpToError("_400");
            }
          });
        }
      }).catch( err =>{
        // that.handleError(err);
        wx.hideLoading();
        console.error("从c_packages查询数据失败", err);
        that.jumpToError("_400");
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
   * 显示游戏信息
   */
  showGameInfo(){
    let that = this;
    wx.showModal({
      title: '游戏信息',
      content: '游戏邀请码:【' + that.data.gamecode +"】",
      confirmText: "点击复制",
      confirmColor:	"#0081ff",
      cancelColor:	"#aaaaaa",
      success: res => {
        if (res.confirm) { // 点击确认将复制邀请码
          wx.setClipboardData({
            data: factory.buildShareText(that.data.gamecode)
          })
        }
      }
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
  },

  jumpToError(msg) {
    //console.error("用户不同意地理位置授权")
    wx.redirectTo({
      url: '/pages/error/error?errorType=' + msg
    });
  }
})
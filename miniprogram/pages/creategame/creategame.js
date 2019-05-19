// miniprogram/pages/creategame/creategame.js
const common = require('../../mod/modules/common.js');
const factory = require('../../mod/modules/factory.js');
const md5 = require('../../mod/modules/md5.js');
const app = getApp();
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
    errorModalShow: false, // 错误模态框显示控制标志
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
    markerInputModalShow: false, // 进行操作的埋点模态框显示控制标志
    markerInputModalShowWithType: 'new', // 进行操作的模态框类型 ： new | edit
    selectedMarkerInputModalTabId: 0, // 0 for text; 1 for pictur
    calloutConditionModalShow: false, // 前置头像多选模态框显示控制标志
    conditionsCanbeSelect: []
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
        let buttonHeightRPX = 80 + 20; // 按钮lg 80rpx + .btn-group padding 20rpx
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
    // 正则检验
    if (!this.checkMarkerInputModalInput()) return;
    this.setData({
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });

    // 上传文件
    wx.showLoading({ title: '上传图片中', mask:true});
    let localFilePath = that.data.markerForInputModal.img;
    const cloudPath = new Date().format("yyyy_MM_dd-") + md5.hexMD5(localFilePath) + localFilePath.match(/\.[^.]+?$/)[0];
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: localFilePath,
      config:{ env: app.globalData.database_env },
      success: res => {
        // console.log("添加新点", res);

        // 向数据中添加新点
        let extInfo = {
          text: that.data.markerForInputModal.text,
          img: that.data.markerForInputModal.img,
          imgId: res.fileID, // 更新为云文件ID
          condition: that.data.markerForInputModal.condition
        }
        let marker = factory.buildMarker(this.data.markers.length, this.data.markerForInputModal.name, {
          latitude: that.data.markerForInputModal.latitude,
          longitude: that.data.markerForInputModal.longitude
        }, extInfo);
        // console.log("添加新点", marker);
        that.addOneMarker(marker);
        that.cleanMarkerForInputModalValue();
      },
      fail: err => {
        console.error(err);
        that.handleError(err);
      },
      complete: res => {
        wx.hideLoading();
      }
    });

  },

  onMarkerInputModalDelete() {
    // 移除一个点
    let markerId = this.data.markerForInputModal.id; // 移除点的索引
    let imgIdToRemove = this.data.markers[markerId].extend.imgId;
    this.removeOneMarker(markerId);

    this.cleanMarkerForInputModalValue();
    let that = this;
    this.setData({
      markerForInputModal: that.data.markerForInputModal,
      markerInputModalShow: false,
      showMap: true,
      selectedMarkerInputModalTabId: 0
    });
    // 为了用户体验，此处仅发一个请求，无视是否能够把图删除成功
    wx.cloud.deleteFile({
      fileList: [imgIdToRemove],
      config: {env: app.globalData.database_env},
      complete: res => {}
    });
  },

  onMarkerInputModalEdit() {
    let that = this;
    let markerId = this.data.markerForInputModal.id;
    let marker = this.data.markers[markerId]; // 当前修改的点
    wx.showLoading({ title: '上传文件中', masek: true }); 
    let localFilePath = this.data.markerForInputModal.img;
    const cloudPath = new Date().format("yyyy_MM_dd-") + md5.hexMD5(localFilePath) + localFilePath.match(/\.[^.]+?$/)[0];
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: localFilePath,
      config: { env: app.globalData.database_env },
      success: res => {
        let newId = res.fileID;
        // 删除原本的文件
        // console.log("修改后的", res);
        wx.cloud.deleteFile({ 
          fileList: [marker.extend.imgId],
          config: { env: app.globalData.database_env },
          complete: res => {
            // 能够进行修改的项
            marker.callout.content = that.data.markerForInputModal.name;
            marker.extend.text = that.data.markerForInputModal.text;
            marker.extend.img = that.data.markerForInputModal.img;
            marker.extend.imgId = newId;
            marker.extend.condition = that.data.markerForInputModal.condition;

            that.data.markers[markerId] = marker;
            // console.log("修改后的", marker);
            // 修改数据
            that.setData({
              markers: that.data.markers,
              markerForInputModal: that.data.markerForInputModal,
              markerInputModalShow: false,
              showMap: true,
              selectedMarkerInputModalTabId: 0
            });
            
            that.cleanMarkerForInputModalValue();
          }
        });
      },
      fail: err => {
        console.error("修改埋点:上传文件错误", err);
        thar.handleError(err);
      },
      complete: res => wx.hideLoading()
    });
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
   * 文字/图片 导航标签栏切换
   */
  markerInputModalTabSelect(e) {
    this.setData({
      selectedMarkerInputModalTabId: e.currentTarget.dataset.id // 0 for text; 1 for pictur
    })
  },

  /**
   * 呼出前置条件多选框
   * 包含过滤出可选的点
   */
  calloutConditionSelectModal(){
    var that = this;
    // 延迟呼出，以给筛选提供时间
    wx.showToast({
      title: '载入中',
      icon: 'loading',
      mask: true, // 遮罩防止点击穿透
      duration: 1000
    });
    // 过滤出可选选项
    this.data.conditionsCanbeSelect = [];
    for(var i=0; i<this.data.markers.length; i++){
      let marker = this.data.markers[i];
      // 自身跳过
      if (marker.callout.content === this.data.markerForInputModal.name ){
        continue;
      }
      // 互锁引用跳过
      if (marker.extend.condition.indexOf(marker.callout.content)>-1) {
        continue;
      }
      // 避免图循环，简单处理，只可选中在这个点之前设置的点
      if (i >= this.data.markerForInputModal.id && this.data.markerForInputModal.id!=-1) {
        break;
      }

      // 检查是否已被选中
      let beChecked = this.data.markerForInputModal.condition.indexOf(marker.callout.content)>-1;

      this.data.conditionsCanbeSelect.push({
        name: marker.callout.content ,
        checked: beChecked
      });
      
      this.setData({ conditionsCanbeSelect: that.data.conditionsCanbeSelect});
    }
    if (this.data.conditionsCanbeSelect.length==0){
      wx.showToast({
        title: '无可选前置条件',
        icon: 'none',
        duration: 1000
      });
    } else {
      this.setData({ calloutConditionModalShow: true });
    }
  },

  cancelCalloutConditionModal(){
    this.setData({ calloutConditionModalShow: false});
  },

  comfirmCalloutConditionModal(){
    this.data.markerForInputModal.condition = [];
    for (var i = 0; i < this.data.conditionsCanbeSelect.length; i++){
      let c = this.data.conditionsCanbeSelect[i];
      if (c.checked){
        this.data.markerForInputModal.condition.push(c.name);
      }
    }
    let that = this;
    this.setData({ 
      calloutConditionModalShow: false ,
      markerForInputModal: that.data.markerForInputModal
    });
  },

  /**
   * 多选按钮触发
   */
  chooseCondition(e){
    let index = e.currentTarget.dataset.value;
    let condition = this.data.conditionsCanbeSelect[parseInt(index)];
    condition.checked = !condition.checked;
    this.data.conditionsCanbeSelect[parseInt(index)] = condition;
    let that = this;
    this.setData({ conditionsCanbeSelect: that.data.conditionsCanbeSelect });
  },

  /**
   * 检查MarkerInputModal输入的合法性
   */
  checkMarkerInputModalInput(){
    let errorImg = "../../resources/images/error.png";
    // 埋点名为空
    if (this.data.markerForInputModal.name===""){
      wx.showToast({
        title: '埋点名不能为空',
        icon: 'none',
        image: errorImg,
        mask: true,
        duration: 1500
      });
      return false;
    }

    // 谜面与图片至少一个不能为空
    if (this.data.markerForInputModal.text === "" && this.data.markerForInputModal.img==="") {
      wx.showToast({
        title: '请补充谜题或图片',
        icon: 'none',
        image: errorImg,
        mask: true,
        duration: 1500
      });
      return false;
    }

    // 检查重名性质
    for(var i=0;i<this.data.markers.length;i++){
      let marker = this.data.markers[i];
      if(this.data.markerForInputModal.name === marker.callout.content){
        // 重名
        wx.showToast({
          title: '埋点的名字重复',
          icon: 'none',
          image: errorImg,
          mask: true,
          duration: 1500
        });
        return false;
      }
    }
    return true;
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
    // 一场游戏至少需要两个点
    if(this.data.markers.length<=1){
      wx.showToast({
        title: '发布失败：一场游戏中至少需要两个埋点',
        icon:'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    let that = this;
    this.setData({
      buttonDisabled: true,
      showMap: false
    });

    // 从小程序端直接插入数据库
    const db = wx.cloud.database({
      env: app.globalData.database_env
    });
    const c_gamerooms = db.collection('c_gamerooms');
    let gamecode = common.getRamdon6NumberCode(); // 游戏序列码
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
              data: factory.buildShareText(gamecode)
            });
          }
        });

        // 延时跳转到首页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index'
          });
          that.setData({
            buttonDisabled: true,
            showMap: true
          });
        }, 5000);
      },
      fail(err){
        //console.error(err);
        that.handleError(err);
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
      helpModalShow: false,
      showMap: true
    });
  },

  /**
   * 隐藏底部错误提示信息框
   */
  hideBottomErrorModal() {
    this.setData({
      errorModalShow: false
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
        errorModalShow: false
      })
    }, errorDismissDelay);
  }
})
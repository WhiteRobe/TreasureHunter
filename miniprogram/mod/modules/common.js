 function getOpenid() {
   return new Promise(function(resolve, reject) {
     wx.cloud.callFunction({
       name: 'login',
       success: res => {
         console.log(res.result.openid);
         resolve(res.result.openid)
       },
       fail: err => {
         console.error(err);
         reject(-1);
       }
     })
   })
 };

 function getLocation() {
   return new Promise(function(resolve, reject) {
     wx.getLocation({
       type: 'gcj02',
       success(res) {
         //console.log('纬度', res.latitude, '经度', res.longitude)
         resolve({
           latitude: res.latitude,
           longitude: res.longitude
         })
        // resolve(res.longitude)
         //wx.setStorageSync('latitude', res.latitude)
         // wx.setStorageSync('longitude', res.longitude)
       },
       fail(err){
         reject("请你对获取地理位置进行授权")
       }
     })
   })
 }
 module.exports.getOpenid = getOpenid
 exports.getLocation = getLocation;
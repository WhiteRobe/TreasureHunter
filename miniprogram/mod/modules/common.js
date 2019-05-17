function getOpenid() {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        resolve(res.result.openid)
      },
      fail: err => {
        // console.error(err);
        reject(err);
      }
    });
  });
};

function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        //console.log('纬度', res.latitude, '经度', res.longitude)
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: err => {
        // console.error(err);
        reject(err);
      }
    });
  });
}

/** 
 * 获取4位随机数序列 : [A-Z0-9]
*/
function getRamdon4Code(){
  var codeLength = 4;
  var code = "";
  var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
  for (var i = 0; i < codeLength; i++) {
    var index = Math.floor(Math.random() * random.length);
    code += random[index];
  }
  return code;
}

/** 
 * 获取两点间的距离
*/
function getDistanceBetween2Geo(g1, g2) {
  const earthRadius = 6378.137;
  var La1 = g1.latitude * Math.PI / 180.0;
  var La2 = g2.latitude * Math.PI / 180.0;
  var LaDelta = La1 - La2;

  var LoDelta = g1.longitude * Math.PI / 180.0 - g2.longitude * Math.PI / 180.0;
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(LaDelta / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(LoDelta / 2), 2)));
  dis = dis * earthRadius;
  dis = Math.round(s * 10000) / 10000 * 1000; 
  // dis = dis.toFixed(2);
  return dis; // 单位为米
}

module.exports.getOpenid = getOpenid
exports.getLocation = getLocation;

exports.getRamdon4Code = getRamdon4Code;
exports.getDistanceBetween2Geo = getDistanceBetween2Geo;
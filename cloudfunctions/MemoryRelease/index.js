// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
/**
 * 纯云端触发器函数
 */

// 用于将过期的游戏注销
exports.main = async(event, context) => {

  const db = cloud.database({
    env: 'xdu-treasure-hunter'
  });
  const c_gamerooms = db.collection('c_gamerooms');
  const c_packages = db.collection('c_packages');
  const _ = db.command;

  // 持续时间-1
  await c_gamerooms.where({
      _active: true
    }).update({
      data: {
        _lasttime: _.inc(-1)
      }
    })
    .then(res => {
      console.log("持续时间减一天-res", res);
    })
    .catch(err => {
      console.error("持续时间减一天-err", err);
    });

  // 找出已结束的游戏
  const results = await c_gamerooms.where({
    _lasttime: _.lte(0),
    _active: true
  });
  var total = 0; // 先取出待更新集合记录总数
  await results.count()
    .then(res => {
      total = res.total;
    }).catch(err => {
      console.error(err)
    })
  console.log("total", total);

  // 计算需分几次取
  const MAX_LIMIT = 100;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  // 承载所有读操作的 promise 的数组
  let keys = [];
  for (let i = 0; i < batchTimes; i++) {
    // 这里必需重查一次，鉴于不会有有人半夜0点建游戏，或者这种情况太少
    // 因此姑且认为和上面的计数极端不会出现脏数据
    await c_gamerooms.where({
        _lasttime: _.lte(0),
        _active: true
      })
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
      .then(res => {
        for (let j = 0; j < res.data.length; j++) {
          let result = res.data[j];
          let gamecode = result._gamecode; // 待终结的游戏的编码(邀请码)
          console.log("要终结的项(gamecode, _id)", gamecode, result._id);
          // 入数组保存
          keys.push({
            id: result._id,
            gamecode: gamecode
          });
          // 别问，问就是微信API有坑，必需外部才能调用database
        }
      })
      .catch(err => {
        console.error("注销游戏和背包:查询阶段失败", err)
      });

  }

  let date = "" + new Date(); // 当前时间

  for (let i = 0; i < keys.length; i++) {
    // 游戏终结
    await c_gamerooms.doc(keys[i].id).update({
      data: {
        _active: false,
        _gamecode: "*" + keys[i].gamecode + "*" + date // 打上标记
      }
    }).then(res => {
      console.log("终结房间-res", res);
    }).catch(err => {
      console.error("终结房间-err", err);
    });

    // 背包注销
    await c_packages.where({
      _gamecode: keys[i].gamecode
    }).update({
      data: {
        _gamecode: "*" + keys[i].gamecode + "*" + date // 打上标记
      }
    }).then(res => {
      console.log("终结背包-res", res);
    }).catch(err => {
      console.error("终结背包-err", err);
    });
  }
  // 暂时不考虑清除图片数据

  return {};
}
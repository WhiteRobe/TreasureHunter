// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
/**
 * 纯云端触发器函数
 */

// 用于将过期的游戏注销
exports.main = async(event, context) => {
  return; // 注释这一句
  const db = cloud.database({
    env: 'xdu-treasure-hunter'
  });
  const c_gamerooms = db.collection('c_gamerooms');
  const c_packages = db.collection('c_packages');
  const _ = db.command;

  console.log("1执行到此处");
  await c_gamerooms.where({
    _active: true
  }).get({
    complete: res => {
      console.log("执行结果", res)
    }
  })


  // 持续时间-1
  await c_gamerooms.where({
      _active: true
    }).update({
      data: {
        _lasttime: _.inc(-1)
      }
    })
    .then(res => {
      console.log("持续时间-1 res", res);
    })
    .catch(err => {
      console.error("持续时间-1 error", err);
    });
  
  // 找出已结束的游戏
  // 先取出集合记录总数
  const countResult = await c_gamerooms.count();
  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100);
  // 承载所有读操作的 promise 的数组
  const tasks = []
  const MAX_LIMIT = 100;
  for (let i = 0; i < batchTimes; i++) {
    const promise = c_gamerooms.where({
      _lasttime: _.lte(0),
      _active: true
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    tasks.push(promise);
  }
  // 等待所有Promise 执行完
  (await Promise.all(tasks))
  .then( res => {
    for (var i = 0; i < res.data.length; i++) {
      let data = res.data[i];
      let gamecode = data._gamecode;
      let date = "" + new Date();
      // 游戏终结
      c_gamerooms.doc(data._id).update({
        data: {
          _active: false,
          _gamecode: "*" + gamecode + date // 打上标记
        }
      }).then(res => {
        console.log("终结房间res" , res);
      }).catch(err => {
        console.error("终结房间err", err);
      });
      // 背包注销
      c_packages.where({
        _gamecode: gamecode
      }).update({
        _gamecode: "*" + gamecode + date // 打上标记
        }).then(res => {
          console.log("终结背包res", res);
        }).catch(err => {
          console.error("终结背包err", err);
        });
    }
  })
  .catch(err =>{
    console.error("Promise.all(tasks) err", err);
  });


  // // 找出已结束的游戏
  // c_gamerooms.where({
  //     _lasttime: _.lte(0),
  //     _active: true
  //   }).get()
  //   .then(res => {
  //     results.shudownGameRes.globallRes = res;
  //     for (var i = 0; i < res.data.length; i++) {
  //       let data = res.data[i];
  //       let gamecode = data._gamecode;
  //       let date = "" + new Date();
  //       // 游戏终结
  //       c_gamerooms.doc(data._id).update({
  //         data: {
  //           _active: false,
  //           _gamecode: "*" + gamecode + date // 打上标记
  //         }
  //       }).then(res => {
  //         results.shudownGameRes.gameroomsRes = res;
  //       }).catch(err => {
  //         results.shutdonwGameErr.gameroomsErr = err;
  //       });
  //       // 背包注销
  //       c_packages.where({
  //         _gamecode: gamecode
  //       }).update({
  //         _gamecode: "*" + gamecode + date // 打上标记
  //       }).then(res => {
  //         results.shudownGameRes.packagesRes = res;
  //       }).catch(err => {
  //         results.shutdonwGameErr.packagesErr = err;
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     errors.shutdonwGameErr.globallErr = err;
  //   });

  return {};
}
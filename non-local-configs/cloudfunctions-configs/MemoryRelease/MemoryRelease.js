// 部署：在 cloud-functions/${cloudfunction-name} 文件夹右击选择 “上传并部署：同时云安装依赖”
/**
 * 该云函数仅在云端调用
 * 用于清理数据库中过期的游戏数据
 */

/* 调用方式 */
wx.cloud.callFunction({
  name: '${MemoryRelease}',
  data: {},
  success: res => { },
  fail: err => { }
})

/* 返回值参考 */
return {}

/** 触发器 */
let trigger = 
{
  "triggers": [
    {
      "name": "MemoryReleaseTrigger",
      "type": "timer",
      "config": "0 0 0 * * * *" // 每天00:00:00触发
    }
  ]
}
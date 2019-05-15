// 样例云函数的配置文件js写法

// 部署：在 cloud-functions/${cloudfunction-name} 文件夹右击选择 “上传并部署”


// 配置方式一：源码写法
/**
 * 云函数的功能性说明, eg. 获得用户的唯一标识符
 * 
 * @event $参数说明
 * @context $参数说明
 * 
 * 备注：event,context 可忽略
 */
exports.main = (event, context) => {
  return {
    openid: event.userInfo.openId,
  }
}

// 配置方式二：接口写法(推荐)
/* 调用方式 */
wx.cloud.callFunction({
  name: '${cloudfunction-name}',
  data: {},
  success: res => { },
  fail: err => { }
})

/* 返回值参考 */
return {
  openid: event.userInfo.openId,
}
// 或直接给出例值
{
  openid: "123456789ascd"
}
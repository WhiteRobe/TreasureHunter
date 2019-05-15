# 项目载入相关
## 配置概览
1. 修改 `project.config.json` (参考`/non-local-configs`中的文件) 中的`appid`为测试用的`appid`。
2. 从 `微信开发者工具` 载入该文件 。

## 注意事项
### 非本地的配置文件及代码的Git协议：
1. 新增云函数进行部署，并写成配置文件。(配置文件参见 `/non-local-configs` 中的样例，下同)
2. 数据库集合增删应当写成配置文件。

### 开发环境版本
1. IDE Stable v1.02.1904090
2. 基础调试库 2.7.0+

---

# 项目开发相关
## 目录结构
以 `/` 为项目根目录：

**/non-local-configs** : `非本地的配置文件及代码`<br/>
└ **/cloudfunctions-configs** : `云函数配置文件`<br/>
└ **/database-configs** : `云数据库配置文件`<br/>
**/cloudfunctions:** : `云函数文件夹`<br/>
**/miniprogram**<br/>
└ **/resources** : `资源文件夹`<br/>
─ └ **/images** : `图片资源`<br/>
─ └ **/audios** : `音效资源`<br/>
└ **/mod** : `扩展内容插槽`<br/>
─ └ **/modules** : `通用逻辑模块`<br/>
─ └ **/templates** : `通用模板及样式表`<br/>
└ **/pages** : `页面`<br/>
└ **/style** : `全局样式`<br/>
└ **app.js**<br/>
└ **app.json**<br/>
└ **app.wxss**<br/>

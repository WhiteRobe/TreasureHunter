# 项目载入相关
## 配置概览
1. 修改 `project.config.json` (参考`/non-local-configs`中的文件`example_project.config.json`) 中的`appid`为测试用的`appid`。
2. 将`example_project.config.json`文件改名为`project.config.json`，放到工程目录下。
2. 从 `微信开发者工具` 载入该工程 。

## 注意事项
### 非本地的配置文件及代码的Git协议：
1. 新增云函数进行部署，并写成配置文件。(配置文件参见 `/non-local-configs` 中的样例，下同)
2. 数据库集合增删应当写成配置文件。

### 开发环境版本
1. IDE Stable v1.02.1904090
2. 基础调试库 2.7.0+

## 已集成的依赖
1. WeUI
2. ColorUI

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
└ **app.js** : `全局构造器`<br/>
└ **app.json** : `APP路由及结构`<br/>
└ **app.wxss** : `全局样式表`<br/>

> 注意：不建议在全局样式表里插入模板样式，推荐仅将全局样式表作为CSS依赖的配置文件。
> 注意打包时不要打包`logo.zip`的文件，否则小程序文件大小会超标

## 路由
### 一级主页面
- `index` ： 入口页(爬虫索引页)
- `error` ： 错误提示页面
- `gamebegin` : 游戏开始页
- `creategame` : 创建一场新游戏的主界面
- `ingame` : 游戏中的主界面

### 二级派生页面
- 暂无

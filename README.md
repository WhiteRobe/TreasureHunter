# 微信小程序:云开发校园探宝
## Slogan
不必再发愁组织“户外解谜活动”所需要投入的大量人力——发起/设计线索、参与/解决谜题，享受在户外行走和探索解密的乐趣。


<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/share_code.png"/>


## 适用场景
大学生活除了学习、科研之外，必不可少的还有人与人之间的交际活动。
通常情况下，大学中存在着各种俱乐部、兴趣小组和社团等学生组织，这些学生组织经常会组织团队活动来加强社员间的关系、帮助新社员更好地认识彼此和融入集体。
此外，有些社团还会组织全校范围活动，这些活动不仅仅只面向内部人员，同时面向所有学生，以进行宣传社团、完成外联活动等社团任务。
在众多的社团活动中，我们找到了一个需求广泛但仍留有开发空间的需求，即“校园寻宝”活动（或户外解谜活动）。

## 我们所致力解决的问题
作为曾经的活动组织者，我们深知在线下组织此类活动所存在的种种不便和有待利用计算机程序自动化实现的地方:
1. 开销较大
组织一场“校园寻宝”活动，需要大量的人力物力，以保证各个解谜点位的工作人员充足、提供给全校玩家的谜题线索(如打印的谜题)不会短缺。
2. 破坏沉浸感
由于各个点位都需要工作人员存在，玩家在解谜时往往变成了“捉迷藏”，着重于依靠眼力寻找工作人员或相关标志，而不是“解谜”这个核心内容。
3. 组织困难
由于工作人员基本都是在校学生，都有自己的学业要兼顾，无法保证一直在场以引导玩家获取新的线索；因此需要活动策划者耗尽心力进行统筹、排班以保证每个点位都有工作人员。
4. 难以维持场地
在游戏进行过程中，一些必需无人看管的解谜点所隐藏的线索很容易被路人无心带走、破坏和剧透，严重影响游戏参与者的活动乐趣。
5. 游戏乐趣不足
由于以上种种问题，哪怕再精心设计的谜题由于持续时间有限、组织难度较大等原因，常常草草收场，活动策划者期望带给玩家的乐趣并不能很好地为绝大多数玩家所体验。


**我们的工作重点**：
- 利用云数据库的存储功能，构建“无纸化解谜线索”存储、分发和查询系统，解决线下活动时需要有人看护解谜点隐藏线索的问题及削减分发纸质线索的所需人力物力开销。
- 基于微信的定位API，替代了工作人员的签到盖章，进一步削减了人力开销。
- 依靠电子化，实现游戏过程的无人化，提高玩家的沉浸感和单场游戏可持续时间。
- 支持使用文字和图片信息作为线索及设置解谜约束条件，方便活动策划者构建出优秀的游戏内容。

**完整的产品简介：**[《校园探宝》产品简介](https://github.com/WhiteRobe/TreasureHunter/blob/master/others/introduce.pdf)

## 产品业务图
1. 主业务引导

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/main.jpg"/>


2. 加入活动的业务图

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/ingame_liucheng.jpg"/>


3. 创建活动的业务图

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/creategame_liucheng.jpg"/>

---

# 效果演示

1. 载入引导界面

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/loading.jpg" width="375"/>


2. 手动输入6位邀请码

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/joingamebyinvite.jpg" width="375"/>

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/joingamebyinvite2.jpg" width="375"/>

3. 参与活动时的界面效果

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/ingame.jpg" width="375"/>

4. 设置文字线索

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/samplerume.jpg" width="375"/>

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/setinfowithtext.jpg" width="375"/>

5. 设置图片线索

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/setinfowithpic.jpg" width="375"/>

6. 分享你的活动

<img src="https://github.com/WhiteRobe/TreasureHunter/raw/master/others/sharegame.jpg" width="375"/>

---

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

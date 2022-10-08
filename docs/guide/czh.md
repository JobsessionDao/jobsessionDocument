---
title: 页面功能说明
date: 2022-10-07
---

# 页面功能说明

> 带\*代表暂时还无法实现，先实现其他的。

## 1.登录页面 @wcq

微信一键登录 API，获取用户的头像和昵称以及 openid 用于标识用户。

[参考链接](https://blog.csdn.net/ZHANGYANG_1109/article/details/118111477)

\*完成登陆后，向全局逻辑传递数据 `App.js` ，用于 我的 页面的数据。同时判断云开发数据库中是否以及存在这个用户的信息。if 存在，忽略；if 不存在，写入云数据库（userData）用户的信息。包含：

```json
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
}
```

## 2.搜索页面 @wcq

搜索框先写一个摆设。

搜索结果参照 @wcy 写的内容卡片。但是要根据后台来的数据做判断，后台会返回这样的一些数据：

```json
[
  {
    articleID:"", // 文章的ID，用于唯一辨识文章
    authorID:"",// 文章的作者ID
    articleTitle:"", // 文章的标题
    articleTag:"", // 文章tag中的内容
    desc:"",// 文章的内容
    time:"",// 文章发表的时间
    type:1, // 文章类型，1：经验，2：问答
    number:50, // 文章的点赞数或者是问答的回答数
  },
  // ... 其余数据
]
```

如果 `type===1` 渲染为蓝色卡片，如果 `type===2` 渲染为橙色卡片。提示使用 `wx:if` 实现。

## 3.我的页面 @wcq

### 头像

获取登录页面传来 `App.js` 的数据，渲染在页面上头像和昵称。

### 退出登录

点击退出登陆后注销小程序账号，返回登录页面，详见：

[退出登录参考](https://blog.csdn.net/qq_41408685/article/details/105955874)

### 经验、赞赏、收藏

\*根据获取到的 `App.js` 中的用户 ID 到数据库查询用户的经验数、赞赏值、收藏数。经验数和赞赏不用做点击跳转，收藏需要，跳转到下面的我的收藏界面。(还没有数据库时先在 js 中模拟数据)，后台返回的一条用户数据如下：

```json
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
  expCre:100, // 用户的经验积分
  likeCre:50, // 用户的赞赏值
  collectNum:10, // 用户的收藏数
  // ... 其他无关的字段
}
```

### 四个模块

分别将四个模块保存为 4x 的图片，用 css 写成两行两列的格式，每张图上都要预留跳转的接口。

## 4.经验页面 @wcy

首先是后台数据库返回的所有经验贴子，要进行分页（触底加载更多）。

[触底加载参考](https://juejin.cn/post/7101820398253113351)

右下角有一个 fix 的发布按钮，点击进入发布界面，发布按钮保持不动。

## 5.QA 页面 @wcy

同上。

## 6.经验详情页面 @wcy

整个页面作为复用页面，从上面的页面跳转来时，同时传入文章 ID 参数。利用这个参数来查询具体的文章内容。左下角的点赞按钮，数据库中的 number 字段自加 1.并且在经验页面点赞后，点赞者的经验值（expCre）+10.并在用户 CollectList 中添加文章的 ID

文章数据库结构：

```json
[
  {
    articleID:"", // 文章的ID，用于唯一辨识文章
    authorID:"",// 文章的作者ID
    articleTitle:"", // 文章的标题
    articleTag:"", // 文章tag中的内容
    desc:"",// 文章的内容
    time:"",// 文章发表的时间
    type:1, // 文章类型，1：经验，2：问答
    number:50, // 文章的点赞数或者是问答的回答数
    commentList:[
      "qenh76feq72eguyguybw",  // 评论的ID
      "38hwfuig723hiudnuihh",
      //...
    ] // 评论
    //...
  },
  // ... 其余数据
]
```

用户数据库结构：

```json
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
  expCre:100, // 用户的经验积分
  likeCre:50, // 用户的赞赏值
  collectNum:10, // 用户的收藏数
  CollectList:[
    "wefrgthryj",
    "wefwrrgeth",
    //...
  ]
  // ... 其他无关的字段
}
```

在文章下方有评论页面，通过文章的 ID 查询所有属于它的评论并显示。用户发表评论后，在评论数据库中新增一条评论数据，并更新文章的 commentList 列表。

评论的字段：

```json
{
  commentID:"",// 唯一标识
  articleID:"",// 标记属于哪篇文章
  userID:"",// 标记创建者
  userName:"",// 标记创建者的姓名
  time:"",// 标记创建时间
  desc:""// 评论的详细内容
}
```

## 7.问答详情页面 @wcy

同上，不过问答左下角的按钮不加分但放入收藏。

## 8.我的经验 @syf

先从 `App.js` 中获取当前用户的 ID，再从数据库中查询当前用户的发表的文章(user 数据表中 CreateList 字段)，用户的信息：

```json
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
  expCre:100, // 用户的经验积分
  likeCre:50, // 用户的赞赏值
  collectNum:10, // 用户的收藏数
  CollectList:[
    "wefrgthryj",
    "wefwrrgeth",
    //...
  ],
  CreateList:[
    {
      articleID:"dwgrgh",
      articleTitle:"这是一个标题",
      type:1,
    },
    {
      articleID:"fewgrrg",
      articleTitle:"这是一个标题",
      type:1,
    },
    {
      articleID:"effrgh",
      articleTitle:"这是一个标题",
      type:1,
    },
    //...
  ]
  // ... 其他无关的字段
}
```

拿到字段值后通过列表渲染显示。

## 9.我的问答 @syf

同上。

## 10.我的收藏 @syf

同上，不过要根据 type 渲染不同的颜色。

## 11.我的目标页面 @sn

先从 `App.js` 中获取当前用户的 ID，再从数据库中查询当前用户的目标字段。

```json
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
  expCre:100, // 用户的经验积分
  likeCre:50, // 用户的赞赏值
  collectNum:10, // 用户的收藏数
  aim:{
    aimTitle:"目标标题",
    aimDesc:"目标描述",
    beginDate: 2022-10-11,
    endDate:2024-10-11
  }
  // ... 其他无关的字段
}
```

实现倒计时，倒计时参考代码：

```js
countDown: function () {
        let that = this;

        that.setData({
            timer: setInterval(function () {

                var lefttime = parseInt((-new Date(that.data.jssj.replace(/
                -/g, "/")).getTime() + new Date().getTime()));

                var d = parseInt(lefttime / 1000 / 3600 / 24); //天数
                var h = parseInt(lefttime / 1000 / 3600 % 24); //小时
                var m = parseInt(lefttime / 1000 / 60 % 60); //分钟
                var s = parseInt(lefttime / 1000 % 60); //当前的秒

                d < 10 ? d = "0" + d : d;
                h < 10 ? h = "0" + h : h;
                m < 10 ? m = "0" + m : m;
                s < 10 ? s = "0" + s : s;

                that.setData({
                    qgdjs_jo: {
                        day: d,
                        hour: h,
                        min: m,
                        sec: s
                    }
                })
            }, 1000)
        })
    },
```

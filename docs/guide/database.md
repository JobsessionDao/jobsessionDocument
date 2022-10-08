---
title: 数据库设计
date: 2022-10-07
---

# 数据库设计

## 表 1：userList

> 用户表

### - userID 【关键码】

**定义** 用户唯一 ID | String | 必填  
**初始化** 在用户首次登陆时写入，来自微信提供的 API 接口（openid）

### - userName

**定义** 用户昵称 | String | 必填  
**初始化** 在用户首次登陆时写入，来自微信提供的 API 接口（微信昵称）

### - userAvater

**定义** 用户头像的链接 | String | 必填  
**初始化** 在用户首次登陆时写入，来自微信提供的 API 接口

### - expCre

**定义** 用户经验积分 | Number | 必填  
**初始化** 在用户首次登陆时写入，初始化为 0  
**可能引起变动**  
 1.用户点击收藏一个经验贴，+10。  
 2.用户发表一篇经验，+30。

### - likeCre

**定义** 用户赞赏积分 | Number | 必填  
**初始化** 在用户首次登陆时写入，初始化为 0  
**可能引起变动**  
 1.用户发表的经验贴被点赞，+30。

### - collectNum

**定义** 用户收藏的贴子数 | Number | 必填  
**初始化** 在用户首次登陆时写入，初始化为 0  
**可能引起变动**  
 1.用户点击收藏一篇经验贴时+1。  
 2.用户点击收藏一篇问答贴时+1。

### - CollectList

**定义** 用户收藏的帖子列表 | `List[object,...]` | 必填  
**初始化** 在用户首次登陆时写入，初始化为 []  
**可能引起变动**  
 1.用户点击收藏一篇经验贴时在数组中添加一个对象。  
 2.用户点击收藏一篇问答贴时在数组中添加一个对象。  
**子对象**  
存放在数组中的对象。示例：

```json
{
  articleID:"dwgrgh",
  articleTitle:"这是一个标题",
  type:1,
}
```

### - CreateList

**定义** 用户发表的文章列表 | `List[object,...]` | 必填  
**初始化** 在用户首次登陆时写入，初始化为 []  
**可能引起变动**  
 1.用户点击发布一篇经验贴时在数组中添加一个对象。  
 2.用户点击发布一篇问答贴时在数组中添加一个对象。  
**子对象**  
存放在数组中的对象。示例：

```json
{
  articleID:"dwgrgh",
  articleTitle:"这是一个标题",
  type:1,
}
```

### - aim

**定义** 用户的目标字段 | object | 必填  
**初始化** 在用户首次登陆时写入，初始化为下例  
**可能引起变动**  
 用户修改目标页面的参数时操作数据库修改。  
**对象值**

```json
aim:{
    aimTitle:"我的目标",
    aimDesc:"我的目标描述",
    beginDate: 2022-10-11,
    endDate:2024-10-11
  }
```

### userList 数据表 json 示例

这是一条数据：

```js
{
  userName:"",  // 用户昵称
  userAvater:"",  // 用户头像链接
  userID:"", // 用户唯一标识符（openid）
  expCre:100, // 用户的经验积分
  likeCre:50, // 用户的赞赏值
  collectNum:10, // 用户的收藏数
  CollectList:[
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
  ],
  aim:{
    aimTitle:"我的目标",
    aimDesc:"我的目标描述",
    beginDate: 2022-10-11,
    endDate:2024-10-11
  }
}
```

## 表 2：articleList

> 文章数据表

### - articleID 【关键码】

**定义** 文章的唯一标识 | String | 必填  
**初始化** 在用户发布文章时初始化为随机值

### - authorID 【绑定值】

**定义** 这篇文章的作者标识 | String | 必填  
**初始化** 在用户发布文章时初始化，值绝对等于 userList 表中的 userID

### - articleTitle

**定义** 文章标题 | String | 必填 | 限 13 个字  
**初始化** 在用户发布文章时初始化，初始值为用户填写的标题

### - articleTag

**定义** 文章的标签 | String | 不必填 | 限 6 个字  
**初始化** 在用户发布时初始化，初始化值为用户填写的标签

### - desc

**定义** 文章的内容 | String | 必填 | 经验贴限制为 900 字，问答贴限为 100 字  
**初始化** 在用户发布时初始化，初始化值为用户填写内容

### - time

**定义** 文章发布的时间 | Date | 必填  
**初始化** 在用户发布时初始化，初始值为用户发布的时间

### - type

**定义** 文章的类型 | Number | 必填 | 1：经验贴；2：问答贴  
**初始化** 在用户发布时初始化，根据用户选择的发布类型决定

### - number

**定义** 经验的收藏数或问答的回答数 | Number | 必填  
**初始化** 在用户发布时初始化，初始化为 0  
**可能引起变化**  
 1.用户点赞收藏经验贴+1.  
 2.用户回答问答贴时，评论数增加时+1.

### - commentList

**定义** 评论列表 | `List[object,...]` | 必填  
**初始化** 在用户发布时初始化，初始化为 []  
**可能引起变化**
当文章有人评论时，添加一个对象。对象的格式如下：

```json
{
  userID:"",  // 评论者的ID
  userName:"", // 评论者的昵称
  content:"", // 评论的内容
  time:"2022-10-07 20:04" // 评论时间
}
```

### - imageList

**定义** 图片列表 | List | 选填  
**初始化** 在用户发布时初始化，初始化为 []
**可能引起变化**  
用户发布贴子时，添加了图片。最多四条。示例：

```json
[
  "sdrgtheyjryjyrjyyjyjt.jpg",
  "dsfvrfrrgrgerrgr.jpg",
  "shkefuierhgfuirhufueh.jpg",
  "dekroiuf7hdiew38.jpg"
]
```

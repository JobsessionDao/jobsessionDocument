---
title: 工具包的使用
date: 2022-10-06
---

# 工具包的使用

我把主要的工具函数（包括数据库的各类读写）都封装起来放在了 `utils` 文件夹中，这样可以方便调用。  

## addUser 添加用户

### 声明

在js页面的顶部声明使用这个工具。  

```js
let addUser = require("../../utils/addUser.js");
```

### 调用

以异步函数的形式调用。传入的参数如下：  

```js
/**
 * 参数列表，必须按顺序传入
 * @param {string} name 用户名
 * @param {string} avatar 用户的头像链接
 * @param {string} id 用户的ID
 */
```

调用示例：  

```js
let res=await addUser.addUser.addMethod(this.data.
userName,this.data.userAvatar,this.data.userID)
```

注意，必须使用 `await` 关键字，否则会报错。并且调用这个方法的函数必须是异步函数。例如：  

```js
Page({
  data: {
    //...
  },
  onLoad:async function (options) {
    let res=await addUser.addUser.addMethod(this.data.
userName,this.data.userAvatar,this.data.userID)
  },
  //...
})
```

它所在的函数声明中必须有 `async` 关键字。  

### 返回值

返回值是 `添加成功` 和 `添加失败` 两种 string 类型。也就是说：  

```js
let res=await addUser.addUser.addMethod(this.data.
userName,this.data.userAvatar,this.data.userID);
console.log(res)
```

打印出的结果是 `添加成功` 或者 `添加失败`。  

你可以根据这个返回值来向用户作出声明。

## getUserID 获取用户openid

### 声明

在js页面的顶部声明使用这个工具。  

```js
let getUserID = require("../../utils/getUserID.js");
```

### 调用

无传入参数，直接调用，但是只能在按钮点击事件中调用。  

```js
await getUserID.getui.getUserID();
```

同上，必须在异步函数中调用。  

```js
async login() {
    // 用户登录
    let resl = await getUserID.getui.getUserID();
    this.setData({
      userID: resl[2],
      userAvatar: resl[1],
      userName: resl[0],
    });
    console.log("!!" + this.data.userID + this.data.userAvatar);
},
```

### 返回值

返回值是一个数组，包含三个元素，分别是：  

```js
resl[0] // 用户名
resl[1] // 用户头像链接
resl[2] // 用户openid
```

在调用完这个函数后，你可以把这三个值赋值给 `App.js` 的data中的变量，供全局使用。

## addArticle 添加文章

### 声明

在js页面的顶部声明使用这个工具。  

```js
let addArticle = require("../../utils/addArticle.js");
```

### 调用

以异步函数的形式调用。传入的参数如下：  

```js
/**
 * 用于向集合 articleList 添加一条文章信息
 * 参数列表，必须按顺序传入
 * @param {string} title 文章标题
 * @param {string} tag 文章标签
 * @param {string} content 文章内容
 * @param {string} type 文章类型
 * @param {List} images 图片列表
 * @param {string} author 文章作者
 * @param {string} authorID 文章作者ID
 * @param {string} authorAvatar 文章作者头像
 */
```

必须按照上面的顺序传入参数。  

以异步的形式调用，示例：  

```js
let res = await addArticle.addArticle.addMethod(
  this.data.title,
  this.data.tag,
  this.data.content,
  this.data.type,
  this.data.images,
  this.data.userName,
  this.data.userID,
  this.data.userAvatar
);
```

### 返回值

返回值是 `添加成功` 和 `添加失败` 两种 string 类型。

## getArticle 获取文章

### 声明

在js页面的顶部声明使用这个工具。  

```js
let getArticle = require("../../utils/getArticle.js");
```

### 调用

以异步函数的形式调用。传入的参数如下：  

```js
/**
 * 查询一篇文章
 * @param {string} id 文章id
 */
```

传入的参数是文章的id。用于在**我的**时跳转到文章详情页。  

以异步的形式调用，示例：  

```js
let res = await getArticle.getArticle.
getArticleMethod(this.data.id);
```

### 返回值

返回值是一个对象，包含文章的所有信息。  

```js
res.data[0].articleTitle // 文章标题
res.data[0].articleTag // 文章标签
//... 具体请查看云开发数据库
```

## AddLike 添加点赞或插眼

### 声明

在js页面的顶部声明使用这个工具。  

```js
let addLike = require("../../utils/addLike.js");
```

### 调用

接收两个参数，第一个参数是文章id，第二个参数是发生这个行为的用户的id。  

```js
/**
 * 为文章增加一个点赞或插眼
 * @param {string} articleId 文章id
 * @param {string} userId 发生点赞行为的用户id
 */
```

以异步的形式调用，示例：  

```js
let res = await addLike.addLike.addMethod(this.data.id, this.data.userID);
```

### 返回值

本工具会自行判断是否已经点赞或插眼，如果已经点赞或插眼，会在数据库删除点赞和插眼的记录，返回 `取消点赞成功` 或 `取消点赞失败`。如果尚未点赞或插眼，会在数据库添加点赞和插眼的记录，返回 `点赞成功` 或 `点赞失败`。

返回值是 `点赞成功` 和 `点赞失败` 和 `取消点赞成功` 和 `取消点赞失败` 四种 string 类型。

在判断显示点赞和插眼的图标时，可以通过文章中的 `likeList.length` 来得到应该显示的数量。

## addComment 添加评论

### 声明

在js页面的顶部声明使用这个工具。  

```js
let addComment = require("../../utils/addComment.js");
```

### 调用

接收三个参数，第一个参数是文章id，第二个参数是发生这个行为的用户的id，第三个参数是评论内容，第四个是评论者的用户名。  

```js
/**
 * 为文章增加一个评论
 * @param {string} articleId 文章id
 * @param {string} userId 发生点赞行为的用户id
 * @param {string} comment 评论内容
 * @param {string} commentUserName 评论者用户名
 */
```

以异步的形式调用，示例：  

```js
let res = await addComment.addComment.addMethod(this.
data.id, this.data.userID, this.data.comment, this.
data.commentUserName);
```

### 返回值

本工具会在数据库添加评论的记录，返回 `评论成功` 或 `评论失败`。  

返回值是 `评论成功` 和 `评论失败` 两种 string 类型。  

## addCollect 添加收藏

### 声明

在js页面的顶部声明使用这个工具。  

```js
let addCollect = require("../../utils/addCollect.js");
```

### 调用

接收四个参数。

```js
/**
 * 添加一个收藏
 * @param {string} articleID 收藏的文章id
 * @param {string} userID 收藏者id
 * @param {string} title 收藏的文章标题
 * @param {number} type 收藏的文章类型
 */
```

以异步的形式调用，示例：  

```js
let res = await addCollect.addCollect.addCollectMethod
(this.data.id, this.data.userID, this.data.title,
 this.data.type);
```

### 返回值

本工具会自行判断是否已经收藏，如果已经收藏，，返回 `已收藏` 或。如果尚未收藏，会在数据库添加收藏的记录，返回 `收藏成功` 或 `收藏失败`。  

返回值是 `收藏成功` 和 `收藏失败` 和 `已收藏` 三种 string 类型。

## getAim 获取目标

### 声明

在js页面的顶部声明使用这个工具。  

```js
let getAim = require("../../utils/getAim.js");
```

### 调用

接收一个参数，用户的id。  

```js
/**
 * 获取目标
 * @param {string} userID 用户id
 */
```

以异步的形式调用，示例：  

```js
let res = await getAim.getAim.getAimMethod
(this.data.userID);
```

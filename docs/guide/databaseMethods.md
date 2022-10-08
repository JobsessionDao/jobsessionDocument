---
title: 云开发：数据库和云存储操作
date: 2022-10-06
---

# 云开发：数据库和云存储操作

## 数据库结构

云开发提供了一个 JSON 数据库，顾名思义，数据库中的每条记录都是一个 JSON 格式的对象。一个数据库可以有多个集合（相当于关系型数据中的表），集合可看做一个 JSON 数组，数组中的每个对象就是一条记录，记录的格式是 JSON 对象。  

关系型数据库和 JSON 数据库的概念对应关系如下表：  

![1](https://jetzihan-img.oss-cn-beijing.aliyuncs.com/blog/20221008101852.png)

以下是一个示例的集合数据，假设我们有一个 `books` 集合存放了图书记录，其中有两本书：  

```json
[
  {
    "_id": "Wzh76lk5_O_dt0vO",
    "title": "The Catcher in the Rye",
    "author": "J. D. Salinger",
    "characters": [
      "Holden Caulfield",
      "Stradlater",
      "Mr. Antolini"
    ],
    "publishInfo": {
      "year": 1951,
      "country": "United States"
    }
  },
  {
    "_id": "Wzia0lk5_O_dt0vR",
    "_openid": "ohl4L0Rnhq7vmmbT_DaNQa4ePaz0",
    "title": "The Lady of the Camellias",
    "author": "Alexandre Dumas fils",
    "characters": [
      "Marguerite Gautier",
      "Armand Duval",
      "Prudence",
      "Count de Varville"
    ],
    "publishInfo": {
      "year": 1848,
      "country": "France"
    }
  }
]
```

在图书信息中，我们用 title, author 来记录图书标题和作者，用 characters 数组来记录书中的主要人物，用 publishInfo 来记录图书的出版信息。在其中我们可以看到，字段既可以是字符串或数字，还可以是对象或数组，就是一个 JSON 对象。  

每条记录都有一个 _id 字段用以唯一标志一条记录、一个_openid 字段用以标志记录的创建者，即小程序的用户。需要特别注意的是，在管理端（控制台和云函数）中创建的不会有 _openid 字段，因为这是属于管理员创建的记录。开发者可以自定义_id，但不可自定义和修改 _openid 。_openid 是在文档创建时由系统根据小程序用户默认创建的，开发者可使用其来标识和定位文档。  

## 数据库基本操作

### 简述

数据库 API 分为小程序端和服务端两部分，小程序端 API 拥有严格的调用权限控制，开发者可在小程序内直接调用 API 进行非敏感数据的操作。对于有更高安全要求的数据，可在云函数内通过服务端 API 进行操作。云函数的环境是与客户端完全隔离的，在云函数上可以私密且安全的操作数据库。  

数据库 API 包含增删改查的能力，使用 API 操作数据库只需三步：**获取数据库引用、构造查询/更新条件、发出请求**。以下是一个在小程序中查询数据库的发表于美国的图书记录的例子：  

```js
// 1. 获取数据库引用
const db = wx.cloud.database()
// 2. 构造查询语句
// collection 方法获取一个集合的引用
// where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。
// API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
// get 方法会触发网络请求，往数据库取数据
db.collection('books').where({
  publishInfo: {
    country: 'United States'    // 限定查询条件为美国出版的图书
  }
}).get({
  success: function(res) {
  // 输出 [{ "title": "The Catcher in the Rye", ... }]
  console.log(res)
 }
})
```

在我们实际应用中，可以使用这个查询语句来查询某位用户所有的贴子。  

### 初始化数据库

在你的js文件中，首先需要引入数据库的SDK：  

```js
const db = wx.cloud.database()
```

如需获取其他环境的数据库引用，可以在调用时传入一个对象参数，在其中通过 env 字段指定要使用的环境。此时方法会返回一个对测试环境数据库的引用。  

示例：假设有一个环境名为 test，用做测试环境，那么可以如下获取测试环境数据库：  

```js
const db = wx.cloud.database({
  env: 'test'
})
```

要操作一个**集合**，需先获取它的引用。在获取了数据库的引用后，就可以通过数据库引用上的 `collection` 方法获取一个集合的引用了，比如获取 `userList` 集合：  

```js
const userList = db.collection('userList')
```

获取集合的引用并不会发起网络请求去拉取它的数据，我们可以通过此引用在该集合上进行增删查改的操作，除此之外，还可以通过集合上的 doc 方法来获取集合中一个指定 ID 的记录的引用。同理，记录的引用可以用于对特定记录进行更新和删除操作。  

假设我们有一个用户的 ID 为 `ajksib8wh52vgwiolppwjie`，那么我们可以通过 doc 方法获取它的引用：  

```js
const user = userList.doc('ajksib8wh52vgwiolppwjie')
```

### 插入数据

在获取了集合的引用后，就可以通过 `add` 方法在集合中插入一条记录了。比如我们要在 `userList` 集合中插入一条记录（用于在登录时记录用户信息）：  

```js
const userList = db.collection('userList')
userList.add({
  data: {
    userName:"张三",
    userID:this.data.userID,
    // ...
  },
  success: function(res) {
    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    console.log(res);
  }
})
```

### 查询数据

在获取了集合的引用后，就可以通过 `where` 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。例如，这里我要查询数据库集合 `userList` 中 `userID` 等于 `this.data.userID` 的记录：  

```js
const userList = db.collection('userList')
userList.where({
  userID:this.data.userID
}).get({
  success: function(res) {
    // 输出 [{ "title": "The Catcher in the Rye", ... }]
    console.log(res)
  }
})
```

或者我们要获取 `articleList` 集合中所有 `type` 值为 `1` 的记录（也就是经验贴）：  

```js
const articleList = db.collection('articleList')
articleList.where({
  type:1
}).get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res)
  }
})
```

`where` 方法接收一个对象参数，该对象中每个字段和它的值构成一个需满足的匹配条件，各个字段间的关系是 "与" 的关系，即需同时满足这些匹配条件，在这个例子中，就是查询出 `articleList` 集合中 `authorID`  等于 `this.data.userID` 且 `type` 等于 `1` 的记录（也就是文章数据库中所有由此位用户发布的经验贴）。  

```js
const articleList = db.collection('articleList')
articleList.where({
  authorID:this.data.userID,
  type:1
}).get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res)
  }
})
```

如果要获取一个集合的数据，比如获取 `articleList` 集合上的所有记录，可以在集合上调用 get 方法获取，但通常不建议这么使用，小程序不允许我们一次获取过量数据，只应获取必要的数据。为了防止误操作以及保护小程序体验，小程序端在获取集合数据时服务器一次默认并且最多返回 **20** 条记录，云函数端这个数字则是 **100**。开发者可以通过 **limit** 方法指定需要获取的记录数量，但小程序端**不能**超过 20 条，云函数端不能超过 100 条。  

```js
db.collection('articleList').get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res.data)
  }
})
```

使用云函数可以分批次获取全部数据：  

```js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('articleList').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('articleList').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
```

### 查询指令

假设我们需要查询收藏数超过 30 的文章，那么传入对象表示**全等匹配**的方式就无法满足了，这时就需要用到查询指令。数据库 API 提供了大于、小于等多种查询指令，这些指令都暴露在 db.command 对象上。比如收藏数（`number`）超过 30 的文章：  

```js
const articleList = db.collection('articleList')
articleList.where({
  // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
  number: db.command.gt(30)
}).get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res)
  }
})
```

API 提供了以下查询指令：  

![1](https://jetzihan-img.oss-cn-beijing.aliyuncs.com/blog/20221008104535.png)  

除了指定一个字段满足一个条件之外，我们还可以通过指定一个字段需同时满足多个条件，比如用 and 逻辑指令查询点赞数在 30 和 70 之间的文章：  

```js
const articleList = db.collection('articleList')
articleList.where({
  // and 方法用于指定一个 "与" 条件，此处 _.and(_.gt(30), _.lt(70)) 
  //是一个 "大于 30 且小于 70" 的条件
  number: db.command.and(db.command.gt(30), db.command.lt(70))
}).get({
  success: function(res) {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    console.log(res)
  }
})
```

如果我们需要跨字段进行 "或" 操作，可以做到吗？答案是肯定的，`or` 指令还可以用来接受多个（可以多于两个）查询条件，表示需满足多个查询条件中的任意一个，比如我们点赞（number）小于或等于 50 或类型（type）为 1 的文章：  

```js
const _ = db.command
db.collection('todos').where(_.or([
  {
    progress: _.lte(50)
  },
  {
    type: _.eq(1)
  }
]))
.get({
  success: function(res) {
    console.log(res.data)
  }
})
```

### 更新数据

更新数据的 API 与查询数据的 API 类似，只是调用的是 update 方法，比如我们需要将集合(userList)中当前用户(`this.data.userID`)的收藏数（number）加1：  

```js
const db = wx.cloud.database()
const userList = db.collection('userList')
userList.where({
  _openid: this.data.userID
}).update({
  data: {
    // inc 方法用于指定一个自增
    number: db.command.inc(1)
  },
  success: function(res) {
    console.log(res.data)
  }
})
```

微信小程序云开发数据库 API 还提供了其他更新指令，比如：

![1](https://jetzihan-img.oss-cn-beijing.aliyuncs.com/blog/20221008105307.png)

`update` 字段只是局部刷新，如果需要将整个文档替换，可以使用 set 指令：  

```js
const db = wx.cloud.database()
const userList = db.collection('userList')
userList.where({
  _openid: this.data.userID
}).update({
  data: {
    // set 方法用于指定一个覆盖
    number: 15
    // ...
  },
  success: function(res) {
    console.log(res.data)
  }
})
```

### 删除数据

删除数据的 API 与查询数据的 API 类似，只是调用的是 remove 方法，比如我们需要将集合(userList)中当前用户(`this.data.userID`)的记录删除：  

```js
const db = wx.cloud.database()
const userList = db.collection('userList')
userList.where({
  userID: this.data.userID
}).remove({
  success: function(res) {
    console.log(res.data)
  }
})
```

## 云存储

云开发提供了一块存储空间，提供了上传文件到云端、带权限管理的云端下载能力，开发者可以在小程序端和云函数端通过 API 使用云存储功能。  

在小程序端可以分别调用 `wx.cloud.uploadFile` 和 `wx.cloud.downloadFile` 完成上传和下载云文件操作。下面简单的几行代码，即可实现在小程序内让用户选择一张图片，然后上传到云端管理的功能：  

```js
// 让用户选择一张图片
wx.chooseImage({
  success: chooseResult => {
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'my-photo.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: chooseResult.tempFilePaths[0],
      // 成功回调
      success: res => {
        console.log('上传成功', res)
      },
    })
  },
})
```

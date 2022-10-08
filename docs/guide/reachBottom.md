---
title: 触底分页加载的实现
date: 2022-10-06
---

# 触底分页加载的实现

实现触底加载，首先要在 js 文件的 `data` 中添加容器用于接收数据：  

```js
Page({
  data: {
    //...
    itemList: [],
  },
//...
```

接着，创建一个函数用于调用数据库，将数据添加到 `itemList` 中：  

```js
loadMethod: async function (aType) {
    let old_data = this.data.itemList;
    // console.log(old_data.length+"  "+count);
    if (isAll) {
        return "到底了";
    } else {
        return new Promise((resolve, reject) => {
        articleList
            .where({
            type: aType,
            })
            .skip(this.data.itemList.length)
            .get()
            .then((res) => {
            console.log(res.data);
            console.log(old_data.concat(res.data).length);
            if (old_data.concat(res.data).length===allLength){
                isAll=true;
            }
            allLength=old_data.concat(res.data).length;
            this.setData({
                itemList:old_data.concat(res.data)
            })
            // resolve(old_data.concat(res.data.data));
            });
        });
    }
},
```

在经验和问答页面已经写好，可以复制上面的代码。  

在页面顶部声明数据库，以及加载完成判定变量，缺一不可：  

```js
let count;
let db;
let articleList;
let allLength;
let isAll=false;
```

然后在 `onLoad` 函数中调用一次：  

```js
onLoad: async function (options) {
    wx.cloud.init();
    db = wx.cloud.database();
    articleList = db.collection("articleList");
    count = await db.collection("articleList").count();
    this.loadMethod(1);
},
```

在触底 API 中再次调用：  

```js
onReachBottom: async function () {
    db = wx.cloud.database();
    articleList = db.collection("articleList");
    count = await db.collection("articleList").count();
    await this.loadMethod(1);
},
```

`loadMethod` 接收一个参数，用于判断是加载经验还是问答。1 为经验，2 为问答。

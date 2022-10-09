---
title: 实现页面的复用
date: 2022-10-06
---
# 实现页面复用

在经验贴展示页面需要跳转到详情页面，就需要对详情页进行复用。  

## `wx:for` 列表携带数据

**理论** 在 wxml 中使用 `data-xx` 属性可以携带数据在 js 中可以通过 `e.currentTarget.dataset.xx` 获取到这个数据。  

即：  

```html
<view wx:for="{{item._id}}" wx:for-item="experience"  wx:key="xxx" data-item="{{item}}">
  <!-- ... -->
</view>
```

在 js 中可以通过 `e.currentTarget.dataset.item` 获取到这个数据。  

## 页面跳转携带数据

在计算机网络中，使用 GET 方法传递数据是不安全的，因为数据会暴露在 URL 中。但是我们也可以通过这个来传递数据。  

**理论** 在跳转页面时，可以在 URL 中携带数据。  

即：  

```js
wx.navigateTo({
  url: '/pages/experienceDetail/experienceDetail?data=' + this.data
})
```

结合上面的理论，我们可以在跳转页面时，将 `item` 数据携带在 URL 中。  

```js
Page({
  data: {
    // ...
  },
  onLoad: function (options) {
    // ...
  },
  onShow: function () {
    // ...
  },
  // ...
  toDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/detail/detail?item=' + JSON.stringify(item),
    })
  }
})
```

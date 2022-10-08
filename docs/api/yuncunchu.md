---
pageClass: 'yuncunchu'
---
# 云存储

## wx.cloud.uploadFile

`wx.cloud.uploadFile` 用于将用户小程序端的文件上传到云存储空间中。  

```js
wx.cloud.uploadFile({
  cloudPath: 'example.png', // 上传至云端的路径
  filePath: '', // 小程序临时文件路径
  success: res => {
    // 返回文件 ID
    console.log(res.fileID)
  },
  fail: console.error
})
```

上传成功后会获得文件唯一标识符，即文件 ID，后续操作都基于文件 ID 而不是 URL。  

## wx.cloud.downloadFile

`wx.cloud.downloadFile` 用于将云存储空间中的文件下载到用户小程序端。  

```js
wx.cloud.downloadFile({
  fileID: 'cloud://xxx.png', // 文件 ID
  success: res => {
    // 返回临时文件路径
    console.log(res.tempFilePath)
  },
  fail: console.error
})
```

# 代码规范

## 文档编写

编写代码时，需要随时记录问题，在 [本项目共享文档] 文件夹中 `姓名缩写.md` ,用于记录下面的内容：

1.查阅网络解决的问题，记录问题内容和解决方法  
2.页面的接口。所有列表渲染的数据都需要先使用 js 中的 data 进行模拟，将接口记录在文档中。

文档使用 Markdown 语法编写，语法详见[markdown 教程](https://markdown.com.cn/)

## 尺寸规范

使用 `rpx` 作为 css 尺寸单位。页面必须在 iPhone X、iPhone 12 Pro、iPhone6 上均测试通过。  
可参考 codefun 生成的定位代码。  
[codefun 教程](https://jetzihan.netlify.app/blog/jsdesigncodefun)

## 定位

严格使用 css 规范进行定位，除开必须使用的形状、样式等静态物体，其余(例如卡片、按钮）禁止使用 `fixed` 或者 `abosulute` 布局。

## 源代码托管

在某一工作告一段落后，必须提交到远程 git 分支。  
[微信 git 使用教程](https://jetzihan.netlify.app/docs/FrontEnd/WxMini/wxmini-git)

## 注释

代码中复杂的地方需要有良好的注释。

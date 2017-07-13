
# 电影资源（nodejs爬虫实践）

关注 “乐派电影” 微信公众号，获取更多高清电影资源。

![](https://raw.githubusercontent.com/leiroc/wipe/master/lp.jpg)

# BUG Fixed

> BY ydq

[https://github.com/ydq](https://github.com/ydq "ydq")

> 2016-08-03


- 修复reset方法会导致canvas直接全部被涂抹清空的问题
- 修复resetwipe不能绘制一个点的问题（触摸点击一下不移动产生的数据）
- 修改onswiping，回调新增了一个参数，可以获取最后一次涂抹的数据
- 优化合并部分逻辑判断
- 新增了一个可以同步显示涂抹的demo


> ==========


- 合并了 wipe.js 和 canvas.js
- fixed wipe_img bug

# wipe
Wipe是一款基于HTML5 canvas的移动端，涂抹，自动播放涂抹轨迹，刮刮乐的插件。可以轻松实现，涂抹，记录涂抹轨迹自动播放。


#1 使用说明

###html
	<div id="wipe"></div>
	<script src="../src/wipe.js"></script>
其中已经合并到 wipe.js中的 canvas.js是CanvasRenderingContext2D.prototype.扩展库。方便链式操作。
###css
	#wipe {
		margin: 10px auto;
		width: 300px;
		height: 430px;
		background: url(img/girl.jpg) no-repeat;
		background-size: 100% 100%;
	}
	canvas {
		opacity: 0.9;
	}

css其实只是指定canvas后面的世界，和canvas的大小；
>PS 需要指定宽度和高度
>
###js
	var wipe = new Wipe({
		el: '#wipe',
		fg: '#ccc',
		size: 50,
		debug: false,
		autoWipe: false,
		data: null,
		onswiping: function (percent) {
			//do something 涂抹回调函数
		}
	})

#2 演示 就是这么简单，开始玩起来吧！
###1、默认
[http://v5cy.cn:8088/git/wipe/demo/wipe_default.html](http://v5cy.cn:8088/git/wipe/demo/wipe_default.html)
###2、自动涂抹，需要生成轨迹
[http://v5cy.cn:8088/git/wipe/demo/auto_wipe.html](http://v5cy.cn:8088/git/wipe/demo/auto_wipe.html)
###3、涂抹图片
[http://v5cy.cn:8088/git/wipe/demo/wipe_img.html](http://v5cy.cn:8088/git/wipe/demo/wipe_img.html)

###4、实时演示
[http://v5cy.cn:8088/git/wipe/demo/wipe_sync.html](http://v5cy.cn:8088/git/wipe/demo/wipe_sync.html)



###轨迹生成方法：
打开debug，autoWipe=false，然后会在控制台输出数据轨迹，copy下来，放入 data中即可！

#网页小配件之时钟

[TOC]

##动机

- 今天在网上浪，想试试搜索引擎能不能找到自己在csdn博客上写的文章，于是打了一篇自己写过的文章的名称“网页小配件之日历"，发现。。。。没搜到，结果却搜到了有关实现时钟的文章上去了，看着时钟也挺有意思的，所以看了一波资料，学了一波原理后，也自己动手做一个。

##过程

### 结构——HTML
- 首先时钟作为一个整体用div定义，其中包括了时钟中心点、时钟数、时针、分针、秒针这些静态的显示元件，当然还有刻度也是静态的，但60根刻度线要一个一个写出来真是难为我胖虎了，所以它还是放到js文件里写吧(循环)。还可以看到下面时钟有个类名是clockbox，另一个是scale-2x，这里的clockbox用于在css中定义时钟的通用样式，而scale-2x则是时钟的大小，相同的还有scale-1x、scale-3x，这是我自己设计的3种大小规格的时钟，只要在clock的div中写上对应的类名即可。

```html
<div class="clockbox scale-2x" id="clock"> 
	<!-- 时钟中心点 -->  
	<div class="clockcenter"></div>  
	<!-- 时钟数 -->  
	<div class="clocknum">  
		<div class="num">12</div>  
		<div class="num">1</div>  
		<div class="num">2</div>  
		<div class="num">3</div>  
		<div class="num">4</div>  
		<div class="num">5</div>  
		<div class="num">6</div>  
		<div class="num">7</div>  
		<div class="num">8</div>  
		<div class="num">9</div>  
		<div class="num">10</div>  
		<div class="num">11</div>  
	</div>  
	<div class="hourhand" id="hourhand"></div>  <!--  时针 -->
	<div class="minutehand" id="minutehand"></div>  <!--  分针 -->
	<div class="secondhand" id="secondhand"></div>  <!--  秒针 -->
</div>
<script type="text/javascript" src="clock.js"></script>
```

###表现——CSS
- 首先，定义**时钟配件clockbox**的通用样式，包括字体，圆形边框；至于position属性的relative值是为时钟中的元件作准备的，relative使得它可以相对于自己的位置定位，成为非static元素，但这里又没有配合top/left属性进行定位，所以它还在原来的位置，但是它的子孙元素却可以通过将position的属性值定为absolute，来相对于时钟这个非static的最靠近的祖先元素进行定位，这样，当时钟这个配件移动到哪里，里面的小元件才会乖乖地跟到哪里。
```css
.scale-1x{font-size: 8px;width: 150px; height: 150px;border:10px solid black;box-shadow: 0px 0px 10px 1px #444 inset,0px 0px 10px 1px #444;}
.scale-2x{font-size: 10px;width: 250px; height: 250px;border:15px solid black;box-shadow: 0px 0px 15px 2px #444 inset,0px 0px 15px 1px #444;}
.scale-3x{font-size: 15px;width: 400px; height: 400px;border:20px solid black;box-shadow: 0px 0px 20px 3px #444 inset,0px 0px 20px 1px #444;}

.clockbox{ font-family: 'Microsoft Yahei',san-serif ; border-radius: 50%; position: relative;}
```
- **时钟数**便可以通过上面所说的将position设为absolute来相对于时钟框架进行定位，配合top和left的使用；而将高度、宽度、字体大小、行高设为百分比和em，当时钟在3种不同规格大小变化时，时钟数会相应跟着变化。
```css
/*时钟中心点*/
.clockcenter{ width: 5%; height: 5%; border-radius: 50%; background: #ff0000; top:47.5%; left: 47.5%; position: absolute;}
/*时钟数字*/
.num{ width: 10%; height: 10%; line-height: 1.6em;text-align: center; font-size: 1.5em; position: absolute;}
```
- **时钟刻度**总共有60根，所以在HTML中没有直接写出来，而是通过js循环造出来的，我们在CSS中先给它们定义样式；同样，相应的地方还是采用百分比和em；**clockscale**是从时钟中心点到时钟边框的**狭长的div**(相当于一根线)，因为刻度只在边缘才有，所以将这个狭长的div分成两部分，一个是**hiddenscale**不定义背景颜色(长)，相当于透明，一个是**displayscale**定义为深灰色背景(短)；至于**transform-origin**则是改变旋转元素的基点，默认值是50% 50% 0 (对应三个维度)，也就是它让旋转元素相应于它本身的中心转，但我们这里希望它是绕着一端来转，所以将它设置为0%，为下面的transform属性做准备。

```css
/*时钟刻度*/
.clockscale{width:50%;height:1px;transform-origin:0%;z-index:7;position:absolute;top:50%;left:50%;}
.hiddenscale{width:91.5%;height:1px;float:left;} 
.displayscale{ width:5%;height:1px;background-color:#555;float:left;}
```

- 时针、分针、秒针的样式与刻度类似，除了长度不一样。
```
/*时针、分针、秒针*/
.hourhand{width:25%;height:4px;background-color:black;transform-origin:0%;z-index:20;position:absolute;top:50%;left:50%;border-radius:2px;box-shadow:1px -3px 8px 3px #aaa;}
.minutehand{width:32.5%;height:2px;background-color:black;transform-origin:0%;z-index:20;position:absolute;top:50%;left:50%;border-radius:1px;box-shadow:1px -3px 8px 1px #aaa;}
.secondhand{width:42.5%;height:1px;background-color:red;transform-origin:0%;z-index:20;position:absolute;top:50%;left:50%;box-shadow:1px -3px 8px 1px #aaa;}
```


###行为——JavaScript

- 在显示时间之前，让我们先让时钟看起来像时钟，通过获取时钟的大小(因为有3种规格，所以我们需要知道当前的宽度是多少)从而来设置半径radius，至于**relativelength**则是相对长度，用于设置时钟数，当时钟数的类设置position为absolute时，就是相对于父元素clockbox的**左上角**进行定位，而relativelength就相当于时钟左边框到圆心的距离(不直接是半径，因为圆心也有高度和宽度)，然后就可以拿张纸，画个圆，构造三角形，用**正弦(sin)和余弦(cos)**求出top和left应设置为多少；至于刻度，我们只需要让生成的60根刻度线**根据编号**进行旋转就可以了，第一根从指向时钟数12开始，由于定义position使得它们的初始位置在时钟中是指向时钟数3，所以 i * 6度之后，还要减去90度。

- 通过HTML的getElementsByClassName()方法，可以对时钟数显示块进行调整：

```javascript
var clock = document.getElementById("clock");
function initClockLayout(){
	var radius = clock.clientWidth/2-clock.clientWidth/10;
	var relativelength = clock.clientWidth/2-clock.clientWidth/20;
	var rad = 2 * Math.PI  / 12;
	var dot = document.getElementsByClassName("num");
	for (var i = 0; i < dot.length; i++) {
		dot[i].style.left = (relativelength+Math.sin( (rad*i) ) * radius)+"px";
		dot[i].style.top = (relativelength-Math.cos( (rad*i) ) * radius)+"px";
	}
	for(var i = 0; i < 60; i++){
		clock.innerHTML += "<div class='clockscale'><div class='hiddenscale'></div><div class='displayscale'></div></div>"; 
	}
	var scale = document.getElementsByClassName("clockscale");
	for(var i = 0;  i < scale.length; i++){
		scale[i].style.transform = "rotate(" + (i * 6 - 90) +"deg)";
	}
}
initClockLayout();
```

- 要想显示时间，自然需要用到JavaScript的Date类，通过它的构造函数可以新建一个Date的实例，我们需要用到它的一些方法：包括
```javascript
	var my_date = new Date();
	var hour = my_date.getHours()；
	var minute = my_date.getMinutes();
	var second = my_date.getSeconds();
```
- 通过使用计时器来完成时钟动态变化，用setInterval( func, time )也可以，但它会因周期时间内没有执行完毕而出现异常，setTimeOut就不会；时针hourhand的旋转度数需要另外计算`hour数*30度-90度`得到整点的时针角度(*乘以30度是因为每个时钟数之间跨30度(360/12)，减去90度是因为初始位置是指向时钟数3的，需要减去90度拨回到指向时钟数12，即正中间*)，还要由`minute/12` 得到未整点的部分。
```javascript
var hourhand = document.getElementById("hourhand");
var minutehand = document.getElementById("minutehand");
var secondhand = document.getElementById("secondhand");
function updateTime(){
	var my_date = new Date();
	var hour = my_date.getHours(), minute = my_date.getMinutes(), second = my_date.getSeconds();
	// console.log("hour:"+hour); console.log("minute:"+minute); console.log("second:"+second);
	var hour_rotate = (hour * 30 - 90) + (Math.floor(minute / 12) * 6);
	hourhand.style.transform = "rotate(" + hour_rotate + "deg)";
	minutehand.style.transform = "rotate(" + (minute * 6 - 90) + "deg)";
	secondhand.style.transform = "rotate(" + (second * 6 - 90) + "deg)";
	setTimeout(updateTime, 1000);
}
setTimeout(updateTime, 1000);
```

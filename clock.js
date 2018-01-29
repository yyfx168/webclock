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
var canvas;
var con;
var starttime;
var counter = 0;

var view_bottom = 0;
var scrollspeed = 320/5/1000;

function scrY(wrdy){
	return canvas.height - 1 - wrdy + view_bottom;
}

function wrdY(scry){
	return canvas.height - 1 - scry + view_bottom;
}

function Thing(){
	this.x = 10;
	this.y = 50;
	this.w = 24;
	this.h = 24;
}

Thing.prototype.draw = function(){
	con.fillStyle = "red";
	con.fillRect(this.x, scrY(this.y), this.w, this.h);
}

var backimg = new Image();

var player = new Thing();

var update_delay = 10;
var draw_delay = 10;
var downkeys = [];

function keyDown(evt){
	downkeys[evt.keyCode] = true;
}

function keyUp(evt){
	downkeys[evt.keyCode] = false;
}

function realtime(){
	return (new Date()).getTime() - starttime;
}

var imagepaths = Object.freeze({
	background: "resources/background-24x24.png",
	ship: "resources/ship-24x24.png",
	greenenemy: "resources/greenenemy-24x24.png",
});

var images = {};
var imagesLoaded = 0;
var imageCount = 0;

function init(){
	loadImages();
}

var imageWaitInterval;

function loadImages(){
	for(imagehandle in imagepaths){
		images[imagehandle] = new Image();
		images[imagehandle].onload = function(){ imagesLoaded++; };
		images[imagehandle].src = imagepaths[imagehandle];
		imageCount++;
	}
	
	imageWaitInterval = window.setInterval("waitForImages()", 100);
}

function waitForImages(){	
	if(imagesLoaded == imageCount){
		window.clearInterval(imageWaitInterval);
		restOfInit();
	}
}

function restOfInit(){
	canvas = document.getElementById("can");
	con = canvas.getContext("2d");
	
	starttime = (new Date()).getTime();

	window.addEventListener("keydown", keyDown, true);
	window.addEventListener("keyup", keyUp, false);
	
	window.setInterval("update()", update_delay);
	window.setInterval("draw()", draw_delay);
}

function update(){
	while(counter < realtime()){
		view_bottom += scrollspeed*update_delay;
		
		if(downkeys[37]) player.x -= 0.2*update_delay;
		if(downkeys[39]) player.x += 0.2*update_delay;
		if(downkeys[38]) player.y += 0.2*update_delay;
		if(downkeys[40]) player.y -= 0.2*update_delay;
		player.y += scrollspeed*update_delay;
		
		counter += update_delay;
	}
	while(counter > realtime());
}

function draw(){
	con.fillStyle = "black";
	con.fillRect(0, 0, canvas.width, canvas.height);
	con.fillStyle = "red";
	
	var y;
	var back_start = wrdY(canvas.height-1);
	var back_end = wrdY(0);
	for(y = back_start; y <= back_end + 24; y += 24){
		var back_idx = Math.floor(y / 24);
		var scry = Math.round(scrY(back_idx*24+23));
		var i;
		for(i = 0; i < 10; i++){
			var real_idx = background.length - 1 - back_idx;
			if(real_idx >= 0){
				if(background[real_idx].charAt(i) == '1') con.drawImage(images.background, i*24, scry);
			}
		}
	}
	
	con.font = "10pt Monospace";
	con.fillText("real time " + realtime(), 10, 30);
	con.fillText("counter   " + counter, 10, 60);	
	
	player.draw();

}
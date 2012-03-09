"use strict";

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

var sh = {};

sh.counter = 0;

sh.view_bottom = 0;
sh.scrollspeed = 320 / 5 / 1000;

sh.scrY = function (world_y) {
	return sh.canvas.height - 1 - world_y + sh.view_bottom;
}

sh.wrdY = function (screen_y) {
	return sh.canvas.height - 1 - screen_y + sh.view_bottom;
}

sh.Thing = function () {
	this.x = 10;
	this.y = 50;
	this.w = 24;
	this.h = 24;
}

sh.Thing.prototype.draw = function () {
	if(this.image !== undefined) sh.con.drawImage(this.image, this.x, sh.scrY(this.y));
	else{
		sh.con.fillStyle = "red";
		sh.con.fillRect(this.x, sh.scrY(this.y), this.w, this.h);
	}
}

sh.player = new sh.Thing();

sh.update_delay = 10;
sh.draw_delay = 10;
sh.downkeys = [];

sh.keyDown = function(evt){
	sh.downkeys[evt.keyCode] = true;
}

sh.keyUp = function(evt){
	sh.downkeys[evt.keyCode] = false;
}

sh.realtime = function(){
	return (new Date()).getTime() - sh.starttime;
}

sh.imagepaths = Object.freeze({
	background: "resources/background-24x24.png",
	ship: "resources/ship-24x24.png",
	greenenemy: "resources/greenenemy-24x24.png",
	purplebullet: "resources/purplebullet-10x10.png",
	whitebullet: "resources/whitebullet-10x10.png"
});

sh.images = {};
sh.imagesLoaded = 0;
sh.imageCount = 0;

sh.init = function(){
	sh.loadImages();
}

sh.loadImages = function(){
	var imagehandle;
	for(imagehandle in sh.imagepaths){
		sh.images[imagehandle] = new Image();
		sh.images[imagehandle].onload = function(){ sh.imagesLoaded++; };
		sh.images[imagehandle].src = sh.imagepaths[imagehandle];
		sh.imageCount++;
	}
	
	sh.imageWaitInterval = window.setInterval("sh.waitForImages()", 100);
}

sh.waitForImages = function(){
	if(sh.imagesLoaded === sh.imageCount){
		window.clearInterval(sh.imageWaitInterval);
		Object.freeze(sh.images);
		sh.restOfInit();
	}
}

sh.restOfInit = function(){
	sh.canvas = document.getElementById("can");
	sh.con = sh.canvas.getContext("2d");
	
	sh.starttime = (new Date()).getTime();

	window.addEventListener("keydown", sh.keyDown, true);
	window.addEventListener("keyup", sh.keyUp, false);
	
	window.setInterval("sh.update()", sh.update_delay);
	window.setInterval("sh.draw()", sh.draw_delay);
	
	sh.player.image = sh.images.ship;
}

sh.update = function(){
	while(sh.counter < sh.realtime()){
		sh.view_bottom += sh.scrollspeed*sh.update_delay;
		
		if(sh.downkeys[37]) sh.player.x -= 0.2*sh.update_delay;
		if(sh.downkeys[39]) sh.player.x += 0.2*sh.update_delay;
		if(sh.downkeys[38]) sh.player.y += 0.2*sh.update_delay;
		if(sh.downkeys[40]) sh.player.y -= 0.2*sh.update_delay;
		sh.player.y += sh.scrollspeed*sh.update_delay;
		
		sh.counter += sh.update_delay;
	}
	while(sh.counter > sh.realtime());
}

sh.draw = function(){
	sh.con.fillStyle = "black";
	sh.con.fillRect(0, 0, sh.canvas.width, sh.canvas.height);
	sh.con.fillStyle = "red";
	
	var y;
	var back_start = sh.wrdY(sh.canvas.height-1);
	var back_end = sh.wrdY(0);
	for(y = back_start; y <= back_end + 24; y += 24){
		var back_idx = Math.floor(y / 24);
		var screeny = Math.round(sh.scrY(back_idx*24+23));
		var i;
		for(i = 0; i < 10; i++){
			var real_idx = sh.background.length - 1 - back_idx;
			if(real_idx >= 0){
				if(sh.background[real_idx].charAt(i) === '1') sh.con.drawImage(sh.images.background, i*24, screeny);
			}
		}
	}
	
	sh.con.font = "10pt Monospace";
	sh.con.fillText("real time " + sh.realtime(), 10, 30);
	sh.con.fillText("counter   " + sh.counter, 10, 60);	
	
	sh.player.draw();

}

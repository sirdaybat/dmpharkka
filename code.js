"use strict";

var sh = {};

sh.gameObjectTypes = Object.freeze({
    unidentified : 0,
    playerShip : 100,
    enemy : 200,
    playerBullet : 300,
    enemyBullet : 400
});

sh.gameObject = {
    type : sh.gameObjectTypes.unidentified,
    x : 100,
    y : 100,
    width : 50,
    height : 50,
    update : function(){}
};

sh.scrY = function (world_y) {
	return sh.canvas.height - 1 - world_y + sh.view_bottom;
}

sh.wrdY = function (screen_y) {
	return sh.canvas.height - 1 - screen_y + sh.view_bottom;
}

sh.player = Object.create(sh.gameObject);
sh.player.update = function(){
	if(sh.downkeys[37]) this.x -= 0.2*sh.update_delay;
	if(sh.downkeys[39]) this.x += 0.2*sh.update_delay;
	if(sh.downkeys[38]) this.y += 0.2*sh.update_delay;
	if(sh.downkeys[40]) this.y -= 0.2*sh.update_delay;
	this.y += sh.scrollspeed*sh.update_delay;
}

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

sh.init = function(){
	sh.images = {};
	sh.imagesLoaded = 0;
	sh.imageCount = 0;
	sh.loadImages();
}

sh.loadImages = function(){
	for(var imagehandle in sh.imagepaths){
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
	
	sh.gametime = 0;
	sh.view_bottom = 0;
	sh.scrollspeed = 320 / 5 / 1000;
	sh.update_delay = 10;
	sh.draw_delay = 10;
	sh.downkeys = [];
	sh.enemies = [];
	
	var testenemy = Object.create(sh.gameObject);
	testenemy.x = 0;
	testenemy.y = 100;
	testenemy.type = sh.gameObjectTypes.enemy;
	testenemy.update = function(){
		this.x = sh.player.x + Math.cos(sh.gametime*0.004)*50;
		this.y = sh.player.y + Math.sin(sh.gametime*0.004)*50;
	}
	sh.enemies.push(testenemy);

	window.addEventListener("keydown", sh.keyDown, true);
	window.addEventListener("keyup", sh.keyUp, false);
	
	window.setInterval("sh.update()", sh.update_delay);
	window.setInterval("sh.draw()", sh.draw_delay);
}

sh.update = function(){
	while(sh.gametime < sh.realtime()){
		sh.view_bottom += sh.scrollspeed*sh.update_delay;
		
		sh.player.update();
		for(var eidx in sh.enemies) sh.enemies[eidx].update();
		
		sh.gametime += sh.update_delay;
	}
	while(sh.gametime > sh.realtime());
}

sh.draw = function(){
	sh.con.fillStyle = "black";
	sh.con.fillRect(0, 0, sh.canvas.width, sh.canvas.height);
	sh.con.fillStyle = "red";
	
	var back_start = sh.wrdY(sh.canvas.height-1);
	var back_end = sh.wrdY(0);
	for(var y = back_start; y <= back_end + 24; y += 24){
		var back_idx = Math.floor(y / 24);
		var screeny = Math.round(sh.scrY(back_idx*24+23));
		for(var i = 0; i < 10; i++){
			var real_idx = sh.leveldata.length - 1 - back_idx;
			if(real_idx >= 0){
				if(sh.leveldata[real_idx][0].charAt(i) === '1') sh.con.drawImage(sh.images.background, i*24, screeny);
			}
		}
	}
	
	sh.con.font = "10pt Monospace";
	sh.con.fillText("real time " + sh.realtime(), 10, 30);
	sh.con.fillText("gametime   " + sh.gametime, 10, 60);	
	
	sh.con.drawImage(sh.images.ship, sh.player.x, sh.scrY(sh.player.y));
	for(var idx in sh.enemies){
		var enemyship = sh.enemies[idx];
		sh.con.drawImage(sh.images.greenenemy, enemyship.x, sh.scrY(enemyship.y));
	}

}

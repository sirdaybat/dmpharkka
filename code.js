"use strict";

var sh = {};

sh.gameObjectTypes = Object.freeze({
    unidentified : 0,
    playerShip : 100,
    enemy : 200,
    playerBullet : 300,
    enemyBullet : 400
});

sh.none = function () {};

// helper function: allows using object literals with prototypes
sh.pCreate = function(prototype, object) {
  var newObject = Object.create(prototype);
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      newObject[prop] = object[prop];
    }
  }
  return newObject;
};

// gameObject

sh.gameObject = {
    //type : sh.gameObjectTypes.unidentified,
    x : 100,
    y : 100,
    width : 24,
    height : 24
};

// enemy

sh.enemy = sh.pCreate(sh.gameObject, {
    hitpoints : 100
});

// fastEnemy

sh.fastEnemy = sh.pCreate(sh.enemy, {
    update : function () { this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.002) + 1) * 0.5 * (sh.canvas.width - this.width); }
});

sh.createFastEnemy = function(){
	var new_enemy = Object.create(sh.fastEnemy);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.lifestarttime = sh.gametime;
	sh.enemies.push(new_enemy);
}

// slowEnemy

sh.slowEnemy = sh.pCreate(sh.enemy, {
    update : function () { this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.001) + 1) * 0.5 * (sh.canvas.width - this.width); },
    hitpoints : 200
});

sh.createSlowEnemy = function(){
	var new_enemy = Object.create(sh.slowEnemy);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.lifestarttime = sh.gametime;
	sh.enemies.push(new_enemy);
}

// player bullet
sh.playerBullet = sh.pCreate(sh.gameObject, {
    damage : 100
});

sh.doWorldRectsCollide = function(rect0, rect1){
	var outsideLeftOrDown = function(rc0, rc1){
		return rc0.r < rc1.l || rc0.u < rc1.d;
	}
	return !(outsideLeftOrDown(rect0, rect1) || outsideLeftOrDown(rect1, rect0));
}

sh.gameObjectRect = function(obj){
	return {
		l : obj.x,
		r : obj.x + obj.width - 1,
		u : obj.y,
		d : obj.y - obj.height + 1
	};
}

sh.doGameObjectsCollide = function(obj0, obj1){
	return sh.doWorldRectsCollide(sh.gameObjectRect(obj0), sh.gameObjectRect(obj1));
}

sh.scrY = function(world_y){
	return sh.canvas.height - 1 - world_y + sh.view_bottom;
}

sh.wrdY = function(screen_y){
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
	sh.update_delay = 30;
	sh.draw_delay = 30;
	sh.downkeys = [];
	sh.enemies = [];
	sh.last_executed_level_line = -1;
	
	sh.playerCollides = false;

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
		
		var level_line_to_execute = Math.floor((sh.view_bottom + sh.canvas.height) / 24) + 1;
		while(sh.last_executed_level_line < level_line_to_execute){
			sh.last_executed_level_line++;
			
			var real_idx = sh.leveldata.length - 1 - sh.last_executed_level_line;
			if(real_idx >= 0) sh.leveldata[real_idx][1]();
		}
		
		for(var idx = 0; idx < sh.enemies.length; idx++){
			var enemy = sh.enemies[idx];
			if(enemy.x + enemy.width < -2*24 || enemy.x > sh.canvas.width + 2*24 ||
				enemy.y < sh.view_bottom - 2*24 || enemy.y - enemy.height > sh.view_bottom + sh.canvas.height + 2*24){
				sh.enemies.splice(idx, 1);
			}
		}
		
		sh.playerCollides = false;
		for(var idx in sh.enemies){
			if(sh.doGameObjectsCollide(sh.player, sh.enemies[idx])){
				sh.playerCollides = true;
				break;
			}
		}
		
		
		sh.gametime += sh.update_delay;
	}
	while(sh.gametime > sh.realtime());
}

sh.draw = function(){
	sh.con.fillStyle = "black";
	sh.con.fillRect(0, 0, sh.canvas.width, sh.canvas.height);
	sh.con.fillStyle = "red";
	
	var back_start = sh.wrdY(sh.canvas.height - 1);
	var back_end = sh.wrdY(0);
	var back_idx = Math.floor(Math.round(back_start) / 24);
	for(var y = back_start; y <= back_end + 24; y += 24){
		var screeny = Math.round(sh.scrY(back_idx*24 + 23));
		for(var i = 0; i < 10; i++){
			var real_idx = sh.leveldata.length - 1 - back_idx;
			if(real_idx >= 0){
				if(sh.leveldata[real_idx][0].charAt(i) === '1') sh.con.drawImage(sh.images.background, i*24, screeny);
			}
		}
		back_idx++;
	}
	
	sh.con.font = "10pt Monospace";
	sh.con.fillText("real time " + sh.realtime(), 10, 30);
	sh.con.fillText("gametime   " + sh.gametime, 10, 60);
	sh.con.fillText("num of enemies " + sh.enemies.length, 10, 90);
	
	sh.con.drawImage(sh.images.ship, sh.player.x, sh.scrY(sh.player.y));
	if(sh.playerCollides) sh.con.fillRect(sh.player.x, sh.scrY(sh.player.y), sh.player.width, sh.player.height);
	for(var idx in sh.enemies){
		var enemyship = sh.enemies[idx];
		sh.con.drawImage(sh.images.greenenemy, enemyship.x, sh.scrY(enemyship.y));
	}

}

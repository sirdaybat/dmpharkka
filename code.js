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
    update : function () { this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.002) + 1) * 0.5 * (sh.canvas.width - this.width);},
	image : 'greenenemy'
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
    update : function () {
		this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.001) + 1) * 0.5 * (sh.canvas.width - this.width);
		if(sh.gametime - this.last_shot > 800){
			sh.createEnemyBullet(this.x + this.width * 0.5 - 5, this.y - this.height);
			this.last_shot = sh.gametime;
		}
	},
    hitpoints : 200,
	image : 'greenenemy'
});

sh.createSlowEnemy = function(){
	var new_enemy = Object.create(sh.slowEnemy);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.lifestarttime = sh.gametime;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}

// player bullet
sh.playerBullet = sh.pCreate(sh.gameObject, {
	update : function () { this.y += (sh.scrollspeed + 0.3) * sh.update_delay; },
    damage : 100,
	width : 10,
	height : 10,
	image : 'whitebullet'
});

sh.createPlayerBullet = function(x, y){
	var new_bullet = Object.create(sh.playerBullet);
	new_bullet.x = x;
	new_bullet.y = y;
	sh.player_bullets.push(new_bullet);
}

// enemy bullet
sh.enemyBullet = sh.pCreate(sh.gameObject, {
	update : function () { this.y -= 0.2 * sh.update_delay; },
	width : 10,
	height : 10,
	image : 'purplebullet'
});

sh.createEnemyBullet = function(x, y){
	var new_bullet = Object.create(sh.enemyBullet);
	new_bullet.x = x;
	new_bullet.y = y;
	sh.enemy_bullets.push(new_bullet);
}

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

sh.updateObjects = function(objlist){
	for(var idx in objlist) objlist[idx].update();
}

sh.removeOutOfScreenObjects = function(objlist){
	for(var idx = 0; idx < objlist.length; idx++){
		var obj = objlist[idx];
		if(obj.x + obj.width < -2*24 || obj.x > sh.canvas.width + 2*24 ||
			obj.y < sh.view_bottom - 2*24 || obj.y - obj.height > sh.view_bottom + sh.canvas.height + 2*24){
			
			objlist.splice(idx, 1);
		}
	}
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
	
	if(this.x < 0) this.x = 0;
	if(this.x > sh.canvas.width - this.width) this.x = sh.canvas.width - this.width;
	if(this.y < sh.view_bottom + this.height - 1) this.y = sh.view_bottom + this.height - 1;
	if(this.y > sh.view_bottom + sh.canvas.height - 1) this.y = sh.view_bottom + sh.canvas.height - 1;
	
	if(sh.gametime - sh.player.last_shot >= 400){
		sh.createPlayerBullet(this.x + this.width * 0.5 - 5, this.y + 10);
		
		this.last_shot = sh.gametime;
	}
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

sh.game_init = function(){
	sh.canvas = document.getElementById("can");
	sh.con = sh.canvas.getContext("2d");
	
	sh.images = {};
	sh.imagesLoaded = 0;
	sh.imageCount = 0;
	sh.loadImages();
}

sh.round_init = function(){
	sh.scrollspeed = 320 / 5 / 1000;
	sh.update_delay = 30;
	sh.draw_delay = 30;
	
	sh.player.x = sh.canvas.width * 0.5 - sh.player.width * 0.5;
	sh.player.y = 24 + sh.player.height;
	sh.player.last_shot = -1;
	
	sh.player_lives = 1;
	sh.player_is_immortal = false;
	sh.player_immortal_starttime = -1;
	sh.immortality_duration = 1000;
	
	sh.playerCollides = false;
	
	sh.downkeys = [];
	sh.enemies = [];
	sh.enemy_bullets = [];
	sh.player_bullets = [];
	sh.last_executed_level_line = -1;
	sh.gametime = 0;
	sh.view_bottom = 0;
	sh.starttime = (new Date()).getTime();
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
	sh.round_init();
	
	window.addEventListener("keydown", sh.keyDown, true);
	window.addEventListener("keyup", sh.keyUp, false);
	
	window.setInterval("sh.update()", sh.update_delay);
	window.setInterval("sh.draw()", sh.draw_delay);
}

sh.update = function(){
	while(sh.gametime < sh.realtime()){
		sh.view_bottom += sh.scrollspeed*sh.update_delay;
		
		sh.updateObjects(sh.enemies);
		sh.updateObjects(sh.player_bullets);
		sh.updateObjects(sh.enemy_bullets);
		
		var level_line_to_execute = Math.floor((sh.view_bottom + sh.canvas.height) / 24) + 1;
		while(sh.last_executed_level_line < level_line_to_execute){
			sh.last_executed_level_line++;
			
			var real_idx = sh.leveldata.length - 1 - sh.last_executed_level_line;
			if(real_idx >= 0) sh.leveldata[real_idx][1]();
		}
		
		sh.removeOutOfScreenObjects(sh.enemies);
		sh.removeOutOfScreenObjects(sh.player_bullets);
		sh.removeOutOfScreenObjects(sh.enemy_bullets);
		
		sh.playerCollides = false;
		for(var idx in sh.enemies){
			if(sh.doGameObjectsCollide(sh.player, sh.enemies[idx])){
				sh.playerCollides = true;
				break;
			}
		}
		if(!sh.playerCollides){
			for(var idx in sh.enemy_bullets){
				if(sh.doGameObjectsCollide(sh.player, sh.enemy_bullets[idx])){
					sh.playerCollides = true;
					break;
				}
			}
		}
		
		if(sh.player_lives >= 0){
			sh.player.update();
			
			if(sh.playerCollides && !sh.player_is_immortal){
				sh.player_is_immortal = true;
				sh.player_immortal_starttime = sh.gametime;
				sh.player_lives--;
			}
			
			if(sh.player_is_immortal && sh.gametime - sh.player_immortal_starttime > sh.immortality_duration){
				sh.player_is_immortal = false;
			}
		}
		else{
			if(sh.downkeys[13]){
				sh.round_init();
				return;
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
	
	for(var idx in sh.enemies){
		var enemyship = sh.enemies[idx];
		sh.con.drawImage(sh.images[enemyship.image], enemyship.x, sh.scrY(enemyship.y));
	}
	
	for(var idx in sh.player_bullets){
		var bullet = sh.player_bullets[idx];
		sh.con.drawImage(sh.images[bullet.image], bullet.x, sh.scrY(bullet.y));
	}
	
	for(var idx in sh.enemy_bullets){
		var bullet = sh.enemy_bullets[idx];
		sh.con.drawImage(sh.images[bullet.image], bullet.x, sh.scrY(bullet.y));
	}
	

    sh.con.fillStyle = "rgba(255, 255, 255, 0.8)";
	sh.con.font = "10pt Monospace";
	
	sh.con.fillText("real time " + sh.realtime(), 10, 60);
	sh.con.fillText("gametime   " + sh.gametime, 10, 75);
	sh.con.fillText("num of enemies " + sh.enemies.length, 10, 90);
	sh.con.fillText("num of playerbullets " + sh.player_bullets.length, 10, 105);
	sh.con.fillText("num of enemybullets " + sh.enemy_bullets.length, 10, 120);
	
	if(sh.player_lives >= 0){
		sh.con.font = "12pt Monospace";
		sh.con.fillText("Lives: " + sh.player_lives, 12, 24);
		
		if(!sh.player_is_immortal || Math.floor(sh.gametime / 100) % 2 == 0){
			sh.con.drawImage(sh.images.ship, sh.player.x, sh.scrY(sh.player.y));
		}
	}
	else{
		sh.con.font = "24pt Monospace";
		sh.con.fillText("GAME OVER", 36, sh.canvas.height*0.5);
		sh.con.font = "12pt Monospace";
		sh.con.fillText("PRESS ENTER TO RESTART", 12, sh.canvas.height*0.5 + 24 + 12);
	}
}

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

// pad number with leading zeros for presentation
sh.pad = function(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

sh.setScrollSpeed = function(factor) {
	// default speed 320 vert pixels in 5 seconds
	sh.scrollspeed = factor * 320 / 5 / 1000;
}

// collision handler
sh.collisions = {
	funcs : [],
	register : function (type, otherType, func) {
		this.funcs.push([type, otherType, func]);
	},
	handle : function (object, otherObject) {
		if (object.type && otherObject.type)
		{
			this.funcs.forEach(function (value, index, arr) {
			if (value[0] === object.type && value[1] === otherObject.type)
			{
				value[2](object, otherObject);
			}
			else if (value[1] === object.type && value[0] === otherObject.type)
			{
				value[2](otherObject, object);
			}
			});
		}
	}
};

sh.collisions.register("enemy", "playerBullet", function (enemy, playerBullet) {
	enemy.hitpoints -= playerBullet.damage;
	if (enemy.hitpoints <= 0)
		enemy.die();
	playerBullet.die();
});

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
	type : 'enemy',
	hitpoints : 100,
	die : function() {
		sh.enemies[sh.enemies.indexOf(this)] = undefined;
	}
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
	die : function() {
		sh.player_bullets[sh.player_bullets.indexOf(this)] = undefined;
	},
	type : 'playerBullet',
	damage : 50,
	width : 10,
	height : 10,
	image : 'whitebullet'
});

sh.createPlayerBullet = function(x, y){
	var new_bullet = Object.create(sh.playerBullet);
	new_bullet.x = x;
	new_bullet.y = y;
	sh.player_bullets.push(new_bullet);
	sh.current_score++;
}

// enemy bullet
sh.enemyBullet = sh.pCreate(sh.gameObject, {
	update : function () { this.y -= 0.2 * sh.update_delay; },
	type : 'enemyBullet',
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

// triggers, persistent game events

sh.gameEvent = {
	lifetime : -1,
	update : function() {
		if (this.lifetime > 0)
			this.lifetime--;
		if (this.lifetime === 0)
		{
			this.atEnd();
			sh.running_events[sh.running_events.indexOf(this)] = undefined;
		}
		this.onTick();
	},
	end : function() {this.lifetime = 0;},
	onStart : function(){},
	onTick : function(){},
	atEnd : function(){},
	drawTopLayer : function(){},
	drawBottomLayer : function(){}
}

sh.evt = function(evt) {
	var newEvent = sh.pCreate(sh.gameEvent, evt);
	sh.running_events.push(newEvent);
	sh.running_events[sh.running_events.indexOf(newEvent)].onStart();
}

sh.delay = function(delayTicks, evt) {
	sh.delayed_events.push([sh.pCreate(sh.gameEvent, evt), delayTicks]);
}

sh.showTextEvent = function (text, x, y) {
	return {
	lifetime : 60,
	drawTopLayer : function() {
		sh.con.fillStyle = "rgba(0, 255, 255, 0.8)";
		sh.con.font = "8pt Monospace";
		sh.con.fillText(text, x, y);
	}
	};
}

sh.scrollSpeedModEvent = function(factor) {
	return {
	lifetime : 180,
	onStart : function () {
		sh.setScrollSpeed(factor);
	},
	atEnd : function () {
		sh.setScrollSpeed(1);
	}
	};
}

sh.winGameEvent = {
	lifetime : 240,
	onStart : function() {
		sh.evt(sh.showTextEvent("U R the winner maximum!!1!", 30, 160));
		sh.delay(130, sh.showTextEvent("U haz lives left? MOAR POINTS", 30, 160));
	},
	atEnd : function() {
		sh.gameOver = true;
		sh.victory = true;
	}
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
	if (obj0 && obj1)
		return sh.doWorldRectsCollide(sh.gameObjectRect(obj0), sh.gameObjectRect(obj1));
	return false;
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
			idx--;
		}
	}
}

sh.scrY = function(world_y){
	return sh.canvas.height - 1 - world_y + sh.view_bottom;
}

sh.wrdY = function(screen_y){
	return sh.canvas.height - 1 - screen_y + sh.view_bottom;
}

sh.player = sh.pCreate(sh.gameObject, {
	image : 'ship',
	type : 'player',
	shotInterval : 200,
	update : function(){
		if(sh.downkeys[37]) this.x -= 0.2*sh.update_delay;
		if(sh.downkeys[39]) this.x += 0.2*sh.update_delay;
		if(sh.downkeys[38]) this.y += 0.2*sh.update_delay;
		if(sh.downkeys[40]) this.y -= 0.2*sh.update_delay;
		this.y += sh.scrollspeed*sh.update_delay;
	
		if(this.x < 0) this.x = 0;
		if(this.x > sh.canvas.width - this.width) this.x = sh.canvas.width - this.width;
		if(this.y < sh.view_bottom + this.height - 1) this.y = sh.view_bottom + this.height - 1;
		if(this.y > sh.view_bottom + sh.canvas.height - 1) this.y = sh.view_bottom + sh.canvas.height - 1;
	

		if(sh.gametime - this.last_shot >= this.shotInterval){
			sh.createPlayerBullet(this.x + this.width * 0.5 - 5, this.y + 10);
			this.last_shot = sh.gametime;
		}
	}
});

sh.changeScaling = function(factor){
	sh.scale_factor = factor;
	if(sh.scale_factor < 1) sh.scale_factor = 1;
	sh.canvas.setAttribute("style", "position:relative; width:" +
		sh.scale_factor*240 + "px; height:" +
		sh.scale_factor*320 + "px; image-rendering:-moz-crisp-edges; cursor:none");
}

sh.keyDown = function(evt){
	sh.downkeys[evt.keyCode] = true;
	if(evt.keyCode === 33) sh.changeScaling(sh.scale_factor + 1);
	if(evt.keyCode === 34) sh.changeScaling(sh.scale_factor - 1);
}

sh.keyUp = function(evt){
	sh.downkeys[evt.keyCode] = false;
}

sh.mouseMove = function(evt){
	if(evt.layerX){
		sh.mouseX = Math.floor(evt.layerX / sh.scale_factor);
		sh.mouseY = Math.floor(evt.layerY / sh.scale_factor);
	}
	else if(evt.offsetX){
		sh.mouseX = Math.floor(evt.offsetX / sh.scale_factor);
		sh.mouseY = Math.floor(evt.offsetY / sh.scale_factor);
	}
}

sh.mouseDown = function(evt){
	sh.mouseMove(evt);
	sh.is_mouse_down = true;
}

sh.mouseUp = function(evt){
	sh.mouseMove(evt);
	sh.is_mouse_down = false;
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

	sh.update_delay = 20;
	sh.draw_delay = 20;
	sh.downkeys = [];
	sh.is_mouse_down = false;
	sh.mouseX = 0;
	sh.mouseY = 0;
	sh.scale_factor = 2;

	sh.high_score = 0;
}

sh.round_init = function(){
	sh.setScrollSpeed(1);
	
	sh.player.x = sh.canvas.width * 0.5 - sh.player.width * 0.5;
	sh.player.y = 24 + sh.player.height;
	sh.player.last_shot = -1;
	
	sh.player_lives = 666;
	sh.current_score = 0;
	sh.player_is_immortal = false;
	sh.player_immortal_starttime = -1;
	sh.immortality_duration = 1000;
	
	sh.gameOver = false;
	sh.victory = false;

	sh.playerCollides = false;

	sh.enemies = [];
	sh.enemy_bullets = [];
	sh.player_bullets = [];
	sh.running_events = [];
	sh.delayed_events = [];
	sh.last_executed_level_line = -1;
	sh.gametime = 0;
	sh.view_bottom = 0;
	sh.mouse_draw_points = [[0, 0]];
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
	
	window.addEventListener("keydown", sh.keyDown, false);
	window.addEventListener("keyup", sh.keyUp, false);

	sh.canvas.addEventListener("mousemove", sh.mouseMove, false);
	window.addEventListener("mousedown", sh.mouseDown, false);
	window.addEventListener("mouseup", sh.mouseUp, false);

	
	window.setInterval("sh.update()", sh.update_delay);
	window.setInterval("sh.draw()", sh.draw_delay);
}

sh.update = function(){
	var idxplayer, idxenemy, idxpb, idxeb; // loop vars

	while(sh.gametime < sh.realtime()){
		sh.view_bottom += sh.scrollspeed*sh.update_delay;
		
		sh.updateObjects(sh.enemies);
		sh.updateObjects(sh.player_bullets);
		sh.updateObjects(sh.enemy_bullets); 
		sh.updateObjects(sh.running_events); 

		// unshelf delayed events
		for (var idx in sh.delayed_events) {
			sh.delayed_events[idx][1]--;
			if (sh.delayed_events[idx][1] === 0)
			{
				sh.evt(sh.delayed_events[idx][0]);
				sh.delayed_events[idx] = undefined;
			}
		}
		
		var level_line_to_execute = Math.floor((sh.view_bottom + sh.canvas.height) / 24) + 1;
		while(sh.last_executed_level_line < level_line_to_execute){
			sh.last_executed_level_line++;
			
			var real_idx = sh.leveldata.length - 1 - sh.last_executed_level_line;
			if(real_idx >= 0) sh.leveldata[real_idx][1]();
		}
		
		sh.removeOutOfScreenObjects(sh.enemies);
		sh.removeOutOfScreenObjects(sh.player_bullets);
		sh.removeOutOfScreenObjects(sh.enemy_bullets);
		
		// run collision checks
		
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
		
		for(idxenemy in sh.enemies){
			for(idxpb in sh.player_bullets){
				try {
				if(sh.doGameObjectsCollide(sh.enemies[idxenemy], sh.player_bullets[idxpb]))
				{
					sh.collisions.handle(sh.enemies[idxenemy], sh.player_bullets[idxpb]);
				}
				} catch (err) {
					//alert("length: " + sh.enemies.length + " index: " + idxenemy + " obj: " + sh.enemies[idxenemy]);// + sh.player_bullets[idxpb]);
				}
			}
		}
		sh.enemies = sh.enemies.filter(function(val){return !!val;});
		sh.enemy_bullets = sh.enemy_bullets.filter(function(val){return !!val;});
		sh.player_bullets = sh.player_bullets.filter(function(val){return !!val;});
		sh.running_events = sh.running_events.filter(function(val){return !!val;});
		sh.delayed_events = sh.delayed_events.filter(function(val){return !!val;});
		
		if(!sh.gameOver){
			sh.player.update();
			
			if(sh.playerCollides && !sh.player_is_immortal){
				sh.player_is_immortal = true;
				sh.player_immortal_starttime = sh.gametime;
				sh.player_lives--;
				if(sh.player_lives < 0)
				{
					sh.gameOver = true;
					if(sh.high_score < sh.current_score)
					{
						sh.high_score = sh.current_score;
						sh.current_score = -1;
					}
				}
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

		if(sh.is_mouse_down) sh.mouse_draw_points[1] = [sh.mouseX, sh.mouseY];
		else sh.mouse_draw_points = [[sh.mouseX, sh.mouseY]];
		
		
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
	
	for(var idx in sh.running_events){
		sh.running_events[idx].drawBottomLayer();
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

	for(var idx in sh.running_events){
		sh.running_events[idx].drawTopLayer();
	}

	if(sh.player_lives >= 0){

		if(!sh.player_is_immortal || Math.floor(sh.gametime / 100) % 2 === 0){
			sh.con.drawImage(sh.images.ship, sh.player.x, sh.scrY(sh.player.y));
		}
		var mousepts = sh.mouse_draw_points.length;
		if(mousepts > 1){
			var pt0 = sh.mouse_draw_points[0];
			var pt1 = sh.mouse_draw_points[1];
			var angle = Math.atan2(pt1[1] - pt0[1], pt1[0] - pt0[0]);
			sh.con.fillStyle = "red";
			sh.con.beginPath();
			sh.con.arc(pt0[0], pt0[1], 20, angle + Math.PI*0.5, angle - Math.PI*0.5, false);
			sh.con.arc(pt1[0], pt1[1], 20, angle - Math.PI*0.5, angle + Math.PI*0.5, false);
			sh.con.globalAlpha = 0.4;
			sh.con.fill();
			sh.con.globalAlpha = 1;
		}

		sh.con.strokeStyle = "red";
		sh.con.beginPath();
		sh.con.arc(sh.mouse_draw_points[mousepts - 1][0], sh.mouse_draw_points[mousepts - 1][1], 20, 0, Math.PI*2, false);
		sh.con.stroke();

	}

	sh.con.fillStyle = "rgba(255, 255, 255, 0.8)";
	sh.con.font = "8pt Monospace";
	
	sh.con.fillText("real time " + sh.realtime(), 10, 60);
	sh.con.fillText("gametime	" + sh.gametime, 10, 75);
	sh.con.fillText("num of enemies " + sh.enemies.length, 10, 90);
	sh.con.fillText("num of playerbullets " + sh.player_bullets.length, 10, 105);
	sh.con.fillText("num of enemybullets " + sh.enemy_bullets.length, 10, 120);
	sh.con.fillText("mouseX " + sh.mouseX + " mouseY " + sh.mouseY, 10, 135);
	sh.con.fillText("mousedown " + sh.is_mouse_down, 10, 150);
	sh.con.fillText("mousedraw points " + sh.mouse_draw_points.length, 10, 165);
	
	if(!sh.gameOver){
		sh.con.font = "7pt Monospace";
		sh.con.fillText("SCORE:" + sh.pad(sh.current_score, 12) + (sh.high_score ? " HI:" + sh.pad(sh.high_score, 12) : ""), 2, 10);
		sh.con.fillText("Lives: " + sh.player_lives, 6, 24);
	} else {
		sh.con.textAlign = "center";
		sh.con.font = "24pt Monospace";
		sh.con.fillText("GAME OVER", sh.canvas.width*0.5, sh.canvas.height*0.5);
		sh.con.font = "12pt Monospace";
		sh.con.fillText("PRESS ENTER TO RESTART", sh.canvas.width*0.5, sh.canvas.height*0.5 + 24 + 12);
		if(sh.current_score < 0){
			sh.con.fillText("New high score!", sh.canvas.width*0.5, sh.canvas.height*0.5 + 56 + 12);
			sh.con.fillText(sh.high_score, sh.canvas.width*0.5, sh.canvas.height*0.5 + 80 + 12);
		}
		sh.con.textAlign = "left";
	}
}


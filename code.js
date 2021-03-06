"use strict";

var sh = {};

sh.gameObjectTypes = Object.freeze({
	unidentified : 0,
	playerShip : 100,
	enemy : 200,
	playerBullet : 300,
	enemyBullet : 400,
	playerBigBullet : 500
});

sh.none = function () {};

sh.random_seed = 1;
sh.seedRand = function(seed) {
	sh.random_seed = seed;
}

sh.random = function(){
	sh.random_seed = (1103515245*sh.random_seed + 12345) % Math.pow(2, 32);
	return Math.floor(sh.random_seed / 65536);
}

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

sh.score = function(points){
	var totalpoints = Math.floor(points * (1 + 9 * sh.heat_counter / sh.heat_counter_max));
	sh.current_score += totalpoints;
	if(sh.next_extra_life_idx < sh.extra_life_points.length && sh.current_score >= sh.extra_life_points[sh.next_extra_life_idx]){
		//sh.createBlinkingText(4, "EXTRA LIFE", 120, 130, 17, "white", "Bold 20pt Impact");
		sh.evt(sh.showTextEvent("EXTRA LIFE", 120, 130, 60, "rgba(255,255,255,0.7)", "Bold 20pt Impact"), 15, 15);
		sh.player_lives++;
		sh.next_extra_life_idx++;
	}
	return totalpoints;
}

sh.setScrollSpeed = function(factor) {
	// default speed 320 vert pixels in 5 seconds
	sh.scrollSpeedFactor = factor;
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
	if(!enemy.indestructible){
		enemy.hitpoints -= playerBullet.damage;
		enemy.hit_starttime = sh.gametime;
		if(enemy.hitpoints <= 0) enemy.die();
	}
	playerBullet.die();
});

sh.collisions.register("enemy", "playerBigBullet", function (enemy, playerBigBullet) {
	if(!enemy.indestructible){
		enemy.hitpoints -= playerBigBullet.damage;
		enemy.hit_starttime = sh.gametime;
		if(enemy.hitpoints <= 0) enemy.die();
	}
});

sh.handlePlayerDamage = function(){
	if(!sh.player_is_immortal){
		sh.player.die();
	}
}

sh.collisions.register("player", "enemyBullet", function (player, enemyBullet) {
	if(!sh.player_is_immortal) enemyBullet.die();
	sh.handlePlayerDamage();
});

sh.collisions.register("player", "enemy", function (player, enemy) {
	sh.handlePlayerDamage();
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
	points : 100,
	explosionSize : 5,
	prev_x : 0,
	prev_y : 0,
	update : function(){
		if(!(this.x == this.prev_x && this.y == this.prev_y)){
			this.prev_x = this.x;
			this.prev_y = this.y;
		}
		this.atTick();
	},
	atDeath : function() {},
	die : function() {
		this.atDeath();
		
		var score = sh.score(this.points);
		if(score > 0) {
			sh.evt(sh.popUpTextEvent(score, this.x, this.y, 60, "rgba(255, 255, " + (80 + Math.floor(175*(1-sh.heat_counter/sh.heat_counter_max))) + ", 0.8)", "Italic " + (16+(Math.floor(15*sh.heat_counter/sh.heat_counter_max))) + "pt Impact"));
		}
		if(!(this.prev_x === this.x && this.prev_y === this.y)){
			sh.evt(sh.massiveExplosionEvent(this.x, this.y, this.explosionSize,
					Math.atan2(this.x - this.prev_x, this.y - this.prev_y)));
		}
		else{
			sh.evt(sh.massiveExplosionEvent(this.x, this.y, this.explosionSize));
		}
		sh.enemies[sh.enemies.indexOf(this)] = undefined;
	}
});

// tutorialEnemy

sh.createTutorialEnemy = function(){
	var new_enemy = Object.create(sh.tutorialEnemy);
	new_enemy.x = 210;
	new_enemy.y = 220;
	sh.enemies.push(new_enemy);
}

sh.tutorialEnemy = sh.pCreate(sh.enemy, {
	atTick : function() {
		var tutorialTotalTicks = 1200;
		var events = [];
		events[100] = [sh.showTextEvent("HEAT", 120, 120, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("Nuutti H\u00f6ltt\u00e4", 120, 170, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("Yrj\u00f6 Peussa", 120, 200, 250, undefined, undefined, 30, 30)];
						
		events[400] = [sh.showTextEvent("Move with WASD,", 120, 120, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("5FPG or arrows.", 120, 145, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("Toggle shooting", 120, 170, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("with spacebar.", 120, 195, 250, undefined, undefined, 30, 30)];
						
		events[700] = [sh.showTextEvent("Special force", 120, 120, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("field can be", 120, 145, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("mouse-dragged", 120, 170, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("when bar is full.", 120, 195, 250, undefined, undefined, 30, 30)];
		
		events[1000] = [sh.showTextEvent("Collect heat", 120, 120, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("(circular counter)", 120, 145, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("for more firepower.", 120, 170, 250, undefined, undefined, 30, 30),
						sh.showTextEvent("Fireball upon overheat.", 120, 195, 250, undefined, undefined, 30, 30)];
		
		if(events[sh.tick % tutorialTotalTicks]) {
			for(var i in events[sh.tick % tutorialTotalTicks]){
				sh.evt(events[sh.tick % tutorialTotalTicks][i]);
			}
		}
		sh.player_lives = sh.player_lives_initial;
	},
	atDeath : function() {
		sh.running_events = [];
		sh.evt(sh.scrollSpeedInterpolateEvent(1, 60));
	},
	width : 50,
	height : 50,
	points : 0,
	image : 'shoottostart'
});


// fastEnemy

sh.fastEnemy = sh.pCreate(sh.enemy, {
	atTick : function () {
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime * 0.002) * 100,
		this.owntime += sh.update_delay;
	},
	image : 'greenenemy'
});

sh.createFastEnemy = function(){
	var new_enemy = Object.create(sh.fastEnemy);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	sh.enemies.push(new_enemy);
}

// slowEnemy

sh.slowEnemy = sh.pCreate(sh.enemy, {
	atTick : function () {
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime * 0.001) * 100;
		if(this.owntime - this.last_shot > 800){
			sh.createEnemyBullet(this.x, this.y, 0.2);
			this.last_shot = this.owntime;
		}
		this.owntime += sh.update_delay;
	},
	hitpoints : 200,
	image : 'greenenemy'
});

sh.createSlowEnemy = function(){
	var new_enemy = Object.create(sh.slowEnemy);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}

// towerEnemy

sh.towerEnemy = sh.pCreate(sh.enemy, {
	atTick : function () {
		if(!sh.gameOver){
			this.angle = sh.angle(this, sh.player);
			if(this.owntime - this.last_shot > 1000){
				sh.createEnemyBullet(this.x, this.y, 0.1, this.angle);
				this.last_shot = this.owntime;
			}
		}
		this.drawAngle = this.angle;
		this.owntime += sh.update_delay;
	},
	hitpoints : 150,
	points : 100,
	image : 'towerenemy'
});


sh.createTowerEnemy = function(x){
	var new_enemy = Object.create(sh.towerEnemy);
	new_enemy.x = x;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}


//bigTowerEnemy
sh.bigTowerEnemy = sh.pCreate(sh.enemy, {
	atTick : function() {
		if(!sh.gameOver){
			this.angle = sh.angle(this, sh.player);
			if(this.owntime - this.last_shot > 2000){
				
				for(var i = 0; i < 5; i++){
					for(var j = 0; j < 5; j++){
						sh.createEnemyBullet(this.x, this.y, 0.07 + i*0.01, this.angle + (j - 2) * 0.17);
					}
				}
				this.last_shot = this.owntime;
			}
			
		}
		this.drawAngle = this.angle;
		this.owntime += sh.update_delay;
	},
	width : 48,
	height : 48,
	hitpoints : 800,
	points : 500,
	image : 'bigtowerenemy'
});

sh.createBigTowerEnemy = function(x){
	var new_enemy = Object.create(sh.bigTowerEnemy);
	new_enemy.x = x;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}

sh.boringEnemy = sh.pCreate(sh.enemy, {
	atTick : function() {
		sh.seedRand(this.randseed);
		var rnd = sh.random();
		var scaler = Math.min(1, this.owntime / 3000);
		
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime*0.0007 + rnd) * 100;
		this.y = (1-scaler)*(sh.view_bottom + sh.canvas.height + 48) +
			scaler*(sh.view_bottom + sh.canvas.height*0.7 + Math.sin(this.owntime*0.0007*2 + rnd)*40);
		
		if(!sh.gameOver){
			if(this.owntime - this.last_shot > 1200 || this.shoot_phase > 0 && this.owntime - this.last_shot > 50){
				sh.createEnemyBullet(this.x, this.y, 0.2, sh.angle(this, sh.player));
				
				this.last_shot = this.owntime;
				this.shoot_phase++;
			}
			if(this.shoot_phase > 3) this.shoot_phase = 0;
		}
		
		this.owntime += sh.update_delay;
	},
	hitpoints : 100,
	points : 200,
	image : 'greenenemy'
});

sh.createBoringEnemy = function(){
	var new_enemy = Object.create(sh.boringEnemy);
	new_enemy.x = 120;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	new_enemy.shoot_phase = 0;
	new_enemy.randseed = sh.gametime;
	sh.enemies.push(new_enemy);
}


sh.crossShooterEnemy = sh.pCreate(sh.enemy, {
	atTick : function(){
		sh.seedRand(this.randseed);
		var rnd = sh.random();
		var scaler = Math.min(1, this.owntime / 1000);
		
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime*0.0003 + rnd) * 60;
		this.y = (1-scaler)*(sh.view_bottom + sh.canvas.height + 48) +
			scaler*(sh.view_bottom + sh.canvas.height*0.7 + Math.sin(this.owntime*0.0003*2 + rnd)*40);

		if(this.owntime - this.last_shot > 50){
			for(var i = 0; i < 4; i++) sh.createEnemyBullet(this.x, this.y, 0.2, i*2*Math.PI/4 + this.owntime*0.001);
			this.last_shot = this.owntime;
		}
		this.owntime += sh.update_delay;
	},
	hitpoints : 500,
	image : 'greenenemy'
});

sh.createCrossShooterEnemy = function(){
	var new_enemy = Object.create(sh.crossShooterEnemy);
	new_enemy.x = 120;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	new_enemy.randseed = sh.gametime;
	sh.enemies.push(new_enemy);
}


sh.spreadShooterEnemy = sh.pCreate(sh.enemy, {
	atTick : function(){
		sh.seedRand(this.randseed);
		var rnd = sh.random();
		var scaler = Math.min(1, this.owntime / 1000);
		
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime*0.0003 + rnd) * 60;
		this.y = (1-scaler)*(sh.view_bottom + sh.canvas.height + 48) +
			scaler*(sh.view_bottom + sh.canvas.height*0.7 + Math.sin(this.owntime*0.0003*2 + rnd)*40);
			
		if(!sh.gameOver){	
			if(this.owntime - this.last_shot > 1500){
				for(var i = 0; i < 11; i++){
					sh.createEnemyBullet(this.x, this.y, 0.1, sh.angle(this, sh.player) + (i - 5) * 0.3);
				}
				this.last_shot = this.owntime;
			}
		}
		
		this.owntime += sh.update_delay;
	},
	points : 300,
	hitpoints : 300,
	image : 'greenenemy'
});

sh.createSpreadShooterEnemy = function(){
	var new_enemy = Object.create(sh.spreadShooterEnemy);
	sh.seedRand(sh.gametime);
	new_enemy.x = 120;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	new_enemy.randseed = sh.gametime;
	sh.enemies.push(new_enemy);
}

sh.spiralShooterEnemy = sh.pCreate(sh.enemy, {
	atTick : function(){
		sh.seedRand(this.randseed);
		var rnd = sh.random();
		var scaler = Math.min(1, this.owntime / 3000);
		
		this.x = sh.canvas.width*0.5 + Math.cos(-this.owntime*0.0008 + rnd) * 50;
		this.y = (1-scaler)*(sh.view_bottom + sh.canvas.height + 48) +
			scaler*(sh.view_bottom + sh.canvas.height*0.7 + Math.sin(-this.owntime*0.0008 + rnd)*40);
			
		if(this.shootcycle < 100){
			sh.createEnemyBullet(this.x, this.y, 0.1, this.shootcycle*0.3);
		}
		
		this.shootcycle++;
		if(this.shootcycle > 200) this.shootcycle = 0;		
			
		this.owntime += sh.update_delay;
	},
	points : 800,
	hitpoints : 400,
	image : 'greenenemy'
});

sh.createSpiralShooterEnemy = function(){
	var new_enemy = Object.create(sh.spiralShooterEnemy);
	new_enemy.x = 120;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.shootcycle = 0;
	new_enemy.last_shot = -1;
	new_enemy.randseed = sh.gametime;
	sh.enemies.push(new_enemy);
}


sh.smallEnemy = sh.pCreate(sh.enemy, {
	atTick : function(){
		this.x += ((this.startx < 120) ? 1 : -1) * this.owntime * 0.001 * sh.scrollspeed;
		this.x += this.x < sh.player.x ? 0.3 : -0.3;
		this.y += 0.15 - this.owntime * 0.0001;
		
		if(!sh.gameOver){
			if(this.owntime - this.last_shot > 2000){
				if(this.y > sh.player.y) sh.createEnemyBullet(this.x, this.y, 0.1, sh.angle(this, sh.player));
				this.last_shot = this.owntime;
			}
		}
		
		this.owntime += sh.update_delay;
	},
	hitpoints : 50,
	image : 'greenenemy'
});

sh.createSmallEnemy = function(x){
	var new_enemy = Object.create(sh.smallEnemy);
	new_enemy.startx = x;
	new_enemy.x = x;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}


sh.directedTurret = sh.pCreate(sh.enemy, {
	atTick : function(){
		if(this.owntime - this.last_shot > this.frequency){
			sh.createEnemyBullet(this.x, this.y, 0.1, this.angle);
			this.last_shot = this.owntime;
		}
		this.owntime += sh.update_delay;
		this.drawAngle = this.angle;
	},
	hitpoints : 50,
	image : 'towerenemy'
});

sh.createDirectedTurret = function(x, angle, frequency, indestructible, hitpoints){
	var new_enemy = Object.create(sh.directedTurret);
	new_enemy.x = x;
	new_enemy.y = sh.view_bottom + sh.canvas.height*2;
	new_enemy.angle = angle;
	new_enemy.frequency = frequency;
	new_enemy.indestructible = indestructible;
	if(hitpoints) new_enemy.hitpoints = hitpoints;
	new_enemy.owntime = 0;
	new_enemy.last_shot = -1;
	sh.enemies.push(new_enemy);
}

sh.createHorizontalTurret = function(rightside, frequency){
	sh.createDirectedTurret((rightside ? sh.canvas.width + 48 : -48), (rightside ? 1.5*Math.PI : 0.5*Math.PI), (frequency || 60), true);
}


//boss and the gang
sh.bossCore = sh.pCreate(sh.enemy, {
	atTick : function(){
		var scaler = Math.min(1, this.owntime / 3000);
		
		this.x = sh.canvas.width*0.5 + Math.cos(this.owntime*0.0003) * 60;
		this.y = (1-scaler)*(sh.view_bottom + sh.canvas.height + 48) +
			scaler*(sh.view_bottom + sh.canvas.height*0.7 + Math.sin(this.owntime*0.0003*2)*30);
		
		if(this.stage === 0){
			if(this.owntime - this.cycletimer > 80){
				if(this.shootcycle < 40){
					if(this.shootcycle % 6 === 0){
						var phase = Math.floor(this.shootcycle/5)%2;
						var num = 15;
						for(var i = 0; i < num; i++){
							for(var j = 0; j < 5; j++){
								sh.createEnemyBullet(this.x, this.y, 0.15, i*2*Math.PI/num + phase*Math.PI/num +  (j-2)*0.05);
							}
						}
					}
				}
				
				this.shootcycle++;
				this.cycletimer = this.owntime;
				if(this.shootcycle > 100) this.shootcycle = 0;
			}
		}
		else if(this.stage === 1){
			this.shootcycle++;
			if(this.shootcycle === 150){
				this.stage++;
				this.shootcycle = 0;
			}
		}
		else if(this.stage === 2){
			if(this.owntime - this.cycletimer > 80){
				if(this.shootcycle < 100){
					if(this.shootcycle % 10 === 0){
						for(var i = 0; i < 4; i++){
							sh.seedRand(sh.gametime);
							sh.createEnemyBullet(this.x, this.y, 0.1, Math.PI + 0.5*((sh.random()%1000)/1000-0.5) + i*0.03);
						}
					}
				}
				else{
					if(this.shootcycle % 1 === 0){
						for(var i = 0; i < 2; i++){
							sh.createEnemyBullet(this.x, this.y, 0.1, Math.PI + Math.sin(this.shootcycle*0.3 + i*Math.PI*2/2));
						}
					}
				}
				
				this.shootcycle++;
				this.cycletimer = this.owntime;
				if(this.shootcycle >= 200) this.shootcycle = 0;
			}
		}
		
		this.owntime += sh.update_delay;
	},
	atDeath : function() {
		for(var i in sh.enemies){
			if(sh.enemies[i] && sh.enemies[i].parent && sh.enemies[i].parent === this) sh.enemies[i].die();
		}
		
		sh.evt(sh.scrollSpeedInterpolateEvent(1, 2*60));
	},
	width : 48,
	height : 48,
	hitpoints : 3000,
	points : 2000,
	explosionSize : 200,
	image : 'bigtowerenemy'
});

sh.bossIndestructiblePart = sh.pCreate(sh.enemy, {
	atTick : function(){
		this.x = this.parent.x + (this.rightside ? 28 : -28);
		this.y = this.parent.y - 24;
		
		if(this.parent.stage === 0){
			if(this.last_parent_cycle != this.parent.shootcycle){
				if(!sh.gameOver){
					if(this.parent.shootcycle >= 60 && this.parent.shootcycle <= 80 && this.parent.shootcycle % 7 === 0){
						for(var i = 0; i < 7; i++){
							sh.createEnemyBullet(this.x, this.y, 0.15, sh.angle(this, sh.player) + (i-3)*0.3);
						}
					}
				}
				
				this.last_parent_cycle = this.parent.shootcycle;
			}
		}
		else if(this.parent.stage === 2){
			if(this.owntime - this.last_shot > 70){
				if(this.parent.shootcycle < 100){
					sh.createEnemyBullet(this.x, this.y, 0.12, Math.PI + (this.rightside ? -0.2 : 0.2) + Math.cos(this.owntime*0.003)*0.2);
				}
				else{
					var scaler = Math.sin((this.parent.shootcycle/100-1)*Math.PI);
					sh.createEnemyBullet(this.x, this.y, 0.12, Math.PI +
						(this.rightside ? -0.2 : 0.2)*(scaler*4+1) +
						Math.cos(this.owntime*0.003)*0.2*(1-scaler));
				}
				
				this.last_shot = this.owntime;
			}
		}
		
		this.owntime += sh.update_delay;
	},
	points : 1000,
	indestructible : true,
	image : 'ship'
});

sh.createBossIndestructiblePart = function(parent, rightside){
	var new_part = Object.create(sh.bossIndestructiblePart);
	new_part.parent = parent;
	new_part.rightside = rightside;
	new_part.x = new_part.parent.x + (rightside ? 30 : -30);
	new_part.y = new_part.parent.y - 30;
	new_part.last_shot = -1;
	new_part.owntime = 0;
	new_part.last_parent_cycle = -1;
	sh.enemies.push(new_part);
}

sh.bossFrontShield = sh.pCreate(sh.enemy, {
	atTick : function(){
		this.x = this.parent.x;
		this.y = this.parent.y - 24;
		
		this.owntime += sh.update_delay;
	},
	atDeath : function(){
		this.parent.stage++;
		this.parent.shootcycle = 0;
	},
	hitpoints : 1000,
	points : 2000,
	explosionSize : 10,
	image : 'towerenemy'
});

sh.createBossFrontShield = function(parent){
	var new_part = Object.create(sh.bossFrontShield);
	new_part.parent = parent;
	new_part.x = parent.x;
	new_part.y = parent.y - 40;
	new_part.owntime = 0;
	new_part.last_shot = -1;
	sh.enemies.push(new_part);
}

sh.createBoss = function(){
	var core = Object.create(sh.bossCore);
	core.x = 120;
	core.y = sh.view_bottom + sh.canvas.height + 48;
	core.owntime = 0;
	core.stage = 0;
	core.shootcycle = 0;
	core.cycletimer = -1;
	sh.enemies.push(core);
	sh.createBossIndestructiblePart(core, false);
	sh.createBossIndestructiblePart(core, true);
	sh.createBossFrontShield(core);
}


// player bullet
sh.playerBullet = sh.pCreate(sh.gameObject, {
	update : function () { this.y += (sh.scrollspeed + 0.4) * sh.update_delay; },
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
}

// player's supah bullet
sh.playerBigBullet = sh.pCreate(sh.gameObject, {
	update : function () { this.y += (sh.scrollspeed + 0.5) * sh.update_delay; },
	die : function() {
		sh.player_bullets[sh.player_bullets.indexOf(this)] = undefined;
	},
	type : 'playerBigBullet',
	damage : 50,
	width : 50,
	height : 50,
	image : 'overheatprojectile'
});

sh.createPlayerBigBullet = function(x, y){
	var new_bullet = Object.create(sh.playerBigBullet);
	new_bullet.x = x;
	new_bullet.y = y;
	sh.player_bullets.push(new_bullet);
}

// enemy bullet
sh.enemyBullet = sh.pCreate(sh.gameObject, {
	update : function () {
		this.x += Math.sin(this.angle) * this.speed * sh.update_delay;
		this.y += Math.cos(this.angle) * this.speed * sh.update_delay;
	},
	die : function() {
		sh.enemy_bullets[sh.enemy_bullets.indexOf(this)] = undefined;
	},
	type : 'enemyBullet',
	width : 10,
	height : 10,
	image : 'purplebullet'
});

sh.createEnemyBullet = function(x, y, speed, angle){
	var new_bullet = Object.create(sh.enemyBullet);
	new_bullet.x = x;
	new_bullet.y = y;
	new_bullet.speed = speed;
	new_bullet.angle = angle !== undefined ? angle : Math.PI;
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

sh.popUpTextEvent = function(text, x, y, ticks, fillcolor, font, strokecolor) {
	return {
	lifetime : ticks || 60,
	floatOffset : 0,
	drawTopLayer : function() {
		var fadeOutTicks = 20;
		sh.con.textAlign = "center";
		sh.con.fillStyle = fillcolor || "rgba(255, 255, 255, 1)";
		sh.con.linewidth = 1;
		sh.con.strokeStyle = strokecolor || "rgba(0, 0, 0, 0.6)";
		sh.con.font = font || "Italic 16pt Impact";
		sh.con.globalAlpha = (this.lifetime < fadeOutTicks) ? this.lifetime / fadeOutTicks : 1;
		sh.con.fillText(text, x, sh.scrY(y)-(this.floatOffset/6));
		sh.con.strokeText(text, x, sh.scrY(y)-(this.floatOffset/6));
		sh.con.globalAlpha = 1;
	},
	onTick : function() {
		this.floatOffset++;
	}
	};
}

sh.massiveExplosionEvent = function(x, y, size, dir) {
	return {
		lifetime : size,
		onTick : function(){
			sh.seedRand(sh.gametime);
			for(var randspam = 0; randspam < 4; randspam++) sh.random();
			sh.evt(sh.explosionEvent(
					x + ((sh.random()%1000)/1000-0.5)*10*Math.sqrt(size),
					y + ((sh.random()%1000)/1000-0.5)*10*Math.sqrt(size),
					dir));
		}
		
	};
}

sh.explosionEvent = function(x, y, dir) {
	return {
	lifetime : 25,
	direction : dir,
	drawBottomLayer : function() {
		var img = sh.images['explosion'];
		var fadeOutTicks = 10;
		sh.con.globalAlpha = (this.lifetime < fadeOutTicks) ? this.lifetime / fadeOutTicks : 1;
		if(this.direction === undefined){
			sh.con.drawImage(img, Math.round(x - img.width / 2), Math.round(sh.scrY(y) - img.height / 2));
		}
		else{
			sh.con.drawImage(img,
				Math.round(x + (30 - this.lifetime)*Math.sin(this.direction)*0.4 - img.width / 2),
				Math.round(sh.scrY(y + (30 - this.lifetime)*Math.cos(this.direction)*0.4) - img.height / 2));
		}
		sh.con.globalAlpha = 1;
	}
	};
}

// text, x, y mandatory, rest optional
sh.showTextEvent = function (text, x, y, ticks, color, font, fadein, fadeout, align) {
	return {
	lifetime : ticks || 60,
	drawTopLayer : function() {
		//var fadeInTicks = fadein || 0;
		//var fadeOutTicks = fadeout || 0;
		sh.con.textAlign = align || "center";
		sh.con.fillStyle = color || "rgba(255, 255, 255, 1)";
		sh.con.font = font || "10pt Monospace";
		if(this.lifetime < fadeout) {
			sh.con.globalAlpha = this.lifetime / fadeout;
		} else if (ticks - this.lifetime < fadein) {
			sh.con.globalAlpha = (ticks - this.lifetime) / fadein;
		}
		sh.con.fillText(text, x, y);
		sh.con.globalAlpha = 1;
	}
	};
}

sh.createBlinkingText = function (repeat, text, x, y, ticks, color, font) {
	sh.evt(sh.showTextEvent(text, x, y, ticks, color, font));
	for(var i=1; i<repeat; i++) {
		sh.delay(2*ticks*i, sh.showTextEvent(text, x, y, ticks, color, font));
	}
}

sh.scrollSpeedInterpolateEvent = function(factor, ticks) {
	return {
	lifetime : ticks,
	onStart : function () {this.initialFactor = sh.scrollSpeedFactor;},
	onTick : function() {
		var ratio = (ticks - this.lifetime) / ticks;
		sh.setScrollSpeed(ratio*factor + (1-ratio)*this.initialFactor);
	},
	};
}

sh.winGameEvent = {
	lifetime : 240,
	onStart : function() {
		sh.evt(sh.showTextEvent("The monster is defeated!", 120, 160));
		sh.delay(130, sh.endPointsEvent);
	},
	atEnd : function() {
		sh.gameOver = true;
		sh.victory = true;
		sh.handleGameOver();
	}
}

sh.endPointsEvent = {
	lifetime : 1,
	onStart : function() {
		if(sh.player_lives) {
			var pts = (sh.player_lives) * 10000;
			sh.evt(sh.showTextEvent("Life bonus " + pts + "pts!", 120, 160));
			sh.current_score += pts;
		}
	}
}

sh.areaEvent = function(pt0, pt1){
	return{
	lifetime : 100,
	onStart : function() {
		this.screen_pt0 = {x : pt0.x, y : sh.scrY(pt0.y)};
		this.screen_pt1 = {x : pt1.x, y : sh.scrY(pt1.y)};
		sh.area_pts = [pt0, pt1];
	},
	atEnd : function() {
		sh.area_pts = undefined;
	},
	drawBottomLayer : function() {
		pt0.y = sh.wrdY(this.screen_pt0.y);
		pt1.y = sh.wrdY(this.screen_pt1.y);
		var angle = Math.atan2(sh.scrY(pt1.y) - sh.scrY(pt0.y), pt1.x - pt0.x);
		sh.con.fillStyle = "blue";
		sh.con.beginPath();
		sh.con.arc(pt0.x, sh.scrY(pt0.y), sh.mouse_selection_radius, angle + Math.PI*0.5, angle - Math.PI*0.5, false);
		sh.con.arc(pt1.x, sh.scrY(pt1.y), sh.mouse_selection_radius, angle - Math.PI*0.5, angle + Math.PI*0.5, false);
		sh.con.globalAlpha = 0.4;
		sh.con.fill();
		sh.con.globalAlpha = 1;
	}
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
		l : obj.x - obj.width / 2,
		r : obj.x + obj.width / 2,
		u : obj.y + obj.height / 2,
		d : obj.y - obj.height / 2
	};
}

sh.doGameObjectsCollide = function(obj0, obj1){
	if (obj0 && obj1)
		return sh.doWorldRectsCollide(sh.gameObjectRect(obj0), sh.gameObjectRect(obj1));
	return false;
}

sh.hypot = function(xd, yd){
	return Math.sqrt(xd*xd + yd*yd);
}

sh.dist = function(obj0, obj1){
	return sh.hypot(obj0.x - obj1.x, obj0.y - obj1.y);
}

sh.angle = function(obj0, obj1){
	return Math.atan2(obj1.x - obj0.x, obj1.y - obj0.y);
}

sh.isGameObjectInsideArea = function(obj, pt0, pt1){
	var rad = sh.mouse_selection_radius;
	var corners = [];
	var idx;
	
	if(sh.dist(obj, pt0) <= rad || sh.dist(obj, pt1) <= rad) return true;
	var angle = Math.atan2(pt1.y - pt0.y, pt1.x - pt0.x);
	corners[0] = {x : pt0.x + Math.cos(angle + 0.5*Math.PI) * rad, y : pt0.y + Math.sin(angle + 0.5*Math.PI) * rad};
	corners[1] = {x : pt0.x + Math.cos(angle - 0.5*Math.PI) * rad, y : pt0.y + Math.sin(angle - 0.5*Math.PI) * rad};
	corners[2] = {x : pt1.x + Math.cos(angle - 0.5*Math.PI) * rad, y : pt1.y + Math.sin(angle - 0.5*Math.PI) * rad};
	corners[3] = {x : pt1.x + Math.cos(angle + 0.5*Math.PI) * rad, y : pt1.y + Math.sin(angle + 0.5*Math.PI) * rad};

	for(idx = 0; idx < 4; idx++){
		var c = [corners[idx], corners[(idx + 1) % 4]];
		var c0_to_obj = {x : obj.x - c[0].x, y : obj.y - c[0].y};
		var c0_to_c1_normal = {x : c[1].y - c[0].y, y : c[0].x - c[1].x};
		if(c0_to_obj.x*c0_to_c1_normal.x + c0_to_obj.y*c0_to_c1_normal.y > 0){
			return false;
		}
	}
	
	return true;
}

sh.updateObjects = function(objlist){
	for(var idx in objlist) objlist[idx].update();
}

sh.conditionalUpdateObjects = function(objlist, condition){
	for(var idx in objlist){
		if(condition(objlist[idx])) objlist[idx].update();
	}
}

sh.removeOutOfScreenObjects = function(objlist){
	for(var idx = 0; idx < objlist.length; idx++){
		var obj = objlist[idx];
		if(obj.x < -2*24 || obj.x > sh.canvas.width + 2*24 ||
			obj.y < sh.view_bottom - 2*24 || obj.y > sh.view_bottom + sh.canvas.height * 2){
			
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
	normal_shot_interval : 200,
	extra_shot_interval : 100,
	shot_interval : 200,
	movement_noshoot : 0.17,
	movement_shoot : 0.1,
	shooting : false,
	overload_ticks_left : 0,
	overload_duration : 120,
	width : 5,
	height : 5,
	toggleShooting : function(){
		this.shooting = !this.shooting;
	},
	overloaded : function() {return this.overload_ticks_left > 0;},
	overloadPercentLeft : function() {
		return this.overload_ticks_left / this.overload_duration;
	},
	update : function(){
		// controls: arrow keys; alternate: wasd (qwerty) 5fpg (colemak)
		
		var speed = this.shooting ? this.movement_shoot : this.movement_noshoot;

		// left / a / f
		// right / d / g
		if(sh.downkeys[37] || sh.downkeys[65] || sh.downkeys[70]) {
			this.x -= speed * sh.update_delay;
		} else if(sh.downkeys[39] || sh.downkeys[68] || sh.downkeys[71]) {
			this.x += speed * sh.update_delay;
		}

		// up / w / 5
		// down / s / p
		if(sh.downkeys[38] || sh.downkeys[87] || sh.downkeys[53]) {
			this.y += speed * sh.update_delay;
		} else if(sh.downkeys[40] || sh.downkeys[83] || sh.downkeys[80]) {
			this.y -= speed * sh.update_delay;
		}

		this.y += sh.scrollspeed*sh.update_delay;
	
		if(this.x < this.width / 2) this.x = this.width / 2;
		if(this.x > sh.canvas.width - this.width / 2) this.x = sh.canvas.width - this.width / 2;
		if(this.y < sh.view_bottom + this.height / 2 - 1) this.y =  sh.view_bottom + this.height / 2 - 1;
		if(this.y > sh.view_bottom + sh.canvas.height - this.height / 2 - 1) this.y = sh.view_bottom + sh.canvas.height - this.height / 2 - 1;

		if(this.overloaded()) {
			this.overload_ticks_left--;
			if (!this.overloaded()) { // at end of overload
			}
		}
		else if(sh.heat_counter === sh.heat_counter_max) { // at beginning of overload
			sh.createPlayerBigBullet(this.x, this.y);

			this.overload_ticks_left = this.overload_duration;
			sh.heat_counter = 0;
			sh.createBlinkingText(4, "OVERHEAT", 120, 300, 17, "rgba(255,0,0,0.5)", "Bold 18pt Impact");
		}
		if(this.shooting && !this.overloaded())
		{
			sh.decreaseCounter(sh.shooting_decrement_tick);

			var ratio = (sh.heat_counter_max - sh.heat_counter) / sh.heat_counter_max;
			this.shot_interval = Math.floor(ratio * this.normal_shot_interval + (1-ratio) * this.extra_shot_interval);
			if(sh.gametime - this.last_shot >= this.shot_interval) {
				sh.createPlayerBullet(this.x, this.y);
				this.last_shot = sh.gametime;
			}
		}

		sh.increaseCounter(sh.heat_increment_tick);
		sh.increaseSpecialCounter(sh.special_increment_tick);
			
		var undertile_y = Math.floor(this.y / 24);
		var real_y = sh.leveldata.length - 1 - undertile_y;
		if(real_y >= 0){
			var undertile_x = Math.floor(this.x / 24);
			var tile = sh.leveldata[real_y][0].substr(undertile_x, 1);
			if(sh.action_tiles[tile]) sh.action_tiles[tile]();
		}
			
		for(var idx = 0; idx < sh.enemy_bullets.length; idx++){
			if(sh.dist(sh.enemy_bullets[idx], this) < sh.heat_collection_radius) {
				sh.increaseCounter(sh.bullet_heat_value);
			}
		}
	},
	die : function() {
		this.extraDumpModeTicksLeft = 0;
		sh.heat_counter = Math.floor(sh.heat_counter * 0.5);
		sh.player_is_immortal = true;
		sh.player_immortal_starttime = sh.gametime;
		sh.player_lives--;
		if(sh.player_lives < 0){
			sh.gameOver = true;
			sh.player.x = -666;
			sh.handleGameOver();
		}
	},
});

sh.changeScaling = function(factor){
	sh.scale_factor = factor;
	if(sh.scale_factor < 1) sh.scale_factor = 1;
	sh.canvas.setAttribute("style", "position:relative; width:" +
		sh.scale_factor*240 + "px; height:" +
		sh.scale_factor*320 + "px; cursor:none; image-rendering:-moz-crisp-edges");
}

sh.keyDown = function(evt){
	sh.downkeys[evt.keyCode] = true;
	if(evt.keyCode === 33) sh.changeScaling(sh.scale_factor + 1);
	if(evt.keyCode === 34) sh.changeScaling(sh.scale_factor - 1);
	if(evt.keyCode === 32) sh.player.toggleShooting();
	if(evt.keyCode === 48) sh.player_lives++;
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
	rock1: "resources/rockbackground1-24x24.png",
	rock2: "resources/rockbackground2-24x24.png",
	rock3: "resources/rockbackground3-24x24.png",
	rock4: "resources/rockbackground4-24x24.png",
	lava1: "resources/lavabackground1-24x24.png",
	lava2: "resources/lavabackground2-24x24.png",
	lava3: "resources/lavabackground3-24x24.png",
	lava4: "resources/lavabackground4-24x24.png",
	ship: "resources/ship-30x30.png",
	greenenemy: "resources/greenenemy-24x24.png",
	purplebullet: "resources/purplebullet-10x10.png",
	whitebullet: "resources/whitebullet-10x10.png",
	towerenemy: "resources/towerenemy-24x24.png",
	bigtowerenemy: "resources/towerenemy-48x48.png",
	heatbar: "resources/heatbar-50x10.png",
	explosion: "resources/explosion-30x30.png",
	overheatprojectile: "resources/overheat-projectile-50x50.png",
	shoottostart: "resources/shoottostart-50x50.png",
});

sh.game_init = function(){
	sh.seedRand(1);
	
	sh.canvas = document.getElementById("can");
	sh.con = sh.canvas.getContext("2d");
	
	sh.images = {};
	sh.imagesLoaded = 0;
	sh.imageCount = 0;
	sh.loadImages();

	sh.update_delay = 17;
	sh.draw_delay = 9;
	sh.downkeys = [];
	sh.is_mouse_down = false;
	sh.mouseX = 0;
	sh.mouseY = 0;
	sh.scale_factor = 2;
	
	sh.player_lives_initial = 3;
	
	sh.extra_life_points = [5000, 10000, 20000, 35000, 50000, 75000, 100000];

	sh.high_score = 0;
	sh.special_counter_max = 1000;
	sh.heat_counter_max = 1000;
	sh.area_max_length = 100;

	sh.special_increment_tick = 4;
	sh.heat_increment_tick = 1;
	sh.shooting_decrement_tick = 4;
	
	sh.heat_collection_radius = 30;
	sh.bullet_heat_value = 1;
	sh.lava_heat_value = 4;

	for(var i = 0; i < sh.leveldata.length; i++){
		for(var j = 0; j < 10; j++){
			var chr = sh.leveldata[i][0].charAt(j);
			if(sh.random_tiles[chr]){
				var primitive = sh.random_tiles[chr][sh.random() % sh.random_tiles[chr].length];
				sh.leveldata[i][0] = sh.leveldata[i][0].substr(0, j) + primitive + sh.leveldata[i][0].substr(j + 1);
			}
		}
	}
}

sh.round_init = function(){
	sh.setScrollSpeed(1);
	
	sh.player.x = sh.canvas.width * 0.5 - sh.player.width * 0.5;
	sh.player.y = 24 + sh.player.height;
	sh.player.last_shot = -1;
	sh.player.extraDumpNodeTicksLeft = 0;
	
	sh.player_lives = sh.player_lives_initial;
	sh.current_score = 0;
	sh.player_is_immortal = false;
	sh.player_immortal_starttime = -1;
	sh.immortality_duration = 1000;
	sh.special_counter = 0;
	sh.heat_counter = 0;
	
	sh.next_extra_life_idx = 0;
	
	sh.gameOver = false;
	sh.victory = false;
	
	sh.player.shooting = false;

	sh.enemies = [];
	sh.enemy_bullets = [];
	sh.player_bullets = [];
	sh.running_events = [];
	sh.delayed_events = [];
	sh.last_executed_level_line = -1;
	sh.gametime = 0;
	sh.view_bottom = 0;

	sh.tick = 0;
	
	sh.mouse_selection_points = [{x:0, y:0}];
	sh.mouse_selection_radius = 20;
	
	sh.starttime = (new Date()).getTime();
}

sh.loadImages = function(){
	for(var imagehandle in sh.imagepaths){
		sh.images[imagehandle] = new Image();
		sh.images[imagehandle].onload = function(){ sh.imagesLoaded++; };
		sh.images[imagehandle].src = sh.imagepaths[imagehandle];
		sh.imageCount++;
	}
	
	sh.imageWaitInterval = window.setInterval("sh.waitForImages()", 10);
}

sh.createHitImage = function(orig){
	var newcanvas = document.createElement("canvas");
	newcanvas.width = orig.width;
	newcanvas.height = orig.height;
	var newcon = newcanvas.getContext("2d");
	
	newcon.drawImage(orig, 0, 0);
	
	var tdata = newcon.getImageData(0, 0, newcanvas.width, newcanvas.height);
	for(var idx = 0; idx < tdata.data.length; idx++){
		if(idx % 4 != 3) tdata.data[idx] = 255;
	}
	newcon.putImageData(tdata, 0, 0);
	
	return newcanvas;
}

sh.waitForImages = function(){
	if(sh.imagesLoaded === sh.imageCount){
		window.clearInterval(sh.imageWaitInterval);
		Object.freeze(sh.images);
		sh.hitImages = {};
		for(var handle in sh.images){
			sh.hitImages[handle] = sh.createHitImage(sh.images[handle]);
		}
		Object.freeze(sh.hitImages);
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
	
	window.setInterval("sh.update()", sh.update_delay*0.5);
	window.setInterval("sh.draw()", sh.draw_delay);
}

sh.handleGameOver = function(){
	sh.evt(sh.scrollSpeedInterpolateEvent(0, 180));
	if(sh.high_score < sh.current_score)
	{
		sh.high_score = sh.current_score;
		sh.current_score = -1;
	}
}

sh.mouseAreaDoable = function(){
	return !sh.gameOver && sh.special_counter === sh.special_counter_max && !sh.area_pts;
}

sh.increaseCounter = function(amount){
	if (!sh.player.overloaded()) {
		if (sh.heat_counter < sh.heat_counter_max)
		{
			sh.heat_counter += amount;
			sh.heat_counter = Math.min(sh.heat_counter, sh.heat_counter_max);
		}
	}
}

sh.decreaseCounter = function(amount){
	if (sh.heat_counter > 0){
		sh.heat_counter -= amount;
		sh.heat_counter = Math.max(sh.heat_counter, 0);
	}
}

sh.increaseSpecialCounter = function(amount){
	if (sh.special_counter < sh.special_counter_max)
	{
		sh.special_counter += amount;
		sh.special_counter = Math.min(sh.special_counter, sh.special_counter_max);
	}
}

sh.update = function(){
	var idxplayer, idxenemy, idxpb, idxeb; // loop vars

	var steps=0;
	while(sh.gametime < sh.realtime()){
		sh.updateObjects(sh.player_bullets);
		sh.updateObjects(sh.running_events);
		sh.updateObjects(sh.enemies);
		
		sh.view_bottom += sh.scrollspeed*sh.update_delay;
	
		sh.conditionalUpdateObjects(sh.enemy_bullets, function(obj){
				return sh.tick % 5 === 0 || !(sh.area_pts != undefined && sh.isGameObjectInsideArea(obj, sh.area_pts[0], sh.area_pts[1]));
			}
		);

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
		
		for(idxenemy in sh.enemies){
			for(idxpb in sh.player_bullets){
				if(sh.doGameObjectsCollide(sh.enemies[idxenemy], sh.player_bullets[idxpb])){
					sh.collisions.handle(sh.enemies[idxenemy], sh.player_bullets[idxpb]);
				}
			}
		}
		
		for(idxeb in sh.enemy_bullets){
			if(sh.doGameObjectsCollide(sh.player, sh.enemy_bullets[idxeb])){
				sh.collisions.handle(sh.player, sh.enemy_bullets[idxeb]);
			}
		}
		
		for(idxenemy in sh.enemies){
			if(sh.doGameObjectsCollide(sh.player, sh.enemies[idxenemy])){
				sh.collisions.handle(sh.player, sh.enemies[idxenemy]);
			}
		}
		
		sh.enemies = sh.enemies.filter(function(val){return !!val;});
		sh.enemy_bullets = sh.enemy_bullets.filter(function(val){return !!val;});
		sh.player_bullets = sh.player_bullets.filter(function(val){return !!val;});
		sh.running_events = sh.running_events.filter(function(val){return !!val;});
		sh.delayed_events = sh.delayed_events.filter(function(val){return !!val;});
		
		for(idxenemy in sh.enemies){
			if(sh.enemies[idxenemy].hit_starttime && sh.gametime - sh.enemies[idxenemy].hit_starttime > 100){
				sh.enemies[idxenemy].hit_starttime = undefined;
			}
		}
		
		if(!sh.gameOver){
			sh.player.update();
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
		
		if(sh.is_mouse_down && sh.mouseAreaDoable()){
			sh.mouse_selection_points[1] = {x : sh.mouseX, y : sh.mouseY};
			var arealen = sh.dist(sh.mouse_selection_points[0], sh.mouse_selection_points[1]);
			if(arealen > sh.area_max_length){
				sh.mouse_selection_points[1] = {
					x : sh.mouse_selection_points[0].x + (sh.mouse_selection_points[1].x - sh.mouse_selection_points[0].x) * sh.area_max_length / arealen,
					y : sh.mouse_selection_points[0].y + (sh.mouse_selection_points[1].y - sh.mouse_selection_points[0].y) * sh.area_max_length / arealen
				};
			}
		}
		else{
			if(sh.mouse_selection_points.length > 1){
				var arealen = sh.dist(sh.mouse_selection_points[0], sh.mouse_selection_points[1]);
				if(sh.mouseAreaDoable()){
					sh.evt(sh.areaEvent(
						{x : sh.mouse_selection_points[0].x, y : sh.wrdY(sh.mouse_selection_points[0].y)},
						{x : sh.mouse_selection_points[1].x, y : sh.wrdY(sh.mouse_selection_points[1].y)}
					));
					sh.special_counter = sh.special_counter_max * (0.5 - arealen / sh.area_max_length * 0.5);
				}
			}
			sh.mouse_selection_points = [{x : sh.mouseX, y : sh.mouseY}];
		}
		
		
		sh.gametime += sh.update_delay;
		sh.tick++;
	}
}

sh.drawGameObject = function(obj){
	var img;
	if(!obj.image){
		sh.con.fillStyle = "red";
		sh.con.fillRect(Math.round(obj.x - obj.width / 2), Math.round(sh.scrY(obj.y) - obj.height / 2), obj.width, obj.height);
	}
	else{
		if(!obj.hit_starttime) img = sh.images[obj.image];
		else img = sh.hitImages[obj.image];
			
		if(!obj.drawAngle) sh.con.drawImage(img, Math.round(obj.x - img.width / 2), Math.round(sh.scrY(obj.y) - img.height / 2));
		else{
			sh.con.translate(obj.x, sh.scrY(obj.y));
			sh.con.rotate(obj.drawAngle);
			sh.con.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
			sh.con.rotate(-obj.drawAngle);
			sh.con.translate(-obj.x, -sh.scrY(obj.y));
		}
	}
}


sh.draw = function(){
	var idx;
	
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
				var tile = sh.primitive_tiles[sh.leveldata[real_idx][0].charAt(i)];
				if(Array.isArray(tile)){
					sh.seedRand(back_idx*10 + i);
					for(var randspam = 0; randspam < 4; randspam++) sh.random();
					sh.con.drawImage(sh.images[tile[(Math.floor((sh.tick + sh.random())/60)) % tile.length]], i*24, screeny);
				}
				else{
					sh.con.drawImage(sh.images[tile], i*24, screeny);
				}
			}
		}
		back_idx++;
	}
	

	for(var idx in sh.running_events){
		sh.running_events[idx].drawBottomLayer();
	}
	
	for(idx in sh.player_bullets) sh.drawGameObject(sh.player_bullets[idx]);
	for(idx in sh.enemy_bullets) sh.drawGameObject(sh.enemy_bullets[idx]);
	for(idx in sh.enemies) sh.drawGameObject(sh.enemies[idx]);

	for(var idx in sh.running_events){
		sh.running_events[idx].drawTopLayer();
	}

	// draw player
	if(sh.player_lives >= 0 && (!sh.player_is_immortal || Math.floor(sh.gametime / 100) % 2 === 0)){
		sh.drawGameObject(sh.player);
		if(sh.player.overloaded()) {
			sh.con.strokeStyle = "rgb(255, 0, 0)";
		} else {
			var heat_unit = sh.heat_counter / sh.heat_counter_max;
			var redness = heat_unit*255;
			var blueness = 255 * (1 - heat_unit);
			sh.con.strokeStyle = "rgb(" + Math.floor(redness) + ",0," + Math.floor(blueness) + ")";
		}
		sh.con.lineWidth = 1;
		sh.con.beginPath();
		sh.con.arc(sh.player.x, sh.scrY(sh.player.y), sh.heat_collection_radius, 0, 2*Math.PI, false);
		sh.con.stroke();
		
		sh.con.lineWidth = 5;
		sh.con.beginPath();
		if(sh.player.overloaded()) {
			sh.con.arc(sh.player.x, sh.scrY(sh.player.y), sh.heat_collection_radius, Math.PI * (0.5 - sh.player.overloadPercentLeft()), Math.PI * (0.5 + sh.player.overloadPercentLeft()), false);
		} else {
			sh.con.arc(sh.player.x, sh.scrY(sh.player.y), sh.heat_collection_radius, Math.PI * (0.5 - heat_unit), Math.PI * (0.5 + heat_unit), false);
		}
		sh.con.stroke();
	}
	
	// draw cursor
	var mouseptsnum = sh.mouse_selection_points.length;
	if(sh.mouseAreaDoable()){
		if(mouseptsnum > 1){
			var pt0 = sh.mouse_selection_points[0];
			var pt1 = sh.mouse_selection_points[1];
			var angle = Math.atan2(pt1.y - pt0.y, pt1.x - pt0.x);
			sh.con.strokeStyle = "blue";
			sh.con.lineWidth = 1;
			sh.con.beginPath();
			sh.con.arc(pt0.x, pt0.y, sh.mouse_selection_radius, angle + Math.PI*0.5, angle - Math.PI*0.5, false);
			sh.con.arc(pt1.x, pt1.y, sh.mouse_selection_radius, angle - Math.PI*0.5, angle + Math.PI*0.5, false);
			sh.con.lineTo(
				pt0.x + Math.cos(angle + Math.PI*0.5) * sh.mouse_selection_radius, 
				pt0.y + Math.sin(angle + Math.PI*0.5) * sh.mouse_selection_radius
			);
			sh.con.stroke();
		}
		else{
			sh.con.strokeStyle = "blue";
			sh.con.lineWidth = 1;
			sh.con.beginPath();
			sh.con.arc(sh.mouse_selection_points[mouseptsnum - 1].x, sh.mouse_selection_points[mouseptsnum - 1].y, 20, 0, Math.PI*2, false);
			sh.con.stroke();
		}
	}
	else{
		sh.con.strokeStyle = "blue";
		sh.con.lineWidth = 1;
		sh.con.beginPath();
		sh.con.moveTo(sh.mouse_selection_points[0].x - sh.mouse_selection_radius*0.7, sh.mouse_selection_points[0].y - sh.mouse_selection_radius*0.7);
		sh.con.lineTo(sh.mouse_selection_points[0].x + sh.mouse_selection_radius*0.7, sh.mouse_selection_points[0].y + sh.mouse_selection_radius*0.7);
		sh.con.stroke();
		sh.con.moveTo(sh.mouse_selection_points[0].x - sh.mouse_selection_radius*0.7, sh.mouse_selection_points[0].y + sh.mouse_selection_radius*0.7);
		sh.con.lineTo(sh.mouse_selection_points[0].x + sh.mouse_selection_radius*0.7, sh.mouse_selection_points[0].y - sh.mouse_selection_radius*0.7);
		sh.con.stroke();
	}
	
	
	/*
	sh.con.textAlign = "left";
	sh.con.fillStyle = "rgba(255, 255, 255, 0.8)";
	sh.con.font = "8pt Monospace";
	
	
	sh.con.fillText("real time " + sh.realtime(), 10, 60);
	sh.con.fillText("gametime	" + sh.gametime, 10, 75);
	sh.con.fillText("num of enemies " + sh.enemies.length, 10, 90);
	sh.con.fillText("num of playerbullets " + sh.player_bullets.length, 10, 105);
	sh.con.fillText("num of enemybullets " + sh.enemy_bullets.length, 10, 120);
	sh.con.fillText("mouseX " + sh.mouseX + " mouseY " + sh.mouseY, 10, 135);
	sh.con.fillText("mousedown " + sh.is_mouse_down, 10, 150);

	sh.con.fillText("mousedraw points " + sh.mouse_selection_points.length, 10, 165);
	if(sh.mouse_selection_points[1]) sh.con.fillText("arealen " + sh.dist(sh.mouse_selection_points[0], sh.mouse_selection_points[1]), 10, 180);
	*/

	if(!sh.gameOver){
		sh.con.textAlign = "left";
		sh.con.fillStyle = "rgba(255, 255, 255, 0.8)";
		sh.con.font = "8pt Monospace";
		sh.con.fillText("SCORE:" + sh.pad(sh.current_score, 12) + (sh.high_score ? " HI:" + sh.pad(sh.high_score, 12) : ""), 2, 10);
		sh.con.fillText("LIVES " + sh.player_lives, 2, 20);
		var hbwidth = Math.max(1, sh.special_counter / sh.special_counter_max * 50);
		sh.con.globalAlpha = 0.3;
		sh.con.drawImage(sh.images['heatbar'], 10, 30);
		if(sh.mouseAreaDoable()){
			sh.con.globalAlpha = Math.sin(sh.tick*0.3) * 0.5 + 0.5;
		}
		else sh.con.globalAlpha = 1;
		sh.con.drawImage(sh.images['heatbar'], 0, 0, hbwidth, 10, 10, 30, hbwidth, 10);
		sh.con.globalAlpha = 1;

		/*
		if(sh.player.overloaded() && Math.floor(sh.tick / 20) % 2 === 0) {
			sh.con.textAlign = "center";
			sh.con.fillStyle = "rgba(255, 0, 0, 0.5)";
			sh.con.font = "Bold 20pt Impact";
			sh.con.fillText("OVERLOAD", 120, 300);
		}
		*/
	} else {
		sh.con.textAlign = "center";
		sh.con.fillStyle = "rgba(255, 255, 255, 0.8)";
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


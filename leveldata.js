"use strict";

sh.genTestEnemy = function(){
	var new_enemy = Object.create(sh.gameObject);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.type = sh.gameObjectTypes.enemy;
	new_enemy.lifestarttime = sh.gametime;
	new_enemy.last_shot = -1;
	new_enemy.update = function(){
		this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.002) + 1) * 0.5 * (sh.canvas.width - this.width);
		
		if(sh.gametime - this.last_shot >= 800){
			var new_bullet = Object.create(sh.gameObject);
			new_bullet.width = 10;
			new_bullet.height = 10;
			new_bullet.x = this.x + this.width * 0.5 - new_bullet.width * 0.5;
			new_bullet.y = this.y - this.height;
			new_bullet.update = function(){
				this.y -= 0.3*sh.update_delay;
			}
			
			sh.enemy_bullets.push(new_bullet);
			
			this.last_shot = sh.gametime;
		}
	}
	sh.enemies.push(new_enemy);
}

sh.leveldata = [
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0111010001", function(){}],
["0111010001", function(){}],
["0000010001", function(){}],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0111010001", function(){}],
["0111010001", function(){}],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0111010001", function(){}],
["0111010001", function(){}],
["0000010001", function(){sh.genTestEnemy()}],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){sh.genTestEnemy()}],
["0010010001", function(){}],
["0010010001", function(){}],
["0111010001", function(){sh.genTestEnemy()}],
["0111010001", function(){}],
["1000110001", function(){}],
["0101010001", function(){sh.genTestEnemy()}],
["0010010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){sh.genTestEnemy()}],
["0111010001", function(){}],
["0111010001", function(){}],
["0000010001", function(){sh.genTestEnemy()}],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){sh.genTestEnemy()}],
["0010010001", function(){}],
["0101010101", function(){}],
["1010101010", function(){sh.genTestEnemy()}],
["0111010001", function(){}],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0010010001", function(){}],
["0111010001", function(){}],
["0111010001", function(){}],
["0000010001", function(){}],
["1111111111", function(){}],
["0101010001", function(){}],
["0010010001", function(){}],
["1111111111", function(){}],
["0010010001", function(){}],
["0111010001", function(){}],
["1111111111", function(){}]
];

"use strict";

sh.genTestEnemy = function(){
	var new_enemy = Object.create(sh.gameObject);
	new_enemy.x = 0;
	new_enemy.y = sh.view_bottom + sh.canvas.height + 48;
	new_enemy.type = sh.gameObjectTypes.enemy;
	new_enemy.lifestarttime = sh.gametime;
	new_enemy.update = function(){
		this.x = (Math.cos((sh.gametime - this.lifestarttime) * 0.002) + 1) * 0.5 * (sh.canvas.width - this.width);
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
["0010010001", sh.genTestEnemy],
["0111010001", function(){}],
["0111010001", function(){}],
["0000010001", sh.genTestEnemy],
["1000110001", function(){}],
["0101010001", function(){}],
["0010010001", sh.genTestEnemy],
["0010010001", function(){}],
["0101010101", function(){}],
["1010101010", sh.genTestEnemy],
["0111010001", sh.createSlowEnemy],
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

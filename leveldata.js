"use strict";

sh.primitive_tiles = {
	'.' : 'background',
	'1' : 'lava1',
	'2' : 'lava2',
	'3' : 'lava3',
	'4' : 'lava4',
	'a' : 'rock1',
	'b' : 'rock2',
	'c' : 'rock3',
	'd' : 'rock4',
	'T' : ['rock1', 'rock3']
}

sh.action_tiles = {
	'1' : function(){ sh.heatcounter += sh.lava_heat_value; },
	'2' : function(){ sh.heatcounter += sh.lava_heat_value; },
	'3' : function(){ sh.heatcounter += sh.lava_heat_value; },
	'4' : function(){ sh.heatcounter += sh.lava_heat_value; }
}

sh.random_tiles = {
	'L' : ['1', '2', '3', '4'],
	'R' : ['a', 'b', 'c', 'd']
}

sh.leveldata = [
["TTTTTTTTTT", function(){sh.evt(sh.winGameEvent);}],
["RRRRRRRRRR", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["..........", function(){}],
["TTTTTTTTTT", function(){}],
["TTLTTTTTTT", function(){sh.createTowerEnemy(100);}],
["TTTTTLTTTT", function(){}],
["TLTTTTTTTT", function(){sh.evt(sh.scrollSpeedInterpolateEvent(0.5, 120));}],
["TTTTTTTTTT", function(){}],
["TTTTTTTLTT", function(){}],
["TTLTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["..........", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTLTTLTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTLTTTLTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["..........", sh.createFastEnemy],
["TTTTTTTTTT", function(){}],
["TTTLTTTTTT", function(){}],
["TTTTTTTLTT", sh.createSlowEnemy],
["TTTTTTTTTT", function(){}],
["TLTTTTTTTT", function(){}],
["TTTTTTLTTT", sh.createFastEnemy],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["..........", function(){}],
["TTTTTTTTTT", sh.createFastEnemy],
["TTTTTTTTTT", function(){}],
["TTLTTTLTTT", function(){}],
["TTTTTTTTTT", sh.createSlowEnemy],
["TTTLTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["..........", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){}],
["TTTTTTTTTT", function(){sh.evt(sh.showTextEvent("Foobar", 50, 200));}],
["TTTTTTTTTT", function(){}]
];

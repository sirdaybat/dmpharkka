"use strict";

sh.primitive_tiles = {
	'x' : ['lava1', 'lava3'],
	'z' : ['lava2', 'lava4'],
	'a' : 'rock1',
	'b' : 'rock2',
	'c' : 'rock3',
	'd' : 'rock4'
}

sh.action_tiles = {
	'x' : function(){ sh.increaseCounter(sh.lava_heat_value); },
	'z' : function(){ sh.increaseCounter(sh.lava_heat_value); }
}

sh.random_tiles = {
	'L' : ['x', 'z'],
	'.' : ['a', 'b', 'c', 'd']
}

sh.leveldata = [
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.evt(sh.winGameEvent);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(0, 2*60));}],
["..........", function(){sh.createBoss();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["....L.....", function(){}],
["...LLL....", function(){}],
["....L.....", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["...LLLLLL.", function(){}],
["..LLLL....", function(){sh.evt(sh.showTextEvent("Huge enemy approaching!", 120, 160));}], // 3
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(true, 500)}],
["..........", function(){}],
["..........", function(){sh.createBigTowerEnemy(170);}],
["..........", function(){sh.createHorizontalTurret(false, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(true, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(false, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(true, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(false, 500)}],
["..........", function(){}],
["..........", function(){sh.createSpreadShooterEnemy();}],
["..........", function(){sh.createHorizontalTurret(true, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(false, 500)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(10);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(20);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(230);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(220);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(100);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(140);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){sh.createDirectedTurret(100, -0.75*Math.PI, 60, true); sh.createDirectedTurret(140, 0.75*Math.PI, 60, true);}],
["..........", function(){sh.createDirectedTurret(100, -0.25*Math.PI, 60, true); sh.createDirectedTurret(140, 0.25*Math.PI, 60, true);}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){sh.createDirectedTurret(100, -0.75*Math.PI, 60, true); sh.createDirectedTurret(140, 0.75*Math.PI, 60, true);}],
["..........", function(){sh.createDirectedTurret(100, -0.25*Math.PI, 60, true); sh.createDirectedTurret(140, 0.25*Math.PI, 60, true);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["LLL.......", function(){}],
["LLL.......", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
[".........L", function(){}],
[".......LLL", function(){}],
["........LL", function(){sh.createSpreadShooterEnemy();}],
["........L.", function(){}],
["..........", function(){sh.createSpreadShooterEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["...LLLLL..", function(){}],
["....LLLLL.", function(){sh.createBoringEnemy();}],
["......LLL.", function(){sh.createBoringEnemy();}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(10); sh.createTowerEnemy(100); sh.createTowerEnemy(230);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(75); sh.createTowerEnemy(165);}],
["..........", function(){}],
["..........", function(){}],
["..LLLL....", function(){sh.evt(sh.showTextEvent("Enemy core defenses", 120, 160));}], // 3
["..........", function(){sh.createTowerEnemy(30); sh.createTowerEnemy(120); sh.createTowerEnemy(210);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(75); sh.createTowerEnemy(165);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(30); sh.createTowerEnemy(120); sh.createTowerEnemy(210);}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(0.5, 60));}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
[".LLL......", function(){}],
["..LL......", function(){}],
["..LLLLL...", function(){}],
[".LLLLLL...", function(){}],
[".LLLLLL...", function(){}],
[".LLLLL....", function(){}],
[".LLLLL....", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBigTowerEnemy(90);}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(true, 500)}],
["..........", function(){sh.createTowerEnemy(130);}],
["..........", function(){sh.createHorizontalTurret(false, 500)}],
["..........", function(){sh.createTowerEnemy(110);}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(130);}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(110);}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(130);}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(110);}],
["..........", function(){}],
["..........", function(){}],
["..LLL.....", function(){}],
["..LLLLL...", function(){}],
["...LLLL...", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createHorizontalTurret(false)}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(1, 60));}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(30); sh.createSmallEnemy(60); sh.createSmallEnemy(180); sh.createSmallEnemy(210);}],
["..........", function(){sh.createSmallEnemy(20); sh.createSmallEnemy(50); sh.createSmallEnemy(190); sh.createSmallEnemy(220);}],
["..........", function(){sh.createSmallEnemy(30); sh.createSmallEnemy(60); sh.createSmallEnemy(180); sh.createSmallEnemy(210);}],
["..........", function(){sh.createSmallEnemy(20); sh.createSmallEnemy(50); sh.createSmallEnemy(190); sh.createSmallEnemy(220);}],
["..........", function(){}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(0.3, 120));}],
["..........", function(){}],
["..........", function(){sh.createDirectedTurret(80, 2.4, 100, true);}],
["..........", function(){sh.createDirectedTurret(80, 1, 100, true);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(160);}],
["..........", function(){sh.createSmallEnemy(80);}],
["..........", function(){sh.createSmallEnemy(140);}],
["..........", function(){sh.createSmallEnemy(100);}],
["..........", function(){}],
["..........", function(){}],
["...LL.....", function(){}],
["....L.....", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBigTowerEnemy(210);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
[".........L", function(){}],
[".......LLL", function(){}],
["........LL", function(){}],
[".........L", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["LL........", function(){sh.createSpiralShooterEnemy();}],
["LLL.......", function(){}],
["LLL.......", function(){}],
["L.....L...", function(){}],
["..........", function(){}],
[".LLLLLLLLL", function(){}],
["..LLLLLLLL", function(){}],
["..LLLLLLLL", function(){}],
["....LLLLLL", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(130); sh.createTowerEnemy(160); sh.createTowerEnemy(190);}],
["..........", function(){sh.createTowerEnemy(130); sh.createTowerEnemy(160); sh.createTowerEnemy(190);}],
["..........", function(){}],
["..........", function(){}],
["......L...", function(){}],
[".....LL...", function(){}],
[".....L....", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(50); sh.createSmallEnemy(80);}],
["..........", function(){sh.createSmallEnemy(60); sh.createSmallEnemy(90);}],
["..........", function(){sh.createSmallEnemy(70); sh.createSmallEnemy(100);}],
["..........", function(){sh.createSmallEnemy(80); sh.createSmallEnemy(110);}],
["..L.......", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){sh.createBoringEnemy();}],
["LLLLLL.LLL", function(){}],
["LLLLLL.LLL", function(){sh.createTowerEnemy(160);}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){sh.createBoringEnemy();}],
["LLL.LLLLLL", function(){}],
["LL...LLLLL", function(){sh.createTowerEnemy(70);}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){sh.createBoringEnemy();}],
["LLLLLLLLLL", function(){}],
["LLLLLLLLLL", function(){}],
[".L..L.LLL.", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..LL......", function(){sh.evt(sh.showTextEvent("Lava Fields", 120, 160));}], // 2
[".LL.......", function(){}],
[".LL.......", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(1, 60));}],
["....L.....", function(){sh.createSmallEnemy(119); sh.createSmallEnemy(120);}],
["...LL.....", function(){sh.createSmallEnemy(100); sh.createSmallEnemy(140);}],
["..........", function(){sh.createSmallEnemy(80); sh.createSmallEnemy(160);}],
["..........", function(){sh.createSmallEnemy(60); sh.createSmallEnemy(180);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBigTowerEnemy(100);}],
["..........", function(){}],
["..........", function(){sh.evt(sh.scrollSpeedInterpolateEvent(0.3, 80));}],
["..........", function(){}],
["..........", function(){}],
[".LL.......", function(){}],
[".LL.......", function(){}],
["..L.......", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(160);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(80);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(140);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(100);}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(190);}],
["..........", function(){}],
["......LL..", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(170);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(160);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(40);}],
["..........", function(){sh.createSmallEnemy(180);}],
["..........", function(){sh.createSmallEnemy(60);}],
[".........L", function(){sh.createSmallEnemy(160);}],
[".......LLL", function(){sh.createSmallEnemy(80);}],
["........LL", function(){sh.createSmallEnemy(140);}],
["..........", function(){sh.createSmallEnemy(100);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createBoringEnemy();}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(30); sh.createTowerEnemy(210);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(200);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(180);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(160);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(140);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(40);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(60);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(80);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(100);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(60);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTowerEnemy(200);}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(50);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(70);}],
["..........", function(){}],
["..........", function(){sh.createSmallEnemy(110);}],
["..........", function(){sh.evt(sh.showTextEvent("Mission start!", 120, 160));}], // 1
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){}],
["..LL......", function(){}],
[".LLLLL....", function(){}],
["..LLLLLLL.", function(){}],
["..........", function(){}],
["..........", function(){}],
["..........", function(){sh.createTutorialEnemy();}],
["..........", function(){sh.setScrollSpeed(0);}]
];
// 160 riviä ~= 1 minsa (nopeudella 5sek/pystyruudullinen)

var canvas;
var con;
var starttime;
var counter = 0;

function Ship(){
	this.x = 10;
	this.y = 10;
	this.w = 25;
	this.h = 25;
}

Ship.prototype.draw = function(){
	con.fillStyle = "red";
	con.fillRect(this.x, this.y, this.w, this.h);
}

var player = new Ship();

var update_delay = 20;
var draw_delay = 20;
var downkeys = [];

function keyDown(evt){
	downkeys[evt.keyCode] = true;
}

function keyUp(evt){
	downkeys[evt.keyCode] = false;
}

function realtime(){
	return (new Date()).getTime() - starttime;
}

function init(){
	canvas = document.getElementById("can");
	con = canvas.getContext("2d");
	
	starttime = (new Date()).getTime();

	window.addEventListener("keydown", keyDown, true);
	window.addEventListener("keyup", keyUp, false);

	window.setInterval("update()", update_delay);
	window.setInterval("draw()", draw_delay);
}

function update(){
	while(counter < realtime()){
		if(downkeys[65]) player.x -= 0.2*update_delay;
		if(downkeys[68]) player.x += 0.2*update_delay;
		if(downkeys[87]) player.y -= 0.2*update_delay;
		if(downkeys[83]) player.y += 0.2*update_delay;
		counter += update_delay;
	}
	while(counter > realtime());
}

function draw(){
	con.fillStyle = "black";
	con.fillRect(0, 0, canvas.width, canvas.height);
	con.fillStyle = "red";
	
	con.font = "10pt Monospace";
	con.fillText("real time " + realtime(), 10, 30);
	con.fillText("counter   " + counter, 10, 60);
	
	player.draw();
}
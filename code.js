if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

var canvas;
var con;
var starttime;
var counter = 0;

var view_bottom = 0;
var scrollspeed = 320/5/1000;

function scrY(wrdy){
	return canvas.height - 1 - wrdy + view_bottom;
}

function wrdY(scry){
	return canvas.height - 1 - scry + view_bottom;
}

function Thing(){
	this.x = 10;
	this.y = 50;
	this.w = 24;
	this.h = 24;
}

Thing.prototype.draw = function(){
	con.fillStyle = "red";
	con.fillRect(this.x, scrY(this.y), this.w, this.h);
}

var backimg = new Image();

var player = new Thing();

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
	
	backimg.src = "resources/background-24x24.png";
}

function update(){
	while(counter < realtime()){
		view_bottom += scrollspeed*update_delay;
		
		if(downkeys[65]) player.x -= 0.2*update_delay;
		if(downkeys[68]) player.x += 0.2*update_delay;
		if(downkeys[87]) player.y += 0.2*update_delay;
		if(downkeys[83]) player.y -= 0.2*update_delay;
		player.y += scrollspeed*update_delay;
		
		counter += update_delay;
	}
	while(counter > realtime());
}

function draw(){
	con.fillStyle = "black";
	con.fillRect(0, 0, canvas.width, canvas.height);
	con.fillStyle = "red";
	
	var y;
	var back_start = wrdY(canvas.height-1);
	var back_end = wrdY(0);
	for(y = back_start; y <= back_end + 24; y += 24){
		var back_idx = Math.floor(y / 24);
		var scry = scrY(back_idx*24+23);
		for(i = 0; i < 10; i++){
			if(background[background.length - 1 - back_idx].charAt(i) == '1') con.drawImage(backimg, i*24, scry);
		}
	}
	
	
	con.font = "10pt Monospace";
	con.fillText("real time " + realtime(), 10, 30);
	con.fillText("counter   " + counter, 10, 60);
	
	
	
	
	
	
	player.draw();

}

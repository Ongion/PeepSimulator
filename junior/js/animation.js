var scale = .25;
var stageHeight = 457;
var stageWidth = 457;
var peepWidth = 202;
var peepHeight = 304;
var abPath = function(frame, stage, image) {image.move(0, stage.getHeight() / 300);}
var cPath = function(frame, stage, image) {
	if (image.getY() < 3 * stage.getHeight() / 4) image.move(0, stage.getHeight() / 300);
	else image.move(stage.getHeight() / 300, 0);
}
var isClickable = {};
var currentPlan;
function planA() {
	currentPlan = 'planA';
	isClickable.machineA = true;
	isClickable.machineB = false;
	isClickable.machineC = false;
	isClickable.machineD = false;
}
function planB() {
	planA();
	currentPlan = 'planB';
}
function planC() {
	currentPlan = 'planC';
	isClickable.machineA = true;
	isClickable.machineB = true;
	isClickable.machineC = true;
	isClickable.machineD = true;
}
function updatePlan() {
	if (currentPlan == 'planA' && buffer.length == 0) shiftMachinesRight(); 
	else if (currentPlan == 'planB') shiftMachinesRight();
}
function shiftMachinesRight() {
	if (isClickable.machineA) {
		isClickable.machineA = false;
		isClickable.machineB = true;
	} else if (isClickable.machineB) {
		isClickable.machineB = false;
		isClickable.machineC = true;
	} else if (isClickable.machineC) {
		isClickable.machineC = false;
		isClickable.machineD = true;
	} else if (isClickable.machineD) {
		isClickable.machineD = false;
		isClickable.machineA = true;
	}
}

var stage = new Kinetic.Stage({
	container: 'container',
	width: stageWidth,
	height: stageHeight
});
var layer = new Kinetic.Layer();
stage.add(layer);
window.setInterval(function() {for (var i = 0; i < machines.length; i++) {Peep(i, abPath);}}, 1500);

function Peep(machine, path) {
	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			x: (2 * machine + 1) * stageHeight / 8 - scale * peepWidth / 2,
			y: - peepHeight * scale,
			scale: {x: scale, y: scale},
			image: imageObj
		});
		
		image.on('click', function() {
			if (isClickable[machines[machine]]) {
				addPeep(machines[machine]);
				updatePlan();
				image.clearImageHitRegion();
				image.remove();
				imageObj.remove();
			}
		});
		image.createImageHitRegion(function() {layer.drawHit();});
		layer.add(image);

		new Kinetic.Animation(function(frame){
			path(frame, stage, image);
			if (image.getY() > stage.getHeight() || image.getX() > stage.getWidth()) {
				image.clearImageHitRegion();
				image.remove();
				imageObj.remove();
				delete this;
			}
		}, layer).start();
	}
	imageObj.src = "../images/peep" + machine + ".png";
}
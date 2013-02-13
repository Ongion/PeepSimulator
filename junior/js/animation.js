var scale = .15;
var stageHeight = 457;
var stageWidth = 457;
var peepWidth = 202;
var peepHeight = 304;
var path = function(frame, stage, image) {
	if (image.getX() < 397.5 - scale * image.getWidth() / 2 && image.getY() < 362.5 - scale * image.getHeight() / 2) {
		if (currentPlan == 'planC') image.move(0, stage.getHeight() / 150);
		else image.move(0, stage.getHeight() / 450);
	} else if (image.getX() < 397.5 - scale * image.getWidth() / 2) {
		if (currentPlan == 'planC') image.move(stage.getHeight() / 150, 0);
		else image.move(stage.getHeight() / 450, 0);
	} else {
		image.move(0, stage.getHeight() / 450);
		if (image.getY() < - image.getHeight()) return true;
	}
	return false;
}
var isClickable = {};
function planA() {
	var stageShift = new Kinetic.Animation(function(frame){
		if (stage.getY() + stageHeight / 50 > 0) {
			stage.setY(0);
			stageShift.stop();
		} else stage.setY(stage.getY() + stageHeight / 50);
	}, layer);
	stageShift.start();
	
	stage.draw();
	var peeps = layer.get('.peep');
	for (var i = 0; i < peeps.length; i++) {
		peeps[i].remove();
	}
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
	var stageShift = new Kinetic.Animation(function(frame){
		if (stage.getY() - stageHeight / 50 < - stageHeight) {
			stage.setY(- stageHeight);
			stageShift.stop();
		} else stage.setY(stage.getY() - stageHeight / 50);
	}, layer);
	stageShift.start();
	
	stage.draw();
	var peeps = layer.get('.peep');
	for (var i = 0; i < peeps.length; i++) {
		peeps[i].remove();
	}
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
window.setInterval(function() {for (var i = 0; i < machines.length; i++) {Peep(i, path);}}, 1500);

var backgroundObj = new Image();
var backgroundImage;
backgroundObj.onload = function() {
	backgroundImage = new Kinetic.Image({
		x: 0,
		y: 0,
		image: backgroundObj
	});
	backgroundImage.createImageHitRegion(function() {layer.drawHit();});
	layer.add(backgroundImage);
}
backgroundObj.src = "../images/background.png";

function Peep(machine, path) {
	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			x: 5 + (2 * machine + 1) * 42.5 - scale * peepWidth / 2 + 25 * (Math.random() - .5),
			y: - peepHeight * scale + 180 * (Math.random() - .5),
			scale: {x: scale, y: scale},
			image: imageObj,
			name: 'peep'
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
		backgroundImage.moveToTop();

		var removeIfNecessary = function() {
			if (image.getY() > stage.getHeight() || image.getX() > stage.getWidth()) {
				layer.remove(this);
			}
		}
		
		// new Kinetic.Animation(function(frame){
			// path(frame, stage, image);
			// if (image.getY() > stage.getHeight() || image.getX() > stage.getWidth()) {
				// image.clearImageHitRegion();
				// image.remove();
				// imageObj.remove();
				// delete this;
			// }
		// }, layer).start();
	}
	if (currentPlan == 'planC') imageObj.src = "../images/peep4.png";
	else imageObj.src = "../images/peep" + machine + ".png";
}

var anim = new Kinetic.Animation(function(frame){
	var peeps = layer.get('.peep');
	for (var i = 0; i < peeps.length; i++) {
		var thePeep = peeps[i];
		path(frame, stage, thePeep);
		if (thePeep.getY() > 2 * stage.getHeight() || thePeep.getX() > stage.getWidth()) {
				thePeep.remove();
		}
	}
}, layer);

anim.start();
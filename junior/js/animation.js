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
isClickable = {machineA : true, machineB : false, machineC : false, machineD : false};
function updatePlan() {
	if (currentPlan == 'planA' && buffer.length == 0) shiftMachinesRight(); 
	else if (currentPlan == 'planB') shiftMachinesRight();
}
function shiftMachinesRight() {
	if (isClickable.A) {
		isClickable.A = false;
		isClickable.B = true;
	} else if (isClickable.B) {
		isClickable.B = false;
		isClickable.C = true;
	} else if (isClickable.C) {
		isClickable.C = false;
		isClickable.D = true;
	} else if (isClickable.D) {
		isClickable.D = false;
		isClickable.A = true;
	}
}

var stage = new Kinetic.Stage({
	container: 'container',
	width: stageWidth,
	height: stageHeight
});
var layer = new Kinetic.Layer();
stage.add(layer);

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

function Peep(machine) {
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
			if (isClickable[machineList[machine]]) {
				addPeep(machineList[machine]);
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
			if (image.getY() > stage.getHeight() || image.getX() > stage.getWidth()) layer.remove(this);
		}
	}
	if (currentPlan == 'planC') imageObj.src = "../images/peepE.png";
	else imageObj.src = "../images/peep" + machineList[machine] + ".png";
}
var timeCount = 0;
var anim = new Kinetic.Animation(function(frame){
	var peeps = layer.get('.peep');
	timeCount += 1;
	for (var i = 0; i < peeps.length; i++) {
		var thePeep = peeps[i];
		path(frame, stage, thePeep);
		if (thePeep.getY() > 2 * stage.getHeight() || thePeep.getX() > stage.getWidth()) {
				thePeep.remove();
		}
	}
	if (timeCount >= 90) {
		for (var i = 0; i < 4; i++) {
			var j = i;
			if (currentPlan == 'planC') j = Math.floor(4 * Math.random());
			Peep(j);
		}
		timeCount = 0;
	}
}, layer);

anim.start();
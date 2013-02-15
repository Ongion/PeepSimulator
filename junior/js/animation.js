var scale = .3;
var stageHeight = 800;
var stageWidth = 928;
var peepWidth = 202;
var peepHeight = 304;
var delFlag = false;
var path = function(frame, stage, image) {
	if (image.getX() < 695 - scale * image.getWidth() / 2 && image.getY() < 634 - scale * image.getHeight() / 2) {
		if (currentPlan == 'C') image.move(0, stage.getHeight() / 100);
		else image.move(0, stage.getHeight() / 450);
	} else if (image.getX() < 695 - scale * image.getWidth() / 2) {
		if (currentPlan == 'C') image.move(stage.getHeight() / 100, 0);
		else image.move(stage.getHeight() / 450, 0);
	} else {
		image.move(0, stage.getHeight() / 450);
		if (image.getY() < - image.getHeight()) return true;
	}
	return false;
}
function updatePlan() {
	if (currentPlan == 'A' && buffer.length == 0) shiftMachinesRight(); 
	else if (currentPlan == 'B') shiftMachinesRight();
}
function shiftMachinesRight() {
	if (isClickable.A) {
		isClickable.A = false;
		isClickable.B = true;
		backgroundImage = backgroundImageB;
	} else if (isClickable.B) {
		isClickable.B = false;
		isClickable.C = true;
		backgroundImage = backgroundImageC;
	} else if (isClickable.C) {
		isClickable.C = false;
		isClickable.D = true;
		backgroundImage = backgroundImageD;
	} else if (isClickable.D) {
		isClickable.D = false;
		isClickable.A = true;
		backgroundImage = backgroundImageA;
	}
	backgroundImage.moveToTop();
}

var stage = new Kinetic.Stage({
	container: 'container',
	height: stageHeight,
	width: stageWidth
});
var layer = new Kinetic.Layer();
stage.add(layer);

var backgroundObjB = new Image();
var backgroundImageB;
backgroundObjB.onload = function() {
	backgroundImageB = new Kinetic.Image({
		x: 0,
		y: 0,
		image: backgroundObjB
	});
	backgroundImageB.createImageHitRegion(function() {layer.drawHit();});
	layer.add(backgroundImageB);
}
backgroundObjB.src = "../images/backgroundB.png";

var backgroundObjC = new Image();
var backgroundImageC;
backgroundObjC.onload = function() {
	backgroundImageC = new Kinetic.Image({
		x: 0,
		y: 0,
		image: backgroundObjC
	});
	backgroundImageC.createImageHitRegion(function() {layer.drawHit();});
	layer.add(backgroundImageC);
}
backgroundObjC.src = "../images/backgroundC.png";

var backgroundObjD = new Image();
var backgroundImageD;
backgroundObjD.onload = function() {
	backgroundImageD = new Kinetic.Image({
		x: 0,
		y: 0,
		image: backgroundObjD
	});
	backgroundImageD.createImageHitRegion(function() {layer.drawHit();});
	layer.add(backgroundImageD);
}
backgroundObjD.src = "../images/backgroundD.png";

var backgroundObjA = new Image();
var backgroundImageA;
backgroundObjA.onload = function() {
	backgroundImageA = new Kinetic.Image({
		x: 0,
		y: 0,
		image: backgroundObjA
	});
	backgroundImageA.createImageHitRegion(function() {layer.drawHit();});
	layer.add(backgroundImageA);
}
backgroundObjA.src = "../images/backgroundA.png";
var backgroundImage = backgroundImageA;

function Peep(machine) {
	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			x: 8 + (2 * machine + 1) * 74 - scale * peepWidth / 2 + 40 * (Math.random() - .5),
			y: - peepHeight * scale + 360 * (Math.random() - .5),
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
			};
		});
		image.createImageHitRegion(function() {layer.drawHit();});
		layer.add(image);
		backgroundImage.moveToTop();

		var removeIfNecessary = function() {
			if (image.getY() > stage.getHeight() || image.getX() > stage.getWidth()) layer.remove(this);
		}
	}
	imageObj.alt = machine;
	
	if (currentPlan == 'C') imageObj.src = "../images/peepE.png";
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
			if (currentPlan == 'C') j = Math.floor(4 * Math.random());
			Peep(j);
		}
		timeCount = 0;
	}
}, layer);

anim.start();
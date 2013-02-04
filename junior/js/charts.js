// Shortcuts
function drawChart() {chart.draw(chartData, chartOptions);}
function drawSpreadsheet() {spreadsheet.draw(spreadsheetData, spreadsheetOptions);}
// Data manipulators
function addRow(num, machine) {
	total += num;
	sqtotal += Math.pow(num, 2);
	var count = data.getNumberOfRows() + 1;
	if (count <= 25) {
		data.mean = total / count;
		data.controlLimit = 3 * Math.sqrt((sqtotal - total * data.mean) / count);
	}
	data.addRow([count,  num, data.mean, data.mean + data.controlLimit, data.mean - data.controlLimit, machines[machine].name]);
	setMean(count, data.mean, data.controlLimit);
	buffer.length = 0;
	drawSpreadsheet();
	if (count >= 25) drawChart();
}
function setMean(count, mean, controlLimit) {
	data.setValue(0, 2, mean);
	data.setValue(0, 3, mean + controlLimit);
	data.setValue(0, 4, mean - controlLimit);
	if (count > 2) {
		data.setValue(count - 2, 2, null);
		data.setValue(count - 2, 3, null);
		data.setValue(count - 2, 4, null);
	}
}
// Some testing helpers
function addPeep(machine) {
	var rand = Math.round(machines[machine].distribution.getRand());
	buffer[buffer.length] = rand;
	if (buffer.length >= 4) addRow(mean(buffer), machine);
	return rand;
}
function addPeeps(count) {for (var i = 0; i < count; i++) for (var j = 0; j < 4; j++) addPeep(i % 4);}
// Machine setting functions
function selectMachine() {
	var selectedMachine = machines[document.getElementById('selectedMachine').value];
	// Set selectedDistribution
	for (var i = 0; i < distributions.length; i++) {
		if (distributions[i][1].prototype == Object.getPrototypeOf(selectedMachine.distribution)) {
			document.getElementById('selectedDistribution').selectedIndex = i;
			break;
		}
	}
	
	selectDistribution();
		
	document.getElementById('mu').value = selectedMachine.distribution.mu == undefined ? '' : selectedMachine.distribution.mu;
	document.getElementById('stdDev').value = selectedMachine.distribution.sigma == undefined ? '' : selectedMachine.distribution.sigma;
	document.getElementById('mean').value = selectedMachine.distribution.mean == undefined ? '' : selectedMachine.distribution.mean;
	document.getElementById('min').value = selectedMachine.distribution.min == undefined ? '' : selectedMachine.distribution.min;
	document.getElementById('max').value = selectedMachine.distribution.max == undefined ? '' : selectedMachine.distribution.max;
	}

function selectDistribution() {
	var selectedDistribution = distributions[document.getElementById('selectedDistribution').value][1]
	muRow = document.getElementById('muRow');
	stdDevRow = document.getElementById('stdDevRow');
	meanRow = document.getElementById('meanRow');
	minRow = document.getElementById('minRow');
	maxRow = document.getElementById('maxRow');
	// Display only relevant parameters
	if (selectedDistribution == normalDist) {
		muRow.style.display = '';
		stdDevRow.style.display = '';
		meanRow.style.display = 'none';
		minRow.style.display = 'none';
		maxRow.style.display = 'none';
	} else if (selectedDistribution == expDist) {
		muRow.style.display = 'none';
		stdDevRow.style.display = 'none';
		meanRow.style.display = '';
		minRow.style.display = 'none';
		maxRow.style.display = 'none';
	} else if (selectedDistribution == unifDist) {
		muRow.style.display = 'none';
		stdDevRow.style.display = 'none';
		meanRow.style.display = 'none';
		minRow.style.display = '';
		maxRow.style.display = '';
	}
}


function changeMachineSettings() {
	//if (confirm("Are you sure? This will clear all data you have collected so far.")) {
		var selectedMachine = machines[document.getElementById('selectedMachine').value];
		var selectedDistribution = distributions[document.getElementById('selectedDistribution').value][1];
		if (selectedDistribution == normalDist) {
			var mu = parseFloat(document.getElementById('mu').value);
			var stdDev = parseFloat(document.getElementById('stdDev').value);
			selectedMachine.distribution = new normalDist(mu, stdDev);
		} else if (selectedDistribution == expDist) {
			var mean = parseFloat(document.getElementById('mean').value);
			selectedMachine.distribution = new expDist(mean);
		} else if (selectedDistribution == unifDist) {
			var min = parseFloat(document.getElementById('min').value);
			var max = parseFloat(document.getElementById('max').value);
			selectedMachine.distribution = new unifDist(min, max);
		}
		alert("Changes applied!");
	//}
		//means[selectedMachine] = parseInt(document.getElementById('mean').value, 10);
		//stdDevs[selectedMachine] = parseInt(document.getElementById('stdDev').value, 10);
		//clearData();
}
// Button onclick functions
function generateChart() {
	if (data.getNumberOfRows() >= 25) drawChart();
	else alert("Not enough data to create a valid control chart.");
}
function exportData() {alert("This feature has not yet been implemented.");}
function clearData() {
	data.removeRows(0, data.getNumberOfRows());
	total = 0;
	sqtotal = 0;
	buffer.length = 0;
	resetPlan();
	drawChart();
	drawSpreadsheet();
}
// Math helpers
function mean(array) {
	var total = 0;
	$.each(array, function() {total += this;});
	return Math.round(total / array.length);
}

function uniformRandom(min, max) {
	return min + Math.random() * (max-min);
}

function exponentialRandom(mean) {
	var lambda = 1.0/mean
	var u = uniformRandom(0,1);
	return -Math.log(1-u)/lambda;
}	
	
function normalRandom(mu, sigma) {
	var u1 = uniformRandom(0,1);
	var u2 = uniformRandom(0,1);
	var z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
	return mu + z1 * sigma;
}
//function normalRandom(mean, stdDev) {return Math.round(((Math.random() * 2 - 1)+(Math.random() * 2 - 1)+(Math.random() * 2 - 1)) * stdDev + mean);}
// TODO: Make it so that selecting a data value in either chart will highlight the corresponding value in the other chart.
// TODO: Support for other plans.
// TODO: Format radio buttons.
// TODO: Format machine settings better.
// TODO: Make UCL, LCL, and Mean update dynamically.
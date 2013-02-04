// Package loading and initial function call.
google.load("visualization", "1", {packages:["corechart"]});
google.load("visualization", "1", {packages:["table"]});
google.setOnLoadCallback(initializeData);
// Variable initializations.

function normalDist(mu, sigma) {
	this.mu = mu;
	this.sigma = sigma;
	this.getRand = function(){return normalRandom(mu,sigma);};
}

function expDist(mean) {
	this.mean = mean;
	this.getRand = function(){return exponentialRandom(mean);};
}

function unifDist(min, max) {
	this.min = min;
	this.max = max;
	this.getRand = function(){return uniformRandom(min,max);};
}

function machine(name, distribution, id) {
	this.name = name;
	this.distribution = distribution;
	this.id = id;
}

var distributions = new Array(new Array("Normal Distribution", normalDist),
							  new Array("Exponential Distribution", expDist),
							  new Array("Uniform Distribution", unifDist));

var machines = new Array(new machine("A", new normalDist(1000, 100), 0),
						 new machine("B", new normalDist(1000, 100), 1),
						 new machine("C", new expDist(1000), 2),
						 new machine("D", new unifDist(900,1100), 3));
var means = new Array(1000, 1100, 1200, 1300);
var stdDevs = new Array(100, 150, 200, 250);
var buffer = new Array();
var total = 0;
var sqtotal = 0;

var chart;
var spreadsheet;
var data;
var chartData;
var spreadsheetData;
var spreadsheetOptions = {
	page: 'enable',
	width: '100%',
	height: 288,
	pageSize: 10,
	sortColumn: 0,
	sortAscending: false
};
var chartOptions = {
	hAxis: {
		gridlines: {
			count: 5,
			color: '#FFFFFF'
		},
		title: 'Peep Number'
	},
	vAxis: {
		gridlines: {
			count: 2,
			color: '#FFFFFF'
		},
		title: 'Fluffiness'
	},
	height: 400,
	animation: {
		duration: 250,
		easing: 'linear'
	},
	interpolateNulls: true
};

// Helper Functions
function generateDistHTML() {
	var html = "";
	for (var i = 0; i < distributions.length; i++) {
		html += '<option value="'+i+'">'+distributions[i][0]+'</option>\n'
	}
	return html;
}

function generateMachHTML() {
	var html = "";
	for (var i = 0; i < machines.length; i++) {
		html += '<option value="'+i+'">Machine '+machines[i].name+'</option>\n'
	}
	return html;
}

function initializeData() {
	data = new google.visualization.DataTable();
	data.addColumn('number', 'Peep Number');
	data.addColumn('number', 'Fluffiness');
	data.addColumn('number', 'Mean');
	data.addColumn('number', 'UCL');
	data.addColumn('number', 'LCL');
	data.addColumn('string', 'Machine');

	chart = new google.visualization.LineChart(document.getElementById('chart'));
	chartData = new google.visualization.DataView(data);
	chartData.setColumns([0, 1, 2, 3, 4]);
	drawChart();
	spreadsheet = new google.visualization.Table(document.getElementById('spreadsheet'));
	spreadsheetData = new google.visualization.DataView(data);
	spreadsheetData.setColumns([0, 1, 5]);
	drawSpreadsheet();
	
	google.visualization.events.addListener(chart, 'select', function() {
		spreadsheet.setSelection([{row: chart.getSelection()[0].row}]);
	});
	google.visualization.events.addListener(spreadsheet, 'select', function() {
		chart.setSelection(spreadsheet.getSelection());
	});
	
	document.getElementById('selectedMachine').innerHTML = generateMachHTML();
	document.getElementById('selectedDistribution').innerHTML = generateDistHTML();
	selectMachine();
}

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
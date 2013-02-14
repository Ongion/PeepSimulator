google.load("visualization", "1", {packages:["corechart"]});
google.load("visualization", "1", {packages:["table"]});
google.setOnLoadCallback(initializeData);

// Distributions
function normalDistribution(params) {return params.Mu + Math.sqrt(-2 * Math.log(uniformRandom(0, 1))) * Math.cos(2 * Math.PI * uniformRandom(0, 1)) * params.Sigma;}
function uniformDistribution(params) {return uniformRandom(params.Minimum, params.Maximum)}
function exponentialDistribution(params) {
	var lambda = 1.0 / params.Mean;
	var u = uniformRandom(0, 1);
	return -Math.log(1 - u) / lambda;
}
function machine(distribution) {
	this.params = {};
	this.distribution = distribution;
	// function.name is not a standard property
	var params = window[distribution.toString().match(/^function ([^(]+)/)[1] + 'Default'];
	for (param in params) this.params[param] = params[param];
	this.getRand = function() {return distribution(this.params);};
}
// Default Machine Values
var normalDistributionDefault = {Mu: 1000, Sigma: 100};
var exponentialDistributionDefault = {Mean: 1000};
var uniformDistributionDefault = {Minimum: 900, Maximum:1100};
// Default Machines
var machines = {A : new machine(normalDistribution), B : new machine(normalDistribution), C : new machine(exponentialDistribution), D : new machine(exponentialDistribution)};
// Called when we change which machine is selected in Machine Settings
function selectMachine() {
	$('#parameters tr').hide();
	var selectedMachine = machines[$('#selectedMachine').val()];
	for (param in selectedMachine.params) {
		$('#'+param).show();
		$('#'+param+'Val').val(selectedMachine.params[param]);
	}
	$('#selectedDistribution').val(selectedMachine.distribution.name);
}
// Called when we change which distribution is selected in Machine Settings
function selectDistribution() {
	$('#parameters tr').hide();
	var selectedDist = window[$('#selectedDistribution').val()+"Default"];
	for (param in selectedDist) {
		$('#'+param).show();
		$('#'+param+'Val').val(selectedDist[param]);
	}
}
// Called when we hit Apply Changes in Machine Settings
function saveMachine() {
	var selectedDist = window[$('#selectedDistribution').val()];
	window[$('#selectedMachine').val()] = new machine(selectedDist);
	var selectedMachine = window[$('#selectedMachine').val()];
	for (param in selectedMachine.params) selectedMachine.params[param] = parseInt($('#'+param+'Val').val(), 10);
	alert("Changes Saved!");
}
// Miscellaneous Data Vars
var buffer = new Array();
var totals = {A : 0, B : 0, C : 0};
var total = totals['A'];
var sqtotals = {A : 0, B : 0, C : 0};
var sqtotal = sqtotals['A'];
// Google Charts Vars
var chart;
var rchart;
var spreadsheet;
var currentData;
var currentRData;
var datasets;
var datasetsR;
var emptyData;
var emptyRData;
var chartDataAdapter;
var spreadsheetDataAdapter;
var spreadsheetOptions = {
	page: 'enable',
	width: '100%',
	height: 288,
	pageSize: 10,
	sortColumn: 0,
	sortAscending: false
};
var chartOptions = {
	hAxis: {gridlines: {count: 5, color: '#FFFFFF'}, title: 'Peep Number'},
	vAxis: {gridlines: {count: 2, color: '#FFFFFF'}, title: 'Fluffiness'},
	height: 400,
	animation: {duration: 250, easing: 'linear'},
	interpolateNulls: true
};
// Start Everything
function initializeData() {
	var cols = new Array('Peep Number', 'Fluffiness', 'Mean', 'UCL', 'LCL');
	var rcols = new Array('Peep Number', 'Fluffiness', 'Range', 'UCL', 'LCL');
	datasets = {A : new google.visualization.DataTable(), B : new google.visualization.DataTable(), C : new google.visualization.DataTable()};
	datasetsR = {A : new google.visualization.DataTable(), B : new google.visualization.DataTable(), C : new google.visualization.DataTable()};
	emptyData = new google.visualization.DataTable();
	emptyRData = new google.visualization.DataTable();
	for (var i = 0; i < cols.length; i++) {
		datasets['A'].addColumn('number', cols[i]);
		datasets['B'].addColumn('number', cols[i]);
		datasets['C'].addColumn('number', cols[i]);
		emptyData.addColumn('number', cols[i]);
	}
	for (i = 0; i < rcols.length; i++) {
		datasetsR['A'].addColumn('number', cols[i]);
		datasetsR['B'].addColumn('number', cols[i]);
		datasetsR['C'].addColumn('number', cols[i]);
		emptyRData.addColumn('number', cols[i]);
	}
	changePlan('A');
	chart = new google.visualization.LineChart(document.getElementById('chart'));
	rchart = new google.visualization.LineChart(document.getElementById('rchart'));
	spreadsheet = new google.visualization.Table(document.getElementById('spreadsheet'));
	updateCharts();
	
	google.visualization.events.addListener(chart, 'select', function() {spreadsheet.setSelection([{row: chart.getSelection()[0].row}]);});
	google.visualization.events.addListener(rchart, 'select', function() {spreadsheet.setSelection([{row: rcharts.getSelection()[0].row}]);});
	google.visualization.events.addListener(spreadsheet, 'select', function() {chart.setSelection(spreadsheet.getSelection());});
	selectMachine();
}
function updateCharts() {
	var chartData = new google.visualization.DataView(currentData);
	chartData.setColumns([0, 1, 2, 3, 4]);

	var rchartData = new google.visualizatoin.DataView(currentRData);
	rchartData.setColumns([0, 1, 2, 3, 4]);
	drawRChart();

	var spreadsheetData = new google.visualization.DataView(currentData);
	spreadsheetData.setColumns([0, 1]);
	drawSpreadsheet();
}
// Shortcuts
function drawChart() {
	if (currentData.getNumberOfRows() >= 25 && chart){
		chart.draw(chartData, chartOptions);
		rchart.draw(rchartData, chartOptions);
	}
	else if (chart && rchart) {
		chart.draw(emptyData, chartOptions);
		rchart.draw(emptyRData, chartOptions);
	}
}

function drawSpreadsheet() {if (spreadsheet) spreadsheet.draw(spreadsheetData, spreadsheetOptions);}
// Data Manipulators
function addRow(num, machine) {
	total += num;
	sqtotal += Math.pow(num, 2);
	var count = currentData.getNumberOfRows() + 1;
	if (count <= 25) {
		currentData.mean = total / count;
		currentData.controlLimit = 3 * Math.sqrt((sqtotal - total * currentData.mean) / count);
	}
	currentData.addRow([count, num, currentData.mean, currentData.mean + currentData.controlLimit, currentData.mean - currentData.controlLimit]);
	currentRData.addRow([count, num, currentRData.
	setMean(count, currentData.mean, currentData.controlLimit);
	buffer.length = 0;
	drawSpreadsheet();
	if (count >= 25) drawChart();
}
// Sets the mean, UCL, and LCL for our chart
function setMean(count, mean, controlLimit) {
	currentData.setValue(0, 2, mean);
	currentData.setValue(0, 3, mean + controlLimit);
	currentData.setValue(0, 4, mean - controlLimit);
	if (count > 2) {
		currentData.setValue(count - 2, 2, null);
		currentData.setValue(count - 2, 3, null);
		currentData.setValue(count - 2, 4, null);
	}
}
// Some testing helpers
function addPeep(machine) {
	var rand = Math.round(machines[machine].getRand());
	buffer[buffer.length] = rand;
	if (buffer.length >= 4) addRow(mean(buffer), machine);
	return rand;
}
var machineList = ['A', 'B', 'C', 'D'];
function addPeeps(count) {for (var i = 0; i < count; i++) for (var i = 0; i < machineList.length; i++) addPeep(machineList[i]);}
// Button Clicks
function clearData() {
	currentData.removeRows(0, currentData.getNumberOfRows());
	total = 0;
	sqtotal = 0;
	buffer.length = 0;
	drawChart();
	drawSpreadsheet();
}
// Plan Changing!
function changePlan(plan) {
	currentData = datasets[plan];
	total = totals[plan];
	sqtotal = sqtotals[plan];
	currentPlan = 'plan' + plan;
	var peeps = layer.get('.peep');
	for (var i = 0; i < peeps.length; i++) peeps[i].remove();
	window['plan' + plan]();
	updateCharts();
}
function planA() {
	var stageShift = new Kinetic.Animation(function(frame){
		if (stage.getY() + stageHeight / 50 > 0) {
			stage.setY(0);
			stageShift.stop();
		} else stage.setY(stage.getY() + stageHeight / 50);
	}, layer);
	stageShift.start();
	stage.draw();
	
	isClickable = {A : true, B : false, C : false, D : false};
}
var planB = planA;
function planC() {
	var stageShift = new Kinetic.Animation(function(frame){
		if (stage.getY() - stageHeight / 50 < - stageHeight) {
			stage.setY(- stageHeight);
			stageShift.stop();
		} else stage.setY(stage.getY() - stageHeight / 50);
	}, layer);
	stageShift.start();
	stage.draw();
	
	isClickable = {A : true, B : true, C : true, D : true};
}
// Math Helpers
function uniformRandom(min, max) {return min + Math.random() * (max - min);}

function mean(array) {
	var total = 0;
	$.each(array, function() {total += this;});
	return Math.round(total / array.length);
}

function range(array) {
	var max = array[0];
	var min = array[0];

	for (i = 1; i < array.length; i++) {
		if (array[i] > max) max = array[i];
		if (array[i] < min) min = array[i];
	}
}
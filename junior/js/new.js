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
var machines = new Array('machineA', 'machineB', 'machineC', 'machineD');
var machineA = new machine(normalDistribution);
var machineB = new machine(normalDistribution);
var machineC = new machine(exponentialDistribution);
var machineD = new machine(uniformDistribution);
// Called when we change which machine is selected in Machine Settings
function selectMachine() {
	$('#parameters tr').hide();
	var selectedMachine = window[$('#selectedMachine').val()];
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
var total = 0;
var sqtotal = 0;
// Google Charts Vars
var chart;
var spreadsheet;
var data;
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
	data = new google.visualization.DataTable();
	for (var i = 0; i < cols.length; i++) data.addColumn('number', cols[i]);

	chart = new google.visualization.LineChart(document.getElementById('chart'));
	chartData = new google.visualization.DataView(data);
	chartData.setColumns([0, 1, 2, 3, 4]);
	drawChart();
	spreadsheet = new google.visualization.Table(document.getElementById('spreadsheet'));
	spreadsheetData = new google.visualization.DataView(data);
	spreadsheetData.setColumns([0, 1]);
	drawSpreadsheet();
	
	google.visualization.events.addListener(chart, 'select', function() {spreadsheet.setSelection([{row: chart.getSelection()[0].row}]);});
	google.visualization.events.addListener(spreadsheet, 'select', function() {chart.setSelection(spreadsheet.getSelection());});
	selectMachine();
	planA();
}
// Shortcuts
function drawChart() {chart.draw(chartData, chartOptions);}
function drawSpreadsheet() {spreadsheet.draw(spreadsheetData, spreadsheetOptions);}
// Data Manipulators
function addRow(num, machine) {
	total += num;
	sqtotal += Math.pow(num, 2);
	var count = data.getNumberOfRows() + 1;
	if (count <= 25) {
		data.mean = total / count;
		data.controlLimit = 3 * Math.sqrt((sqtotal - total * data.mean) / count);
	}
	data.addRow([count, num, data.mean, data.mean + data.controlLimit, data.mean - data.controlLimit]);
	setMean(count, data.mean, data.controlLimit);
	buffer.length = 0;
	drawSpreadsheet();
	if (count >= 25) drawChart();
}
// Sets the mean, UCL, and LCL for our chart
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
	var rand = Math.round(window[machine].getRand());
	buffer[buffer.length] = rand;
	if (buffer.length >= 4) addRow(mean(buffer), machine);
	return rand;
}
function addPeeps(count) {for (var i = 0; i < count; i++) for (var j = 0; j < 4; j++) addPeep(machines[i % 4]);}
// Button Clicks
function exportData() {alert("This feature has not yet been implemented.");}
function clearData() {
	data.removeRows(0, data.getNumberOfRows());
	total = 0;
	sqtotal = 0;
	buffer.length = 0;
	drawChart();
	drawSpreadsheet();
}
function changePlan(plan) {
	window[plan]();
	clearData();
}
// Math Helpers
function uniformRandom(min, max) {return min + Math.random() * (max - min);}
function mean(array) {
	var total = 0;
	$.each(array, function() {total += this;});
	return Math.round(total / array.length);
}
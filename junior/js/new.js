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
var totalA = 0;
var totalB = 0;
var totalC = 0;
var total = totalA;
var sqtotalA = 0;
var sqtotalB = 0;
var sqtotalC = 0;
var sqtotal = totalA;
// Google Charts Vars
var chart;
var spreadsheet;
var currentData;
var dataA;
var dataB;
var dataC;
var emptyData;
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
	dataA = new google.visualization.DataTable();
	dataB = new google.visualization.DataTable();
	dataC = new google.visualization.DataTable();
	emptyData = new google.visualization.DataTable()
	for (var i = 0; i < cols.length; i++) {
		dataA.addColumn('number', cols[i]);
		dataB.addColumn('number', cols[i]);
		dataC.addColumn('number', cols[i]);
		emptyData.addColumn('number', cols[i]);
	}
	
	currentData = dataA;
	chart = new google.visualization.LineChart(document.getElementById('chart'));
	spreadsheet = new google.visualization.Table(document.getElementById('spreadsheet'));
	updateCharts();
	
	google.visualization.events.addListener(chart, 'select', function() {spreadsheet.setSelection([{row: chart.getSelection()[0].row}]);});
	google.visualization.events.addListener(spreadsheet, 'select', function() {chart.setSelection(spreadsheet.getSelection());});
	selectMachine();
	planA();
}
function updateCharts() {
	chartData = new google.visualization.DataView(currentData);
	chartData.setColumns([0, 1, 2, 3, 4]);
	drawChart();
	spreadsheetData = new google.visualization.DataView(currentData);
	spreadsheetData.setColumns([0, 1]);
	drawSpreadsheet();
}
// Shortcuts
function drawChart() {
	if (currentData.getNumberOfRows() >= 25) chart.draw(chartData, chartOptions);
	else chart.draw(emptyData, chartOptions);
}
function drawSpreadsheet() {spreadsheet.draw(spreadsheetData, spreadsheetOptions);}


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
	var rand = Math.round(window[machine].getRand());
	buffer[buffer.length] = rand;
	if (buffer.length >= 4) addRow(mean(buffer), machine);
	return rand;
}
function addPeeps(count) {for (var i = 0; i < count; i++) for (var j = 0; j < 4; j++) addPeep(machines[i % 4]);}
// Button Clicks
function exportData() {
//			alert(navigator.appName);
            var tempData = currentData;
            var csvData = [];
            var tmpArr = [];
            var tmpStr = '';
            for (var i = 0; i < tempData.getNumberOfColumns(); i++) {
                tmpStr = tempData.getColumnLabel(i).replace(/"/g, '""');
                tmpArr.push('"' + tmpStr + '"');
            }
            csvData.push(tmpArr);
            for (var i = 0; i < tempData.getNumberOfRows(); i++) {
                tmpArr = [];
                for (var j = 0; j < tempData.getNumberOfColumns(); j++) {
                    switch(currentData.getColumnType(j)) {
                        case 'string':
                            tmpStr = tempData.getValue(i, j).replace(/"/g, '""');
                            tmpArr.push('"' + tmpStr + '"');
                            break;
                        case 'number':
                            tmpArr.push(tempData.getValue(i, j));
                            break;
                        case 'boolean':
                            tmpArr.push((tempData.getValue(i, j)) ? 'True' : 'False');
                            break;
                        case 'date':
                            break;
                        case 'datetime':
                            break;
                        case 'timeofday':
                            break;
                        default:
                    }
                }
                csvData.push(tmpArr.join(','));
            }
			var output = csvData.join('\n');
            var uri = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(output);
            alert('You may need to rename the downloaded file with a ".csv" extension to open it.\nExporting Data is not available in Internet Explorer.');
            window.open(uri);
        
}

function clearData() {
	currentData.removeRows(0, currentData.getNumberOfRows());
	total = 0;
	sqtotal = 0;
	buffer.length = 0;
	drawChart();
	drawSpreadsheet();
}
function changePlan(plan) {
	window[plan]();
	// clearData();
}
// Math Helpers
function uniformRandom(min, max) {return min + Math.random() * (max - min);}
function mean(array) {
	var total = 0;
	$.each(array, function() {total += this;});
	return Math.round(total / array.length);
}
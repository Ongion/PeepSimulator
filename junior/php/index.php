<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<head>
		<link rel="icon" type="image/png" href="http://137.112.148.178/sambocom/images/icon.png">
		<link rel="stylesheet" type="text/css" href="../css/main.css" />
		<title>Sambocom</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js" type="text/javascript"></script>
		<script src="//d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.3.1.min.js" type="text/javascript"></script>
		<script type="text/javascript" src="https://www.google.com/jsapi"></script>
		<script type="text/javascript" src="../js/init.js"></script>
	</head>
	<body>
		<div id="leftCol">
			<div class="wrapper">
				<div class="wrapperLabel">Machines</div>
				<div id="machines">
					<div id="container"></div>
					<script src="../js/animation.js" type="text/javascript"></script>
				</div>
			</div>
			<div class="wrapper">
				<div class="wrapperLabel">Machine Settings</div>
				<div id="settings">
					<input type="radio" name="plan" value="0" onchange="changePlan(0)" checked="checked">Plan A
					<input type="radio" name="plan" value="1" onchange="changePlan(1)">Plan B
					<input type="radio" name="plan" value="2" onchange="changePlan(2)">Plan C<br>
					<select id="selectedMachine" onchange="selectMachine()">
						<!-- This will be auto-filled in by the javascript -->
					</select><br>
					<select id="selectedDistribution" onchange="selectDistribution()">
						<!-- This will be auto-filled in by the javascript -->
					</select>
					<table>
						<tbody id='parameters'>
						<!-- These will be auto-hidden by the javascript -->
						<tr id='muRow'>
							<td><label for="mu">Mean</label></td>
							<td><input type="number" name="mu" id="mu" maxlength="4" size="4"></td>
						</tr>
						<tr id='stdDevRow'>
							<td><label for="stdDev">Standard Deviation</label></td>
							<td><input type="number" name="stdDev" id="stdDev" maxlength="4" size="4"></td>
						</tr>
						<tr id='meanRow' style="display:none;">
							<td><label for="mean">Mean</label></td>
							<td><input type="number" name="mean" id="mean" maxlength="4" size="4"></td>
						</tr>
						<tr id='minRow' style="display:none;">
							<td><label for="min">Min</label></td>
							<td><input type="number" name="min" id="min" maxlength="4" size="4"></td>
						</tr>
						<tr id='maxRow' style="display:none;">
							<td><label for="max">Max</label></td>
							<td><input type="number" name="max" id="max" maxlength="4" size="4"></td>
						</tr>
					</tbody></table>
					<input type="button" value="Apply Changes" onclick="changeMachineSettings()">
				</div>
			</div>
		</div>
		<div id="rightCol">
			<div class="wrapper">
				<div class="wrapperLabel">Control Chart</div>
				<div id="chart"></div>
			</div>
			<div class="wrapper">
				<div class="wrapperLabel">Peep Data</div>
				<div id="spreadsheet"></div>
			</div>
			<div class="wrapper">
				<!--input type="button" value="Generate Chart" onclick="generateChart()"/-->
				<input type="button" value="Export Data" onclick="exportData()"/>
				<!--input type="button" value="Add Data" onclick="addPeeps(1)"/-->
				<input type="button" value="Add Lots of Data" onclick="addPeeps(8)"/>
				<input type="button" value="Clear Data" onclick="clearData()"/>
			</div>
		</div>
	</body>
</html>
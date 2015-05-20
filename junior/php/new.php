<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<head>
		<link rel="icon" type="image/png" href="http://137.112.148.178/sambocom/images/icon.png">
		<link rel="stylesheet" type="text/css" href="../css/main.css" />
		<title>Sambocom</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js" type="text/javascript"></script>
		<script src="../js/kinetic-v4.3.3.min.js" type="text/javascript"></script>
		<script type="text/javascript" src="https://www.google.com/jsapi"></script>
		<script type="text/javascript" src="../js/new.js"></script>
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
		</div>
		<div id="middleCol">
			<div class="wrapper">
				<div class="wrapperLabel">Control Chart</div>
				<div id="chart"></div>
			</div>
			<div class="wrapper">
				<div class="wrapperLabel">R Chart</div>
				<div id="rchart"></div>
			</div>
		</div>
		<div id="rightCol">
			<div class="wrapper">
				<div class="wrapperLabel">Peep Data</div>
				<div id="spreadsheet"></div>
			</div>
			<div class="wrapper">
				<div class="wrapperLabel">Machine Settings</div>
				<div id="settings">
					<input type="button" id="planA" name="plan" value="Plan A" onclick="changePlan('A')"/>
					<input type="button" id="planB" name="plan" value="Plan B" onclick="changePlan('B')"/>
					<input type="button" id="planC" name="plan" value="Plan C" onclick="changePlan('C')"/><br/>
					<select id="selectedMachine" onchange="selectMachine()">
						<option value="A">Machine A</option>
						<option value="B">Machine B</option>
						<option value="C">Machine C</option>
						<option value="D">Machine D</option>
					</select><br>
					<select id="selectedDistribution" onchange="selectDistribution()">
						<option value="uniformDistribution">Uniform Distribution</option>
						<option value="exponentialDistribution">Exponential Distribution</option>
						<option value="normalDistribution">Normal Distribution</option>
					</select>
					<table><tbody id='parameters'>
						<tr id='Mu'>
							<td><label for="MuVal">Mean</label></td>
							<td><input type="number" name="MuVal" id="MuVal" maxlength="4" size="4"></td>
						</tr>
						<tr id='Sigma'>
							<td><label for="SigmaVal">Standard Deviation</label></td>
							<td><input type="number" name="SigmaVal" id="SigmaVal" maxlength="4" size="4"></td>
						</tr>
						<tr id='Mean'>
							<td><label for="MeanVal">Mean</label></td>
							<td><input type="number" name="MeanVal" id="MeanVal" maxlength="4" size="4"></td>
						</tr>
						<tr id='Minimum'>
							<td><label for="MinimumVal">Min</label></td>
							<td><input type="number" name="MinimumVal" id="MinimumVal" maxlength="4" size="4"></td>
						</tr>
						<tr id='Maximum'>
							<td><label for="MaximumVal">Max</label></td>
							<td><input type="number" name="MaximumVal" id="MaximumVal" maxlength="4" size="4"></td>
						</tr>
					</tbody></table>
					<input type="button" value="Apply Changes" onclick="saveMachine()">
				</div>
			</div>
			<div class="wrapper">
				<input type="button" value="Clear Data" onclick="clearData()"/>
				<input type="button" value="Add Lots of Data" onclick="addPeeps(16)"/>
			</div>
		</div>
	</body>
</html>

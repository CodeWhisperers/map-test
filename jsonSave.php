<?php

$fileName = 'data/map.json';

if (isset($_POST['json'])) {
	$json = json_decode($_POST['json']);
	if ($json) {
		file_put_contents($fileName, json_encode($json, JSON_PRETTY_PRINT));
		die("1");
	}
}
die("0");
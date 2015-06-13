<?php

define ("DATADIR", __DIR__.DIRECTORY_SEPARATOR."data");

if (isset($_POST['questId'])) {
	if (file_exists(($file = DATADIR.DIRECTORY_SEPARATOR.$_POST['questId'].".json"))); {
	    die(file_get_contents($file));
	}
}
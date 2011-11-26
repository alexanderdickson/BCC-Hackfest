<?php
$headers = array();
$toilets = array();
$row = 0;
if (($handle = fopen("PUBLIC_TOILETS.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        $row++;
        for ($c=0; $c < $num; $c++) {
            if($row == 1) {

            	$data[$c] = preg_replace('/\W+/', '_', $data[$c]);
        		$headers[] = strtolower($data[$c]);
        		continue;
        	}
        		
            $toilets[$row][$headers[$c]] = $data[$c];
        }
    }
    fclose($handle);
}

function getDistanceBetweenPointsNew($latitude1, $longitude1, $latitude2, $longitude2, $unit = 'Km') { $theta = $longitude1 - $longitude2; $distance = (sin(deg2rad($latitude1)) * sin(deg2rad($latitude2))) + (cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * cos(deg2rad($theta))); $distance = acos($distance); $distance = rad2deg($distance); $distance = $distance * 60 * 1.1515; switch($unit) { case 'Mi': break; case 'Km' : $distance = $distance * 1.609344; } return (round($distance,2)); }




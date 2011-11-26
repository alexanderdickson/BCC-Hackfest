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




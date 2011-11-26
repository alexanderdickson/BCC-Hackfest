<?php
include 'main.php';

$postdata = file_get_contents("php://input");

$user = json_decode($postdata);

//$user['location'][0] = lat
//$user['location'][1] = long

function haversine ($l1, $o1, $l2, $o2) 
{ 
    $l1 = deg2rad ($l1); 
    $sinl1 = sin ($l1); 
    $l2 = deg2rad ($l2); 
    $o1 = deg2rad ($o1); 
    $o2 = deg2rad ($o2); 
                 
    return (7926 - 26 * $sinl1) * asin (min (1, 0.707106781186548 * sqrt ((1 - (sin ($l2) * $sinl1) - cos ($l1) * cos ($l2) * cos ($o2 - $o1))))); 
} 

$toilets = array_map(function($member) {
	$member['distance'] = haversine($user['location'][0], $user['location'][1], $member['Latitude'], $member['Longitude']);
	return $member;
}, $toilets);

usort($toilets, function($a, $b) {
	return $a['distance'] = $b['distance'];
});

header('content-type: application/json');
echo json_encode(array_slice($toilets, 0, 10));

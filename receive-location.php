<?php
include 'main.php';
$postdata = file_get_contents("php://input");

$user = json_decode($postdata, true);
$user['location'] = array(-27.4675018,153.0246554);
//$user['location'][0] = lat
//$user['location'][1] = long

$toilets = array_map(function($member) use ($user) {
	$member['distance'] = 1000 * getDistanceBetweenPointsNew($user['location'][0], $user['location'][1], $member['latitude'], $member['longitude']);

	//smells funky
	$member['park_library_centre'] =  ucwords(strtolower($member['park_library_centre']));
	$member['availability'] =  ucwords(strtolower($member['availability']));
	$member['street'] =  ucwords(strtolower($member['street']));
	$member['suburb'] =  ucwords(strtolower($member['suburb']));
	$member['toilet_name'] =  ucwords(strtolower($member['toilet_name']));

	return $member;

}, $toilets);

$max_distance = (10 * $user['urgency']) + 1000;

$toilets = array_filter($toilets, function($member) use ($max_distance) {
	//$max_distance = ($user['urgency'] + 500) * 2;
	return $member['distance'] < $max_distance;
});

usort($toilets, function($a, $b) {
	return $a['distance'] - $b['distance'];
});

header('content-type: application/json');
echo json_encode(array_slice($toilets, 0, 30));

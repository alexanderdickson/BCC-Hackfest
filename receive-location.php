<?php
include 'main.php';
$postdata = file_get_contents("php://input");

$user = json_decode($postdata, true);
$user['location'] = array(-27.4673492,153.0246638);
//$user['location'][0] = lat
//$user['location'][1] = long

//echo getDistanceBetweenPointsNew(-27.5624422072, 153.080918317, -27.4253119313, 153.017472824);
//die;

$toilets = array_map(function($member) use ($user) {
	$member['distance'] = 1000 * getDistanceBetweenPointsNew($user['location'][0], $user['location'][1], $member['latitude'], $member['longitude']);
	return $member;
}, $toilets);


usort($toilets, function($a, $b) {
	return $a['distance'] - $b['distance'];
});

header('content-type: application/json');
echo json_encode(array_slice($toilets, 0, 10));

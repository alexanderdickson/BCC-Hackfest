<?php
echo '<pre>';

print_r($_POST);

function haversine ($l1, $o1, $l2, $o2) 
{ 
    $l1 = deg2rad ($l1); 
    $sinl1 = sin ($l1); 
    $l2 = deg2rad ($l2); 
    $o1 = deg2rad ($o1); 
    $o2 = deg2rad ($o2); 
                 
    return (7926 - 26 * $sinl1) * asin (min (1, 0.707106781186548 * sqrt ((1 - (sin ($l2) * $sinl1) - cos ($l1) * cos ($l2) * cos ($o2 - $o1))))); 
} 

echo haversine(-27.5624422072, 153.080918317, -27.4253119313, 153.017472824);
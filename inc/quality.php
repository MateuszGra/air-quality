<?php
$id = $_POST['id'];

$ch = curl_init('http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/'.$id);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$data = curl_exec($ch);
curl_close($ch);

echo $data;

?>
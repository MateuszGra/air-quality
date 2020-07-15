<?php
$stations = getStations();
$users = getDataBase();

function getDataBase() {
    $dataBase = mysqli_connect('localhost','root','','air');
    $results = mysqli_query($dataBase,"SELECT * FROM users");
    $users = [];
    while($row = mysqli_fetch_array($results)){
        array_push($users, $row);
    }
    mysqli_close($dataBase);

    return $users;
}

function ajax($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

function getStations(){
    $url = 'http://api.gios.gov.pl/pjp-api/rest/station/findAll';
    $data = ajax($url);
    $stationArray = json_decode($data, true);
    return $stationArray;
}

function getQuality($id) {
    $url = 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/'.$id;
    $data = ajax($url);

    $qualityArray = json_decode($data, true);
    return $qualityArray['stIndexLevel']['indexLevelName'];
}

function getAdress($id, $stations) {
    $key = array_search($id, array_column($stations, 'id'));

    $adress = $stations[$key]['city']['name'];
    if ($stations[$key]['addressStreet'] != null) {
        $adress.= ' '.$stations[$key]['addressStreet'];
    }

    return $adress;
}

include 'send-mail.php';
foreach ($users as $user) {
    $stationID = $user['station'];
    $quality = getQuality($stationID);
    $subject = 'Indeks jakości powietrza: '.$quality;
    $message_body = '
    <p>Indeks jakości powietrza:</p><h2>'.$quality.'</h2>
    <p>Stacja pomiarowa:</p><h3>'.getAdress($stationID, $stations).'</h3>
    <p>Dokładne pomiary: <a href="air.mgrabowski.eu/?station='.$stationID.'">air.mgrabowski.eu/?station='.$stationID.'</a></p>
    <i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w poniższy link: </i>';

    send($user['email'], $subject, $message_body);
}


?>   

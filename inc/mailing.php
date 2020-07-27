<?php
    $start = microtime(true);
    include 'send-mail.php';
    include 'hash.php';
    $stations = getStations();
    $stationsData = [];
    $users = [];

    function ajax($url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);

        return $data;
    }

    function getStations() {
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
    
    include 'data-base.php';
    $sth = $dbh->prepare('SELECT * FROM users');
    $sth->execute();
    $data = $sth->fetchAll();

    foreach($data as $row) {
        $stationID = $row['station'];
        $user = [
            'id' => $row['id'],
            'station' => $stationID,
            'mail' => '',
            'quality' => '',
        ];

        if (array_key_exists($stationID, $stationsData)) {
            $quality = $stationsData[$stationID];
        } else {
            $quality = getQuality($stationID);
            $stationsData[$stationID] = $quality;
        }
        $user['quality'] = $quality;
        $qualityLower = strtolower($quality);

        if ($quality === 'Dostateczny' || $quality === 'Zły' || $quality === 'Bardzo zły') {
            switch ($quality) {
                case 'Dostateczny':
                    $info = '<p>Zanieczyszczenie powietrza stanowi zagrożenie dla zdrowia (szczególnie dla osób chorych, starszych, kobiet w ciąży oraz małych dzieci) oraz może mieć negatywne skutki zdrowotne. Należy rozważyć ograniczenie (skrócenie lub rozłożenie w czasie) aktywności na wolnym powietrzu, szczególnie jeśli ta aktywność wymaga długotrwałego lub wzmożonego wysiłku fizycznego.</p>';
                    break;
                case 'Zły':
                    $info = '<p>Osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć do minimum wszelką aktywność fizyczną na wolnym powietrzu - szczególnie wymagającą długotrwałego lub wzmożonego wysiłku fizycznego.</p>';
                    break;
                case 'Bardzo zły':
                    $info = '<p>Jakość powietrza ma negatywny wpływ na zdrowie. Osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny bezwzględnie unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć przebywanie na wolnym powietrzu do niezbędnego minimum. Wszelkie aktywności fizyczne na zewnątrz są odradzane. Długotrwała ekspozycja na działanie substancji znajdujących się w powietrzu zwiększa ryzyko wystąpienia zmian m.in. w układzie oddechowym, naczyniowo-sercowym oraz odpornościowym.</p>';
                    break;
            }

            $email = $row['email'];
            $id = $row['id'];
            $hash = hashString($email);
            $subject = 'Uwaga! Indeks jakości powietrza: '.$qualityLower;
            $message_body = '
            <p>Indeks jakości powietrza:</p><h1>'.$quality.'</h1>'.$info.'
            <p>Stacja pomiarowa:</p><h3>'.getAdress($stationID, $stations).'</h3>
            <p>Dokładne pomiary: <a href="air.mgrabowski.eu/?station='.$stationID.'">air.mgrabowski.eu/?station='.$stationID.'</a></p><br><br>
            <i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w link:
            <a href="air.mgrabowski.eu/?un='.$id.'&t='.$hash.'">wypisz się</a>
            </i>';

            send($email, $subject, $message_body)? $user['mail'] = 'Tak' : $user['mail'] = 'Błąd';
        } else {
            $user['mail'] = 'Nie';
        }
        array_push($users, $user);
    }

    $timeElapsed = microtime(true) - $start;

    include 'raport.php';
    sendRaport($timeElapsed, $users);
?>

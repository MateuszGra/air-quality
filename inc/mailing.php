<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../src/Exception.php';
require '../src/PHPMailer.php';
require '../src/SMTP.php';


$stationID = 117;
$stations = getStations();

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


$quality = getQuality($stationID);
$subject = 'Indeks jakości powietrza: '.$quality;
$message_body = '<p>Stacja pomiarowa:</p><h3>'.getAdress($stationID, $stations).'</h3>';
$message_body.= '<p>Indeks jakości powietrza:</p><h2>'.$quality.'</h2>';
$message_body.= '<p>Dokałdne pomiary: <a href="air.mgrabowski.eu/?station='.$stationID.'">air.mgrabowski.eu/?station='.$stationID.'</a></p>';
$message_body.= '<i>Wiadomość została wygenerowana utomatycznie, prosimy na nią nie odpowiadać. Dostajesz informacje dzięki subskrypcji, w przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w poniższy link:</i>';

$mail = new PHPMailer(true);
      try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->IsHTML(true);

        $mail->Host       = 'mail23.mydevil.net';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'test@mgrabowski.eu';
        $mail->Password   = 'Test123';
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        $mail->setFrom('test@mgrabowski.eu');
        $mail->addAddress('mxgrabowski@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $message_body;

        $mail->send();
        echo 'Message has been sent';
      } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
      }
?>   

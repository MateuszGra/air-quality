<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../src/Exception.php';
require '../src/PHPMailer.php';
require '../src/SMTP.php';

$email = strval($_POST['email']);
$stationID = $_POST['id'];


function addToDataBase($stationID, $email) {
    $dataBase = mysqli_connect('localhost','root','','air');

    $sql = 'INSERT INTO users (station, email)
    VALUES ("'.$stationID.'", "'.$email.'")';
    
    if ($dataBase->query($sql) === TRUE) {
        sendMail($email);
        echo '<span class="font-good">Dziękujemy, za chwilę otrzymasz wiadomość z potwierdzeniem.<span>';
    } else {
        echo '<span class="font-bad">Przepraszamy, spróbuj ponownie później<span>';
    }
    
    mysqli_close($dataBase);
}

addToDataBase($stationID, $email);


function sendMail($email) {
    $subject = 'Jakość powietrza potwierdzenie subskrypcji';
    $message_body = '
    <h2>Gratulację,</h2>
    <h3>Właśnie zapisałeś się do codziennej subskrypcji o jakości powietrza.</h3>
    <p>Będziesz od teraz otrzymywać codziennie rano wiadomość o stanie jakości powietrza z wybranej stacji.</p>
    <p>Jeżeli chcesz sprawdzać informacje częściej, zawsze możesz skorzystać z strony: <a href="air.mgrabowski.eu">air.mgrabowski.eu</a> .</p>
    <p><i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w poniższy link: </i></p>
    ';

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
            $mail->addAddress($email);
    
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $message_body;
    
            $mail->send();
          } catch (Exception $e) {

          }
}

?>
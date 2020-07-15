<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../src/Exception.php';
require '../src/PHPMailer.php';
require '../src/SMTP.php';


function send($email, $subject, $message_body) {
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

    } catch (Exception $e) {}
}
?>
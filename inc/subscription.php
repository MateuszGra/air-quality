<?php
$email = strval($_POST['email']);
$stationID = $_POST['id'];

function addToDataBase($stationID, $email) {
    $dataBase = mysqli_connect('localhost','root','','air');
    $subject = 'Jakość powietrza- potwierdzenie subskrypcji';
    $message_body = '
    <h2>Gratulację,</h2>
    <h3>Właśnie zapisałeś się do codziennej subskrypcji o jakości powietrza.</h3>
    <p>Będziesz od teraz otrzymywać codziennie rano wiadomość o stanie jakości powietrza z wybranej stacji.</p>
    <p>Jeżeli chcesz sprawdzać informacje częściej, zawsze możesz skorzystać z strony: <a href="air.mgrabowski.eu">air.mgrabowski.eu</a>.</p>
    <p><i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w poniższy link: </i></p>
    ';

    $sql = 'INSERT INTO users (station, email)
    VALUES ("'.$stationID.'", "'.$email.'")';
    
    if ($dataBase->query($sql) === TRUE) {
        include 'send-mail.php';
        send($email, $subject, $message_body);
        echo '<span class="font-good">Dziękujemy, za chwilę otrzymasz wiadomość z potwierdzeniem.<span>';
    } else {
        echo '<span class="font-bad">Przepraszamy, spróbuj ponownie później<span>';
    }
    
    mysqli_close($dataBase);
}

addToDataBase($stationID, $email);

?>
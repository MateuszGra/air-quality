<?php
$email = strval($_POST['email']);
$stationID = $_POST['id'];

function addToDataBase($stationID, $email) {
    $dataBase = mysqli_connect('localhost','root','','air');
    include 'hash.php';
    $hash = hashString($email);

    $sql = 'INSERT INTO users (station, email)
    VALUES ("'.$stationID.'", "'.$email.'")';
    
    if ($dataBase->query($sql) === TRUE) {
        include 'send-mail.php';
        $subject = 'Jakość powietrza- potwierdzenie subskrypcji';
        $message_body = '
        <h2>Gratulację,</h2>
        <h3>Właśnie zapisałeś się do subskrypcji.</h3>
        <p>Będziesz od teraz otrzymywać powiadomieniem o niskim indeksie jakości powietrza z wybranej stacji.</p>
        <p>Jeżeli chcesz sprawdzać informacje częściej, zawsze możesz skorzystać z strony: <a href="air.mgrabowski.eu">air.mgrabowski.eu</a>.</p>
        <i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w link: 
        <a href="air.mgrabowski.eu/?unsub='.$hash.'">Wypisz się</a> 
        </i>
        ';
        send($email, $subject, $message_body);
        echo '<span class="font-good bold">Dziękujemy, za chwilę otrzymasz wiadomość z potwierdzeniem.<span>';
    } else {
        echo '<span class="font-bad bold">Przepraszamy, spróbuj ponownie później.<span>';
    }
    
    mysqli_close($dataBase);
}

addToDataBase($stationID, $email);
?>
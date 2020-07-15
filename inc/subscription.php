<?php
include 'data-base.php';
$email = strval($_POST['email']);
$stationID = $_POST['id'];

function validation($email, $dataBase){
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo '<span class="font-bad bold">Błędny adres email</span>';
        return false;
    }

    $check = mysqli_query($dataBase, "SELECT * FROM users WHERE email='$email'"); 
    if(mysqli_num_rows($check) > 0){
        echo '<span class="font-bad bold">Adres email istnieje już w bazie danych</span>';
        return false;
    }

    return true;
}

function addToDataBase($stationID, $email, $dataBase) {
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
        <p>Będziesz od teraz otrzymywać powiadomienie o złej jakości powietrza z wybranej stacji.</p>
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
if(validation($email, $dataBase)) addToDataBase($stationID, $email, $dataBase);
?>
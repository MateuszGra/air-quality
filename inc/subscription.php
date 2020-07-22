<?php
    include 'data-base.php';
    $email = strval($_POST['email']);
    $stationID = $_POST['id'];

    function validation($email, $dbh){
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo '<span class="font-bad bold">Błędny adres email</span>';
            return false;
        }

        $sth = $dbh->prepare('SELECT * FROM users WHERE email = :email');
        $sth->bindParam(':email', $email, PDO::PARAM_STR);
        $sth->execute();
        $data = $sth->fetch(PDO::FETCH_ASSOC);

        if($data){
            echo '<span class="font-bad bold">Adres email istnieje już w bazie danych</span>';
            return false;
        }

        return true;
    }

    function addToDataBase($stationID, $email, $dbh) {
        include 'hash.php';
        $hash = hashString($email);
        $sth = $dbh->prepare('INSERT INTO users (station, email) VALUES (:station, :email)');
        $sth->bindParam(':email', $email, PDO::PARAM_STR);
        $sth->bindParam(':station', $stationID, PDO::PARAM_STR);
        $sth->execute();
        $id = $dbh->lastInsertId();

        if ($sth) {
            include 'send-mail.php';
            $subject = 'Jakość powietrza- potwierdzenie subskrypcji';
            $message_body = '
            <h3>Właśnie zapisałeś się do subskrypcji.</h3>
            <p>Będziesz od teraz otrzymywać powiadomienie o złej jakości powietrza z wybranej stacji.</p>
            <p>Jeżeli chcesz sprawdzać informacje częściej, zawsze możesz skorzystać z strony: <a href="air.mgrabowski.eu">air.mgrabowski.eu</a>.</p><br><br>
            <i>Wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. W przypadku rezygnacji z dalszego otrzymywania podobnych wiadomości kliknij w link: 
            <a href="air.mgrabowski.eu/?un='.$id.'&t='.$hash.'">wypisz się</a>
            </i>
            ';
            send($email, $subject, $message_body);
            echo '<span class="font-good bold">Dziękujemy, za chwilę otrzymasz wiadomość z potwierdzeniem.<span>';
        } else {
            echo '<span class="font-bad bold">Przepraszamy, spróbuj ponownie później.<span>';
        }
    }

    if(validation($email, $dbh)) addToDataBase($stationID, $email, $dbh);
?>
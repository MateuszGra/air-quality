<?php
    $hash = $_POST['hash'];

    function remove($hash) {
        include 'data-base.php';
        $sth = $dbh->prepare('SELECT * FROM users');
        $sth->execute();
        $data = $sth->fetchAll();

        foreach($data as $row) {
            $email= $row['email'];
            if (password_verify($email, $hash)){ 
                $sth = $dbh->prepare('DELETE FROM users WHERE email=:email');
                $sth->bindParam(':email', $email, PDO::PARAM_STR);
                $sth->execute();
                if ($sth) return true;
            }
        }
        return false;
        mysqli_close($dataBase);
    }

    if (remove($hash)) {
        echo '
        <h1 class="unsub__title font-good">Anulowano subskrypcję</h1>
        <h2 class="unsub__subtitle">Twój adres mailowy został usunięty z bazdy danych.<br> Nie będziesz już otrzymywać powiadomień.</h2>
        '; 
    } else {
        echo '
        <h1 class="unsub__title font-bad">Wystąpił błąd</h1>
        <h2 class="unsub__subtitle">Nic się nie martw, możesz spróbować później lub poprosić administratora o usunięcie z bazy danych.</h2>
        <p class="unsub__contact">Kontakt: <a class="link" href="mailto:mxgrabowski@gmail.com">mxgrabowski@gmail.com</a></p>
        ';
    }
?>
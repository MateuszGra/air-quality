<?php
    $token = $_POST['token'];
    $id = $_POST['id'];

    function remove($token, $id) {
        include 'data-base.php';
        $sth = $dbh->prepare('SELECT * FROM users WHERE id=:id');
        $sth->bindParam(':id', $id, PDO::PARAM_INT);
        $sth->execute();
        $row = $sth->fetch();
        $email = $row['email'];

        if (password_verify($email, $token)){
            $sth = $dbh->prepare('DELETE FROM users WHERE id=:id');
            $sth->bindParam(':id', $id, PDO::PARAM_INT);
            $sth->execute();
            if ($sth) return true;
        }

        return false;
    }

    if (remove($token, $id)) {
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
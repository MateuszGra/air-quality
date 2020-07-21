<?php
    $dsn = 'mysql:dbname=air;host=localhost';
    $user = 'root';
    $password = '';

    try {
        $dbh = new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        echo 'Brak połączenia z bazą. ';
    }
?>
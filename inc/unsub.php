<?php
$hash = $_POST['hash'];

function remove($hash) {
    $dataBase = mysqli_connect('localhost','root','','air');
    $results = mysqli_query($dataBase,"SELECT * FROM users");
    while($row = mysqli_fetch_array($results)){
        $email= $row['email'];
        if (password_verify($email, $hash)) {
            $sql = 'DELETE FROM users WHERE email="'.$email.'"';
            if ($dataBase->query($sql) === TRUE) return true;
            else return false;
        } else {
            return false;
        }
    }
    mysqli_close($dataBase);
}

if (remove($hash)) {
    echo '<h1 class="popup__title">Adres mailowy został usunięty z bazdy danych.</h1>'; 
} else {
    echo '
    <h1 class="popup__title"> <span class="font-bad">Wystąpił błąd</span>, ale nic się nie martw, możesz poprosić administratora o ręczne usunięcie danych z bazy.</h1>
    <p class="unsub__contact">Kontakt: <a class="link" href="mailto:mxgrabowski@gmail.com">mxgrabowski@gmail.com</a></p>
    ';
}
?>
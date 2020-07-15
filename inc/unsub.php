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
    echo '<p>Adres mailowy został usunięty z bazdy danych.</p>'; 
} else {
    echo '
    <p>Wystąpił błąd, ale nic się nie martw, możesz poprosić administratora o ręczne usunięcie danych z bazy.</p>
    <p>Kontakt: <a href="mailto:mxgrabowski@gmail.com">mxgrabowski@gmail.com</a></p>
    ';
}
?>
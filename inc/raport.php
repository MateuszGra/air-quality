<?php
    function sendRaport($timeElapsed, $users){
        $date = date('d-m-Y H:i:s', time());
        $body = "Data: ".$date."\r\nCzas wykonania: ".$timeElapsed."s\r\n\r\n";

        foreach($users as $user) {
            $body .= "ID: ".$user['id']." | Stacja: ".$user['station']." | Powiadomienie: ".$user['mail']." | Indeks: ".$user['quality']."\r\n";
        }

        $filemName = date('d-m-Y_H-i-s', time()).'.txt';
        $fp = fopen('../raports/'.$filemName,'w');
        fwrite($fp, $body);
        fclose($fp);
    }
?>
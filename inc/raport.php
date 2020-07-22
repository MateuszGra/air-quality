<?php
    function sendRaport($timeElapsed, $stationsData, $mails){
        $subject = 'RAPORT z aplikacji AIR';
        $message_body = '
        <h3>Skrypt się wykonał.</h3>
        <h4>Czas wykonania (sekundy): '.$timeElapsed.'</h4>
        <p>Lista odpytanych stacji:</p>
        <ul>';

        foreach($stationsData as $key => $item) {
            $message_body .= '<li>id <strong>'.$key.'</strong> wartość <strong>'.$item.'</strong></li>';
        }

        $message_body .= '
        </ul>
        <p>Lista wysłanych maili:</p>
        <ul>';

        foreach($mails as $key => $item) {
            $message_body .= '<li>id użytkownika <strong>'.$key.'</strong> id stacji <strong>'.$item.'</strong></li>';
        }

        $message_body .= '
        </ul>';

        send('mxgrabowski@gmail.com', $subject, $message_body);
    }
?>
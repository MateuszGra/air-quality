<?php
    require_once("../src/dompdf/autoload.inc.php");
    use Dompdf\Adapter\CPDF;
    use Dompdf\Dompdf;
    use Dompdf\Exception;

    function sendRaport($timeElapsed, $users){
        $date = date('d-m-Y H:i:s', time());
        $body = '
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
          body { font-family: DejaVu Sans, sans-serif; }
          h1 { font-size: 16px; }
          p {font-size: 12px; }

          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 12px;
          }
          
          td, th {
            border: 1px solid #000000;
            text-align: left;
            padding: 8px;
          }
          
          tr:nth-child(even) {
            background-color: #dddddd;
          }
        </style>
        <title>RAPORT: '.$date.'</title>
        </head>
        <body>

        <h1 style="text-align: center">Raport z mailingu</h1>
        <p>
            <strong>Data: '.$date.'</strong><br>
            <strong>Czas wykonania: '.$timeElapsed.'s</strong>
        </p>
        ';

        $body .= '
        <table>
        <tr>
            <th>ID</th>
            <th>Stacja</th>
            <th>Powiadomienie</th>
            <th>Indeks</th>
        </tr>';

        foreach($users as $user) {
            $body .= '
            <tr>
                <td>'.$user['id'].'</td>
                <td>'.$user['station'].'</td>
                <td>'.$user['mail'].'</td>
                <td>'.$user['quality'].'</td>
            </tr>
            ';
        }

        $body .= '
        </table>
        </body>
        </html>';

        $dompdf = new Dompdf();
        $dompdf->load_html($body);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $output = $dompdf->output();
        $filemName = date('d_m_Y-H_i_s', time()).'.pdf';
        file_put_contents( '../raports/'.$filemName , $output);

        $email = 'mxgrabowski@gmail.com';
        $subject = 'Nowy raport z aplikacji AIR';
        $message_body = '<h2>Nowy raport: <a href="air.mgrabowski.eu/raports/'.$filemName.'">link</a></h2>';
        send($email, $subject, $message_body);
    }
?>
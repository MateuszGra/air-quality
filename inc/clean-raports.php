<?php
    $days = 30;
    $path = '../raports/';

    if ($handle = opendir($path)) {
        while (false !== ($file = readdir($handle))) {
            if (is_file($path.$file))  {
                if (filemtime($path.$file) < ( time() - ( 5 * 60 ) ) )  {
                    unlink($path.$file);
                }
            }
        }
    }
?>
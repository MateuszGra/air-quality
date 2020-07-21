<?php
    function hashString($string) {
        $options = [
            'cost' => 5,
        ];
        return $hash = password_hash($string, PASSWORD_DEFAULT, $options);
    }
?>
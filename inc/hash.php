<?php
function hashString($string) {
    $options = [
        'salt' => 'Pamiętajcie o afirmacji',
        'cost' => 5,
    ];
    return $hash = password_hash($string, PASSWORD_DEFAULT, $options);
}
?>
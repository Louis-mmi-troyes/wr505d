<?php
$api = 'https://restcountries.com/v3.1/all';

$ch =curl_init($api);

curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,0);

$response = curl_exec($ch);
if(curl_errno($ch)){
    echo 'ERREUR > '.curl_error($ch);
} else {
    file_put_contents('public/countries.json',$response);
}
?>

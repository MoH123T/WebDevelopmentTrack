<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connection.php';

$id = intval($_GET["id"] ?? 0);

$query = "DELETE FROM `employee` WHERE id = $id";

$data = mysqli_query($conn,$query);
$reponse = array();
//
if(mysqli_affected_rows($conn)){
  
    $reponse['deleted'] = true;
  
  echo json_encode( $reponse);
  
}else {
  
    $reponse['deleted'] = false;
  
  echo json_encode( $reponse);
}














?>

<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connection.php';

$id         = intval($_POST["id"] ?? 0);
$name       = $_POST["name"] ?? '';
$position   = $_POST["position"] ?? '';
$salary     = $_POST["salary"] ?? '';
$experience = $_POST["experience"] ?? '';

$query = "UPDATE `employee` SET `name`='$name',`position`='$position',`salary`='$salary',`experience`='$experience' WHERE id=$id";


$data = mysqli_query($conn,$query);
$response = array();


if(mysqli_affected_rows($conn)){
  
    $response['updated'] = true;
  
  echo json_encode( $response);
  
}else {
  
    $response['updated'] = false;
  
  echo json_encode( $response);
}














?>

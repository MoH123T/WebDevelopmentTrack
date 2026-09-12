<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connection.php';


  $q2 = "SELECT `id`, `name`, `position`, `salary`, `experience` FROM `employee`";
  $data2= mysqli_query($conn,$q2);




$employees = array();
if($data2){


while( $row = mysqli_fetch_array($data2)){
	$employee = array();

    $employee['id'] = $row['id']; //order of data
    $employee['salary'] = $row['salary'];
    $employee['name'] = $row['name'];
    $employee['position'] = $row['position'];
    $employee['experience'] = $row['experience'];
 
  array_push($employees,$employee);


}

  echo json_encode( $employees);
  
}else {
echo "Error";
}



?>

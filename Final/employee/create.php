<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connection.php';

$name       = mysqli_real_escape_string($conn, $_POST["name"] ?? '');
$position   = mysqli_real_escape_string($conn, $_POST["position"] ?? '');
$salary     = mysqli_real_escape_string($conn, $_POST["salary"] ?? '');
$experience = mysqli_real_escape_string($conn, $_POST["experience"] ?? '');

$query = "INSERT INTO `employee`(`name`, `position`, `salary`, `experience`) VALUES ('$name','$position','$salary','$experience')";

$data = mysqli_query($conn, $query);

if ($data) {
    $id = mysqli_insert_id($conn);
    $q2 = "SELECT `id`, `name`, `position`, `salary`, `experience` FROM `employee` WHERE id = $id";
    $data2 = mysqli_query($conn, $q2);
    $row = mysqli_fetch_assoc($data2);

    $employee = [
      //Order of data
        'id'         => $row['id'],
        'name'       => $row['name'],
        'salary'     => $row['salary'],
        'position'   => $row['position'],
        'experience' => $row['experience'],
    ];

    echo json_encode($employee);
} else {
    echo json_encode(["error" => "Failed to insert employee."]);
}
?>

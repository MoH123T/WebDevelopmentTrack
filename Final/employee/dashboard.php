<?php
session_start();


$useremail = "to";
if(isset($_SESSION['email'])){
	$useremail = $_SESSION['email'];
	$useremail = $useremail . " to";
}
echo "<h1>Welcome ".$useremail." Dashboard!</h1>";

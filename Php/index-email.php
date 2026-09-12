<!DOCTYPE html>
<html>
<head>
<title>EmailPhpServerSide</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

</head>

<body>
<div>

<?php
/*
$emailTo=""; //email receiver
$subject="I hope this works!";
$body="I think you'retgreat";
$headers="From: "; //email sender

if (mail($emailTo, $subject, $body, $headers)) {

echo "Mail sent successfully!";

} else {

echo "Mail not sent!";
}*/

/*GET Method : passing data with url */


if ($_GET["submit"]) {

if ($_GET["name"]) {

echo "Your name is ".$_GET['name'];

} else {

echo "Please enter your name";
}
}

/*POST Method : passing data */

$names=array("Fred", "Rob", "Ian");

if ($_POST["submit"]) {

if ($_POST["name"]) {

foreach ($names as $name) {

if ($_POST["name"] == $name) {

echo "I know you! Your name is ". $name;

$knowYou=1;
}
}
if (!$knowYou) echo "<br><br>Post: I don't know you, ".$_POST['name'];

} else {

echo "<br><br>Post: Please enter your name";
}
}
?>

<form>

<label for="name">Name</label>
<input name="name" type="text" />

<input type="submit" name="submit" value="Submit Your Name"/>

</form>
<hr><br>
<form method="post">

<label for="name">Name</label>
<input name="name" type="text" />

<input type="submit" name="submit" value="Submit Your Name" />

</form>
</div>
</body>
</html>
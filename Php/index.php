<?php //Server side backend (used for critical sides of web dev)

echo "this is php<br>";
// php.ini is built in on laragon so no need for manually creating it

/*Variables : dynamically typed */

$test="I\"m a variable!<br>"; //if we have " that can ruin the string bounds we put \ before it

echo $test;

$test2="I'm a variable!<br>";

$test3="Me too!";

echo $test2.$test3; // . is for concatenate between strings

$number=75;

echo "<br>" .($number+42)/21+17; //float value

// Naming matters in variables , ex : $2test doesnt work

$name="Rob";

echo "<br>My name is ". $name ."<br>";

/*Arrays : */

$myArray=array("pizza", "chocolate", "coffee");


print_r($myArray);
echo "<br>".$myArray[2] ."<br>";

$anotherArray[0]="pizza"; //Made elements then auto made array
$anotherArray[1]="yoghurt";

print_r($anotherArray);

echo "<br>";
//Key -> value array , hashmap , asscoited array , dictionary

$thirdArray=array(

"France" => "French",
"USA" => "English",
"Germany" => "German"

);

print_r($thirdArray);

$anotherArray[]="salad"; //push new element to last of array

echo "<br />";
print_r($anotherArray);

unset($thirdArray["Germany"]); //delete from array
echo "<br />";
print_r($thirdArray);

echo "<br />";
$name="Rob"; 
unset ($name); // it removes the memory from server

/* if statements
 */

$numberif=1;

$otherNumberif=2;

if (!($numberif != $otherNumberif) AND True) {

echo "True!";

} else {

echo "False!";

}

echo "<br>";
/*For loop */

for ($i=1; $i <= 10; $i++) {

echo $i."<br />";
}

$arrayfor=array("cat", "dog", "turtle", "kangaroo");

foreach ($arrayfor as $key => $value) {

echo "Key: $key Value: $value <br />";
}

/*While Loop */

$iw=0;

$array=array("apple", "banana", "grape");
while ($array[$iw]) {

echo "Key: $iw Value: $array[$iw] <br />";

$iw++;
}
echo "<br>";

/*Sending emails , can be done by libraries made in php */

?>
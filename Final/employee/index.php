<?php


//login form
//email and password
//sign up form
session_start();


if(array_key_exists("submit",$_POST)){
	
	
	$error = "";
	if(!$_POST['email']){
		$error .= " An Error in Email Address.<br />";
	}
		if(!$_POST['password']){
		$error .= " An Error in Password.<br />";
	}
	
	if($error != ""){
		//there is an error
		$error = "<p>There were error(s) in your form: </p>".$error;
		
	}else{
		//sign or sign up
		$_SESSION['email'] = $_POST['email'];
		//unset($_SESSION);
		
		header('Location: dashboard.php');
	}
	
}


?>

<form method="post" id="logInForm">
<p>Login Form</p>
<input type="email" name="email" placeholder="Your Email" />
<input type="password" name="password" placeholder="Your Password" />
<input type="checkbox" name="stayLoggedIn" value="1" />
<input type="hidden" name="signUp" value="0" />
<input type="submit" name="submit" value="Log In!" />
</form>


<form method="post" id="signUpForm">
<p>Sign Up Form</p>
<input type="email" name="email" placeholder="Your Email" />
<input type="password" name="password" placeholder="Your Password" />
<input type="checkbox" name="stayLoggedIn" value="1" />
<input type="hidden" name="signUp" value="1" />
<input type="submit" name="submit" value="Sign Up!" />
</form>

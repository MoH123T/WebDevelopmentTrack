<?php


if($_GET['city']){
    
    $data = $_GET['city'];
   $content = file_get_contents("https://api.openweathermap.org/data/2.5/weather?q=".$data."&appid=bdbf42fd3e5ee3f5a5b05fa480dbd54e");
   $weatherArray = json_decode($content,true);
   
   if($weatherArray['cod']==200){
       
      $weather_data='<div class="alert alert-success" role="alert">';
     $weather_data.="Todays weather is ".$weatherArray['weather'][0]['description'];
     $weather_data.="The weather in ".$_GET['city']." is currently '".$weatherArray['weather'][0]['description']."'. ";
     $weather_data.="The Temperature is ".round(($weatherArray['main']['temp'])-273.15)."&#176;C and the wind speed is ".($weatherArray['wind']['speed'])."m/s.";
     $weather_data.="</div>";
     
   }else{
       $weather_data='<div class="alert alert-danger" role="alert">';
       $weather_data.="Could not find that location!";
        $weather_data.="</div>";
   }


   
    
}


?>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">


    <title>Hello, world!</title>
    <style>
        
    body {
      background: rgb(254,112,46);
    background-image:linear-gradient(90deg, rgba(254,112,46,1) 0%, rgba(254,112,46,0) 13%, rgba(247,56,97,1) 100%), url(https://greenapis.net/php/images/weather.jpg);
    width: 100%;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
}
        
        header {
    text-align: center;
    
    margin-top: 200px;
}


header h1 {


    color: #FFFFFF;
    text-shadow: 2px 2px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5;
    color: white;
}


div#company_data {
    /* height: 100px; */
    background: #4caf50d1;
    margin-top: 20px;
    border-top: 2px solid white;
}
        
    </style>
  </head>
  <body>
  
    <div class="main">
        
        <div class="container">
            <header><h1>What's the Weather?</h1></header>
            
<main>
<form>
  <div class="mb-3">
    <label for="search" class="form-label x">Enter the name of City.</label>
    <input type="text" required class="form-control" name='city' placeholder="Silwad.." value="">
  </div>


  <button type="submit" class="btn btn-primary" name="submit">Submit</button>
  <div id="company_data">
      <?php
      
      if($weather_data){
          echo $weather_data;
      }
      
      ?>
  </div>
</form>
</main>
  
</div>




        
    </div>




    <!-- Optional JavaScript; choose one of the two! -->


    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>


    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
    -->
  </body>
</html>

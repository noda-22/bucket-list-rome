<?php session_start(); ?>

<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <title>Bucket List Rome</title>
      <link rel="stylesheet" href="../assets/style.css">
      <link rel="icon" type="image/png" href="../assets/images/top_flag.png"/>
      <link href="https://fonts.googleapis.com/css2?family=Old+Standard+TT&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300&display=swap" rel="stylesheet">
   </head>
   <body>
      <header>
      <?php 
         //kontrollerar om databas filen inte finns
         //beroende på vart man är på sidan så är de olika sökvägar till databasen
         //strtok () delar en sträng (str) i mindre strängar(tokens),
         $request_path = strtok($_SERVER['REQUEST_URI'], '?');

         //strlen Returnerar längden på den angivna strängen.
         //rtrim - Ta bort blanksteg (eller andra tecken) från slutet av en sträng
         //dirname — Returns a parent directory's path
         // $_SERVER['SCRIPT_NAME'] - Innehåller det aktuella skriptets sökväg. ex: "/pages/profile.php"
         $base_path_len = strlen(rtrim(dirname($_SERVER['SCRIPT_NAME'])));

         //substr - Returnera en del av en sträng
         //urldecode - Avkodar alla% ## -kodningar i den angivna strängen. Plus-symboler ('+') avkodas till ett mellanslagstecken.
         $path = substr(urldecode($request_path), $base_path_len );
   
         //$path resulterar var man är på sidan men bara index.php eller profile. php eller bucketlist.php
         //alla error börjar på index.php därför det fungerar på dessa också

         if ($path == 'index.php' || $path == '') {
            $file_pointer = "admin/database.json";
         }else {
            $file_pointer = "../admin/database.json";
         }
         
         // om filen inte finns, så ser man en div med text i 
         if (!file_exists($file_pointer)){ 
            exit('<div id="brokDiv">
            <p id="exitP">Sorry something went wrong with the site, please try again soon!</p>
            <button id="brokButton" onClick="window.location.reload();"> Try again </button>
            </div>');
      }
      
      if (isset($_SESSION["isLoggedIn"]) == true){ 
      ?>
             <h1 class="headerItem"> <a href="/index.php">BUCKET LIST ROME</a></h1>
            <div id="flag" class="headerItem"> <img src="../assets/images/top_flag.png" alt="Italy" height="100"> </div>
            <!-- jag ändrar detta sålänge då, vet inte om vi bestämde men vill se så jag får posts att funka! kram vilma -->
            <!-- <a href="index.php?profile" id="ifPressProfile">Profile</a> -->
            <div id="aHeadern" class="headerItem">
               <a href="/pages/profile.php" id="ifPressProfile">Profile</a>
               <a href="/index.php">Tips</a>
               <a href="/pages/bucketlist.php">Bucket</a>
               <a href="/admin/logout.php">Log out</a>
            </div>
        <?php } else { ?>
            <div id="flag"> <img src="../assets/images/top_flag.png" alt="Italy" height="100"> </div>
        <?php }?>
      </header>


<?php
   session_start();
   include "../includes/functions.php";

   $file = "database.json";
   $database = [];

   if(file_exists($file)) {
      $data = file_get_contents($file);
      $database = json_decode($data, true);
   }

   $method = $_SERVER["REQUEST_METHOD"];

   if($method !== "PATCH"){
       abort(405, "The only http-methods allowed are PATCH");
   }

   if($method == "PATCH"){
      createBackupDB($file);

      $input = file_get_contents('php://input');
      $json = json_decode($input, true);
      $postDoID = (int)$json['postDo'];
      $postDoneID = (int)$json['postDone'];
      $deleteID = (int)$json['deleteID'];
      $type = $json['type'];

       //Loopa igenom alla users
      foreach($database['users'] as $users){
          //Hittar den användaren man är inloggad på
         if($users['id'] == $_SESSION['userID']){

           //Om vi ska flytta från Do till Done
           if ($type == "Do2Done") {
               foreach($users["postDo"] as $index => $postID){
                   if ($postID == $postDoID){
                       $id =  $_SESSION['userID'] -1 ;

                       //Här ska vi splicea bort det postID som vi vill flytta
                       array_splice($database['users'][$id]['postDo'], $index, 1);

                       //Går till array users, går in på inloggad användare, och sen in i postDone där man pushar in
                       array_push($database['users'][$id]['postDone'], $postDoID);
                       $jsonToDatabase = json_encode($database,JSON_PRETTY_PRINT);
                       file_put_contents($file, $jsonToDatabase);

                       send($json, 201);
                   }
               }

           }
           //Om vi ska flytta från Done till Do
           if ($type == "Done2Do") {
               foreach($users["postDone"] as $index => $postID){
                   if ($postID == $postDoneID){
                       $id =  $_SESSION['userID'] -1 ;

                       //Här ska vi splicea bort det postID som vi vill flytta
                       array_splice($database['users'][$id]['postDone'], $index, 1);

                       //Går till array users, går in på inloggad användare, och sen in i postDo där man pushar in
                       array_push($database['users'][$id]['postDo'], $postDoneID);
                       $jsonToDatabase = json_encode($database,JSON_PRETTY_PRINT);
                       file_put_contents($file, $jsonToDatabase);

                       send($json, 201);
                   }
               }
           }
           //Om vi vill ta bort ett nummer från postDo och postDone
           if ($type == "delete") {
               foreach($users["postDone"] as $index => $postID){
                   if ($postID == $deleteID){
                       $id =  $_SESSION['userID'] -1 ;

                       //Här ska vi splicea bort det postID som vi inte vill ha
                       array_splice($database['users'][$id]['postDone'], $index, 1);

                       $jsonToDatabase = json_encode($database,JSON_PRETTY_PRINT);
                       file_put_contents($file, $jsonToDatabase);

                       send($json, 201);
                   }
               }
               foreach($users["postDo"] as $index => $postID){
                   if ($postID == $deleteID){
                       $id =  $_SESSION['userID'] -1 ;

                       //Här ska vi splicea bort det postID som vi inte vill ha
                       array_splice($database['users'][$id]['postDo'], $index, 1);

                       $jsonToDatabase = json_encode($database,JSON_PRETTY_PRINT);
                       file_put_contents($file, $jsonToDatabase);

                       send($json, 201);
                   }
               }
           }
         }
      }

   }
?>

<?php
   session_start();
   require_once "../includes/functions.php";
   $file = "database.json";
   $database = [];

   if(file_exists($file)) {
      $data = file_get_contents($file);
      $database = json_decode($data, true);
   }

   $method = $_SERVER["REQUEST_METHOD"];

   if ($method !== "PATCH") {
      abort(405, "method not allowed");
   }

   if($method == "PATCH"){
      createBackupDB($file);

      $input = file_get_contents('php://input');
      $json = json_decode($input, true);

      //patch på knappen 'add to bucketlist'
      if(isset($json["postDo"])) {
         $postDo = 0;
         foreach($database['users'] as $users){
            if($users['id'] == $_SESSION['userID']){
               $id =  $_SESSION['userID'] -1 ;

               //gör om till siffra
               $test = (int)$json['postDo'];

               //går till array users, går in till personens id, och sen in i postDo där pushar man in den
               array_push($database['users'][$id]['postDo'],$test);
            }
         }
         $jsonToDatabase = json_encode($database,JSON_PRETTY_PRINT);
         file_put_contents($file, $jsonToDatabase);
         send($json, 201);
      }

      //om man klickar på "remove form bucket list" i popup fönstret
      //så tas nummret bort från listan
      if(isset($json["deletedPostID"])) {
         $deletedID = $json["deletedPostID"];
         $currUser = $_SESSION["userID"];

         foreach ($database["users"] as $index => $user) {
            if($user["id"] == $currUser) {
               foreach ($user["postDo"] as $key => $value) {
                  if($value == $deletedID) {
                     array_splice($database["users"][$index]["postDo"], $key, 1);
                  }
               }
            }
         }
            $jsonToDatabase = json_encode($database, JSON_PRETTY_PRINT);
            file_put_contents($file, $jsonToDatabase);
            send($json, 200);
      }

      //ändrar beskrivning på user
      if(isset($json["userDesc"])) {
         $userID = $_SESSION["userID"];
         $newDesc = $json["userDesc"];

         foreach($database["users"] as $index => $user){
            if($user["id"] == $userID) {

               $database["users"][$index]["profileDesc"] = $newDesc;
               $jsonToDatabase = json_encode($database, JSON_PRETTY_PRINT);
               file_put_contents($file, $jsonToDatabase);
               send($json, 200);
            }
         }
      }
   }
?>

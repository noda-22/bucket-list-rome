<?php
   require_once "../includes/functions.php";
   $file = "database.json";
   $database = [];

   if(file_exists($file)) {
      $data = file_get_contents($file);
      $database = json_decode($data, true);
   }

   $method = $_SERVER["REQUEST_METHOD"];

   if ($method !== "GET" && $method !== "POST" && $method !== "DELETE" && $method !== "PATCH") {
      abort(405, "method not allowed");
   }

  //hämtar från databasen
   if($method == "GET") {
      send($database, 200);
   }

   if($method == "PATCH") {
      createBackupDB($file);

      $input = file_get_contents("php://input");
      $json = json_decode($input, true);

      //kollar om det skickats för att redigera post beskrivning
      if(isset($json["pressedPost"]) && isset($json["newText"])) {
         $postID = $json["pressedPost"];
         $postNewDesc = $json["newText"];

         foreach($database["post"] as $index => $post) {
            if($post["postID"] == $postID) {

               $database["post"][$index]["postDesc"] = $postNewDesc;

               $jsonToDatabase = json_encode($database, JSON_PRETTY_PRINT);
               file_put_contents($file, $jsonToDatabase);
               send($json, 200);
            }
         }
      }

      //kollar om det skickats att man ska ta bort id i allas egna arrayer
      //efter det att en användare raderats sin post
      if(isset($json["deletedPostID"])) {
         foreach ($database["users"] as $index => $user) {
            foreach ($user["postDo"] as $key => $postID) {
               if($postID == $deletedID) {
                  array_splice($database["users"][$index]["postDo"], $key, 1);
               }
            }
            foreach ($user["postDone"] as $key => $postID) {
               if($postID == $deletedID) {
                  array_splice($database["users"][$index]["postDone"], $key, 1);
               }
            }
         }
         $jsonToDatabase = json_encode($database, JSON_PRETTY_PRINT);
         file_put_contents($file, $jsonToDatabase);
         send($json, 200);
      }
      abort(400);
   }

      //här raderar man posten
      if($method == "DELETE") {
         createBackupDB($file);

         $input = file_get_contents("php://input");
         $json = json_decode($input, true);

         foreach ($database["post"] as $index => $post) {
            if($post["postID"] == $json["id"]) {
               array_splice($database["post"], $index, 1);
            }
         }

         $jsonToDatabase = json_encode($database, JSON_PRETTY_PRINT);
         file_put_contents($file, $jsonToDatabase);
         send(["id" => $json["id"]], 200);
   }
?>

<?php
  $databaseFile = "database.json";
  // Detta tror jag inte ska vara med (under) för sidan ska inte fungera om database.json inte finns!
  $database = ["users" => [], "post" => []];
    //kontrollerar om databasfilen finns
  if (file_exists($databaseFile)) {
      $data = file_get_contents($databaseFile);
      $database = json_decode($data, true);
  }

  function validateUser($username, $password) {
      global $database;
        //kollar vem som är inloggad och returnerar användaren
      foreach ($database["users"] as $user) {
          if ($user["username"] == $username && $user["password"] == $password) {
              return $user;
          }
      }
      // om den användaren finns så returnerar vi false, för att säga att den finns redan
      return false;
    }

  // Adds a new user to our database, if one exists we return false, otherwise
  // the newly created user
  function addNewUser($username, $password) {
      global $databaseFile;
      global $database;

      // Kontrollerar om användaren finns
      foreach ($database["users"] as $user) {
          if ($user["username"] == $username) {
              return false;
          }
      }

      $highestID = 0;

      // hitta högsta ID
      foreach ($database["users"] as $user) {
          if ($user["id"] > $highestID) {
              $highestID = $user["id"];
          }
        }

      // Det är dessa som ska in i databasen
      $newUser = [
          "id" => $highestID + 1,
          "username" => $username,
          "password" => $password,
          "profileDesc"=> "",
          "postDo"=> [],
          "postDone" => []
        ];
      createBackupDB($databaseFile);
      // adderar användaren till arrayen users
      $database["users"][] = $newUser;

      $json = json_encode($database, JSON_PRETTY_PRINT);
      file_put_contents($databaseFile, $json);
      return $newUser;
    }

   // Abort a request
   function abort($statusCode = 400, $error = "Bad request") {
       http_response_code($statusCode);
       header("Content-Type: application/json");
       echo json_encode(["error" => $error]);
       exit();
    }

   // Send a JSON response
   function send($data, $statusCode = 200) {
       http_response_code($statusCode);
       header("Content-Type: application/json");
       echo json_encode(["data" => $data]);
       exit();
    }

   //Här backup databasen uppdateras, kallas i flera php-funktioner
   function createBackupDB($file) {
      $backupFile = "backupDB.json";
      $json = file_get_contents($file);
      file_put_contents($backupFile, $json);
    }

?>

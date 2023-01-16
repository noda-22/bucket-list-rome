<?php
session_start();

$method = $_SERVER["REQUEST_METHOD"];
if ($method !== "POST") {
    abort(405, "method not allowed");
}
//Kollar att användaren fyllt i namn och lösenord - lägger in i variabler
if (isset($_POST["username"]) && isset($_POST["password"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];
    //hämtar det som finns i database.json
    $file = "database.json";
    $data = file_get_contents($file);
    $database = json_decode($data, true);
    
    //jämför variablerna med det som finns i username och password i database.json.
    foreach ($database["users"] as $key => $value) {
        if ($username == $value["username"] && $password == $value["password"]) {
            $_SESSION["isLoggedIn"] = true;
            $username = $value["username"];
            $_SESSION["username"] = $username;
            $_SESSION["userID"] = $value["id"];
            header("location: /index.php");
            exit();
        } else {
            header("Location: ../index.php?error=1"); 
        }
    }  
}  
?>
<?php
session_start();

require_once "../includes/functions.php";

$method = $_SERVER["REQUEST_METHOD"];
if ($method !== "POST") {
    abort(405, "method not allowed");
}

if (isset($_POST["username"]) && isset($_POST["password"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if ($username == "" || $password == "") {
        //kontrollerar vid tomma värden
        header("Location: ../index.php?error=2");
    } else {
        $newUser = addNewUser($username, $password);
        
        //om newUser är inte sant så är användaren upptagen
        if ($newUser !== false) {
            // När användaren har skapats skickar vi dem ett godkänt meddelande och till startSidan
            header("Location: ../index.php?good=1");
            exit();
        }else {
            // om användaren är upptagen skickar vi till error =3
            header("Location: ../index.php?error=3");
        }
    }
}
?>
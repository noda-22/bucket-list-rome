<?php
session_start();
// Ta bort tidigare sparad information
unset($_SESSION["isLoggedIn"]);
unset($_SESSION["username"]);
unset($_SESSION["userID"]);
// Förstör vår session
session_destroy();
// Skicka tillbaka användaren till startsidan
header("Location: /index.php");
exit();
?>

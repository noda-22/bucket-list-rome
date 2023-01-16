<?php
session_start();
require "../includes/functions.php";

$databaseName = "../admin/database.json";
$database = [];

// Kontrollera om vår databas finns, isåfall hämtar vi innehållet
if (file_exists($databaseName)) {
    $data = file_get_contents($databaseName);
    $database = json_decode($data, true);
}

// Kollar vilken metod som skickas
$method = $_SERVER["REQUEST_METHOD"];

// Vi tillåter bara POST
if ($method !== "POST") {
    abort(405, "Method not allowed");
}

if ($method === "POST") {
    // Kolla så att formuläret är skickat
    if (isset($_POST["title"]) || isset($_POST["content"]) || isset($_POST["category"]) || isset($_FILES["file"]["name"])) {
        // Kolla så att alla fält är ifyllda
        if ($_POST["title"] === "" || $_POST["category"] === "" || $_POST["content"] === "" || $_FILES["file"]["name"] === "") {
            abort(400, "All fields must be filled in");
        }

        $folder = "../assets/uploads/postUploads/";
        $title = $_POST["title"];
        $category = $_POST["category"];
        $content = $_POST["content"];
        $creatorID = $_SESSION["userID"];

        $name = $_FILES["file"]["name"];
        $tmp = $_FILES["file"]["tmp_name"];
        $fileName = $folder . $name;
        $size = $_FILES["file"]["size"];
        $info = pathinfo($name);   
        $ext = $info["extension"];     
        $allowedExts = ["jpg", "jpeg", "png"];

        // Kollar så storleken inte är större än 500000 och inte är av ogiltigt filformat
        if ($size <= 500000 && in_array($ext, $allowedExts)) {
            // Flyttar filen från den temporära mappen till vår mapp
            move_uploaded_file($tmp, $folder . $name);
    
            $highestID = 0; 
            $postsLength = count($database["post"]);
            for ($i = 0; $i < $postsLength; $i++) {
                if ($database["post"][$i]["postID"] > $highestID) {
                    $highestID = $database["post"][$i]["postID"];
                }
            };
    
            $newPost = [
                "postID" => $highestID + 1,
                "creatorID" => $creatorID,
                "title" => $title,
                "category" => $category,
                "postDesc" => $content,
                "postImg" => "../$fileName",
                "date" => date("Y-m-d H:i:s")
            ];
            // Lägget till newPost i arrayen "post"
            $database["post"][] = $newPost;
            // Gör om till json och sparar i databasen
            file_put_contents($databaseName, json_encode($database, JSON_PRETTY_PRINT));
            // newPost kommer tas emot av script.js
            send($newPost, 201);

        } elseif ($size > 500000) {
            abort(400, "Image is too large");
        } elseif (!in_array($ext, $allowedExts)) {
            abort(400, "Image is in the wrong format");
        }
    }
}
?>
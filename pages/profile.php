<?php
    session_start();

    if (isset($_SESSION["isLoggedIn"]) == false) {
        header("Location: /index.php");
        exit();
    }

    require "../includes/header.php";
?>

<script>let checkIfLoggedIn = "profile";</script>
<script>let loggedInUserID = <?php echo $_SESSION["userID"]?>;</script>

<main id="profileMain">
    <div id="textWrapper">
        <h2 id="profileUsername">
            <img id="settingsIcon" src="../assets/images/kugghjul.png">
            <?php echo $_SESSION["username"]; ?>
        </h2>
        <h2 id="createNewPost"><span>+</span> Create new post</h2>
    </div>
    <div id="newPostForm" class="hideForm">
        <div class="feedbackProfile">
            <p class="errorProfile"></p>
            <p class="successProfile"></p>
        </div>
        <?php require "newPostForm.php"; ?>
    </div>
    <div id="profileWrapper">
        <div id="myPosts"></div>
    </div>
</main>

<?php require "../includes/footer.php"; ?>

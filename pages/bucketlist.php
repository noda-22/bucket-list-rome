<?php 
    session_start();

    if (isset($_SESSION["isLoggedIn"]) == false) {
        header("Location: /index.php");
        exit();
    }

    include "../includes/header.php";
?>
<script>let checkIfLoggedIn = true;</script>
<script>let loggedInUserID = <?php echo $_SESSION["userID"]?>;</script>

<div class="indexWrapper bucketL">
    <div id="bListLeft">
        <div id="bListContent">
            <h1>My Bucket List</h1>
            <div id="errorB"></div>
            <ul>

            </ul>
        </div>
    </div>
    <div id="bListRight">
        <p>Click the tips in your bucket list to see them here</p>
    </div>
</div>
<?php include "../includes/footer.php"; ?>

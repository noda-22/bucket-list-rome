<?php include "includes/header.php"; ?>
 <div class="indexWrapper">
   <?php
     if (isset($_SESSION["isLoggedIn"]) == false){
        ?><script>let checkIfLoggedIn = false;</script><?php
      echo '<div id="videoWrapper">
                <video loop muted autoplay="0.42">
                  <source src="assets/AdayInRome.mov" type="video/mp4">
                </video>
                <div id="downClick">  <img src="assets/images/arrowWhite.png" ></div>
              </div>';
      echo  '<div id="indexP">
              <p> BUCKET LIST </p>
              <p> ______________________________________________________</p>
              <p> ROME </p>
            </div>';
      echo '<div id="indexLogIn">
              <div id="dLogIn"> Log In </div>';
            ?>
        <?php if (isset($_GET['error'])) {
         if($_GET['error']==1){
        ?> <div class="error"><?php echo '<p> Wrong username or password </p>' ?></div>
        <?php } elseif($_GET['error']==2) {?>
               <div class="error"><?php echo '<p> both fields must be filled out </p>' ?></div>
        <?php } elseif($_GET['error']==3) {?>
               <div class="error"><?php echo '<p> Username is taken </p>' ?></div>
        <?php } ?>
        <?php
        } ?>
        <?php if (isset($_GET['good'])) {
          if($_GET['good']==1){
        ?> <div class="good"><?php echo '<p> Your user has now been created </p>' ?></div>
        <?php } 
      }
      echo '<div id="pRegister">Register</div>
            </div>';
      echo '<div id="postDivIndex"></div>' ;
      echo '<div id="buttonIndex">
        <button id="indexBack">  <img src="assets/images/pilDown.png" >  </button>
        <button id="indexNext"> <img src="assets/images/pilDown.png" > </button>
      </div>' ;
    }
      if (isset($_SESSION["isLoggedIn"]) == true){
         ?><script>let checkIfLoggedIn = true;</script><?php
         ?><script>let loggedInUserID = <?php echo $_SESSION["userID"]?>;</script><?php

      echo ' <div id= "tipsCategory">
         <select name="tipsCategory" id="select">
          <option value="See all"> See all </option>
          <option value="Eat & Drink">Eat & Drink</option>
          <option value="See & Do">See & Do</option>
          <option value="stayAndChill">Stay & Chill</option>
          <option value="Other">Other</option>
        </select>
        <select id="sortSelect">
          <option id="sortAll" value="Sort by..."> Sort by... </option>
          <option id="sortLate" value="Latest"> Latest </option>
          <option id="sortNew" value="Oldest">Oldest</option>
          <option id="sortName" value="Name">Name</option>
        </select>
        </div>';
         echo '<div id="postDivIndex"></div>';
         echo '<div id="buttonIndex">
         <button id="indexBack">  <img src="assets/images/pilDown.png" >  </button>
         <button id="indexNext"> <img src="assets/images/pilDown.png" > </button>
         </div>' ;
    }
  ?>

 </div>
 <?php include "includes/footer.php"; ?>

"use strict";
let globalArrayPosts = [];
let globalArrayUsers;

//Logga in funktioner
function logIn(){
   let inputP = $('<p>').html('Please log in');
   let forms = $("<form action='admin/login.php' method='POST'>");
   let input = $("<input id='username' type='text' name='username' placeholder='username' required>");
   let inputPass = $("<input id='password' type='password' name='password' placeholder='password' required>");
   let indexButt = $('<button> Log In </button>');
   let divWrapp = $('<div id="indexForm">');
   forms.append(inputP,input,inputPass, indexButt);
   divWrapp.append(forms).fadeIn('slow');
   $('#indexLogIn').append(divWrapp);
}

function registrera(){
   let inputP = $('<p>').html('Register here');
   let forms = $("<form action='../admin/register.php' method='POST'>");
   let input = $("<input id='username' type='text' name='username' placeholder='username' required>");
   let inputPass = $("<input id='password' type='password' name='password' placeholder='password' required>");
   let indexButt = $('<button> Send </button>');
   let divWrapp = $('<div id="indexForm">');
   forms.append(inputP,input,inputPass, indexButt);
   divWrapp.append(forms).fadeIn('slow');
   $('#indexLogIn').append(divWrapp);
}

//Deletea saker från ens bucket list
function deleteCheck(id) {
   const requestChange = new Request('../admin/patchBucketlist.php', {
      method: 'PATCH',
      headers: {
      "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({"deleteID": id, "type": "delete"})
   });

   fetch(requestChange)
   .then(res => {
      return res.json();
   })
   .then(response => {
   });
}

//Gör de olika checkboxarna + list-elementen på ens bucket list
function bucketLiItems(post) {
   let box = $("<div>").addClass("bucketLi").attr("id", "checkbox" + post.postID);
   let name = $("<span>").addClass("checkmark").html(post.title);
   let btn = $("<div>").addClass("Btrash");

   btn.on("click", function(){
      deleteCheck(post.postID);
      box.remove();
   });

   box.append(name, btn);
   return box;
}

//Appendar de elementen i bucket listen som man ska göra
function postDo(arrayDo, postArray){
   postArray.forEach(e => {
      arrayDo.forEach(el => {
         if (e.postID == el) {
            let box1 = bucketLiItems(e);
            let checkbox = $("<input type='checkbox'>");
            box1.prepend(checkbox);
            box1.addClass("Do");
            $("#bListContent ul").append(box1);
         }
      });
   });
}

//Appendar de elementen i bucket listen som man har gjort
function postDone(arrayDone, postArray){
   postArray.forEach(e => {
      arrayDone.forEach(el => {
         if (e.postID == el) {
            let box1 = bucketLiItems(e);
            box1.addClass("Done");
            let checkbox = $("<input type='checkbox' checked='checked'>");
            box1.prepend(checkbox);
            $("#bListContent ul").append(box1);
         }
      });
   });
}

//Visar den artikeln som man har klickat på i bucket listen
function showArticle(id){
   $("#bListRight").empty();

   globalArrayPosts.forEach(e => {
      if (e.postID == id){

         let user = globalArrayUsers.find(el => {
            if (el.id == e.creatorID) {
               return el;
            }
         });

         let box = $("<div>").addClass("articleB");
         let boxtop = $("<div>").addClass("articleTopB");
         let boxbottom = $("<div>").addClass("articleBotB");
         let title = $("<div>").addClass("titleB").html(e.title);
         let info = $("<div>").addClass("infoB");
         let category = $("<div>").addClass("catB").html("Category: " + e.category);
         let creator = $("<div>").addClass("creB").html("Creator: " + user.username);
         let text = $("<div>").addClass("descB").html(e.postDesc);
         let img = $("<img>").addClass("imgB").attr("src", e.postImg);

         info.append(category, creator);
         boxtop.append(title, info);
         boxbottom.append(text, img);
         box.append(boxtop, boxbottom);
         $("#bListRight").append(box);
      }
   });
}

//Hämtar data från databasen och skapar element, ändrar och deletear på bucket listen
function getUserDb() {
   const request = new Request("../admin/tipsApi.php");
   fetch(request)
   .then(r => r.json())
   .then(resp => {
      let userNow = resp.data.users.find(e => e.id == loggedInUserID)
      postDo(userNow.postDo, resp.data.post);
      postDone(userNow.postDone, resp.data.post);

      $(".bucketLi input").on("click", function(){
         let isChecked = $(this).is(':checked');
         let statusCode;
         if(isChecked){
            $(this).parent().addClass("Done");
            $(this).parent().removeClass("Do");

            //Flytta till "har gjort"
            let checkboxID = $(this).parent().attr('id');
            checkboxID = checkboxID.substring(8, checkboxID.length);

            const requestChange = new Request('../admin/patchBucketlist.php', {
               method: 'PATCH',
               headers: {
               "Content-type": "application/json; charset=UTF-8"
               },
               body: JSON.stringify({"postDo": checkboxID, "type": "Do2Done"})
            });

            fetch(requestChange)
            .then(res => {
               statusCode = res.status;
               return res.json();
            })
            .then(response => {
               if(statusCode == 201) {
                  $("#bListContent ul").empty();
                  getUserDb();
               }else if(statusCode == "400") {
                  $("#errorB").html($("<p>Something went wrong</p>")).css("color", "red")
                  $("#errorB p").delay(1000).fadeOut(1500);
               }
            });
         } else {
            $(this).parent().addClass("Do");
            $(this).parent().removeClass("Done");

            //Flytta till "ska göra"
            let checkboxID = $(this).parent().attr('id');
            checkboxID = checkboxID.substring(8, checkboxID.length);

            const requestChange = new Request('../admin/patchBucketlist.php', {
               method: 'PATCH',
               headers: {
               "Content-type": "application/json; charset=UTF-8"
               },
               body: JSON.stringify({"postDone": checkboxID, "type": "Done2Do"})
            });

            fetch(requestChange)
            .then(res => {
               statusCode = res.status;
               return res.json();
            })
            .then(response => {
               if(statusCode == 201) {
                  $("#bListContent ul").empty();
                  getUserDb();
               }else if(statusCode == "400") {
                  $("#errorB").html($("<p>Something went wrong</p>")).css("color", "red")
                  $("#errorB p").delay(1000).fadeOut(1500);
               }
            });
         }
      });

      $(".bucketLi .checkmark").on("click", function(){
         let checkboxID = $(this).parent().attr('id');
         checkboxID = checkboxID.substring(8, checkboxID.length);

         showArticle(checkboxID);
      });
   });
}
getUserDb();

//Post funktioner (index (loggad in, ej loggad in) och profile)
//Används för att hämta all data från databasen
function getFromDatabase() {
   const request = new Request("../admin/tipsApi.php");
   fetch(request)
   .then(r => r.json())
   .then(resp => {
      if(checkIfLoggedIn == "profile") {
         createPostProfile(resp.data);
      }else if (!checkIfLoggedIn) {
         createPostOffline(resp.data);
      }else if (checkIfLoggedIn){
         applyToGlobal(resp.data);
      }
   });
}

//funktion som sorterar posts
function sortAll(i, n, sortingArray, getArray) {
   let onlyUsers = getArray.users;
   let onlyPosts = getArray.post;
   let nySortingArray = sortingArray.slice(i,n);

   //här appendas grejerna
   nySortingArray.forEach(post => {
      let creatorName = onlyUsers.find(name => name.id == post.creatorID);
      creatorName = creatorName.username;
      let newPost = new PostLoggedIn(post);
      $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn, creatorName));
   });

   //kollar om diven inte har 16 divar i sig då finns de inga mer att se
   if(sortingArray.length <= 16){
      $('#indexNext').attr('disabled','disabled').addClass("disabledOn");
   }else {
      $('#indexNext').removeAttr('disabled').removeClass("disabledOn");
   }

   //när man klickar bak eller fram när man är inloggad
   $('#buttonIndex button').on('click', function(){
      $('#postDivIndex').empty();
      //kollar om det är diven Next, alltså framåt knapp
      if($(this).is("#indexNext")){
         $('#postDivIndex').empty();

         i = i+16;
         n = n+16;
         // ändrar då i och n till + 16 för att få 16 nya i arrayen, och sedan slice dem.
         let nySortingArray = sortingArray.slice(i,n);

         //går igenom den nya arrayen med de 16 st i sig.
         nySortingArray.forEach(post => {
            let creatorName = onlyUsers.find(name => name.id == post.creatorID);
            creatorName = creatorName.username;
            let newPost = new PostLoggedIn(post);
            $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn, creatorName));

            if(n >=16){
               $('#indexBack').removeAttr('disabled').removeClass("disabledOn");
            }
            if($('#postDivIndex').children().length !== 16){
               $('#indexNext').attr('disabled','disabled').addClass("disabledOn");
            }
         });
      }else {
         // om man klickar på back, bakåt knappen
         $('#indexNext').removeAttr('disabled').removeClass("disabledOn");
         $('#postDivIndex div').remove();
         i = i-16;
         n = n-16;

         let nySortingArray = sortingArray.slice(i,n);

         nySortingArray.forEach(post => {
            let creatorName = onlyUsers.find(name => name.id == post.creatorID);
            creatorName = creatorName.username;
            let newPost = new PostLoggedIn(post);
            $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn, creatorName));
         });

         if(n <=16){
            $('#indexBack').attr('disabled','disabled').addClass("disabledOn");
         }
      }
   });
}

//Här tar vi emot allt från GET och lägger in det i globala variabler
function applyToGlobal(getArray) {
   //lägger in alla användare till global array
   globalArrayUsers = getArray.users;

   //här pushar vi in alla inlägg i en global array
   getArray.post.forEach(post => {
      globalArrayPosts.push(post);
   });
   createPostOnline(getArray);
}


//Om man är inloggad. Här kollar vi om användaren valt någon sortering
function createPostOnline(getArray){
   // $('#postDivIndex').empty();
   let sortingArray = [];
   $('#indexBack').attr('disabled','disabled').addClass("disabledOn");

   //Lägger in i vår array som ska sorteras
   globalArrayPosts.forEach(post => {
      sortingArray.push(post);
   });

   let i = 0;
   let n = 16;

   sortAll(i, n, sortingArray, getArray);

   //om användare klickar på en sorterings möjlighet (vänstra hörnet, uppe)
   $("select").change(function() {
      let nynySortingArray = [];
      $('#postDivIndex div').remove();
      let categoryValue = $('select#select').val();
      let sortType = $('select#sortSelect').val();

      if(sortType !== "Sort by...") {
         sortingArray.forEach(test => {
            if(sortType == "Name"){
               sortingArray.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase());
            }else if(sortType == "Latest") {
               sortingArray.sort((a,b) => a.date < b.date ? 1: -1);
            }else if( sortType == "Oldest"){
               sortingArray.sort((a,b) => a.date > b.date ? 1: -1);
            }
         });

         if(categoryValue == "See all") {
            sortAll(i, n, sortingArray, getArray);
         }
      }

      if(categoryValue !== "See all") {
         nynySortingArray = sortingArray.filter(post => post.category == categoryValue);
         sortAll(i, n, nynySortingArray, getArray);
      }

      if(categoryValue == "See all" && sortType !== "Sort by...") {
         nynySortingArray = sortingArray.filter(post => post.category == categoryValue);
      }else if(sortType == "Sort by..." && categoryValue == "See all") {
         createPostOnline(getArray);
      }
   });
}

//Om man inte är inloggad
function createPostOffline(dbArray){
   let onlyPosts = dbArray.post;
   onlyPosts.forEach(post => {
      globalArrayPosts.push(post);
   });
   let i = 0;
   let n = 8;
   if(globalArrayPosts.length <= 8){
      $('#indexNext').attr('disabled','disabled').addClass("disabledOn");
      }else {
      $('#indexNext').removeAttr('disabled').removeClass("disabledOn");
      }

   onlyPosts = onlyPosts.slice(i,n)
   onlyPosts.forEach(post => {
      let newPost = new PostNotLoggedIn(post);
      $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn));
      $(".postBigDiv").css("cursor", "default");
   });
   $('#indexBack').attr('disabled','disabled').addClass("disabledOn");

   $('#buttonIndex button').on('click', function(){
      let onlyPosts = dbArray.post;
      if($(this).is("#indexNext")){
         $('#postDivIndex div').remove();
         i = i+8;
         n = n+8;
         onlyPosts = onlyPosts.slice(i,n);
         onlyPosts.forEach(post => {
            let newPost = new PostNotLoggedIn(post);
            $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn));
            $(".postBigDiv").css("cursor", "default");
         });
         if($('#postDivIndex').children().length !== 8 || globalArrayPosts.length == n ){
            $('#indexNext').attr('disabled','disabled').addClass("disabledOn");
         }
      }else {
         $('#indexNext').removeAttr('disabled').removeClass("disabledOn");
         $('#postDivIndex div').remove();
         i = i-8;
         n = n-8;
         onlyPosts = onlyPosts.slice(i,n);
         onlyPosts.forEach(post => {
            let newPost = new PostNotLoggedIn(post);
            $("#postDivIndex").append(newPost.buildOnHTML(checkIfLoggedIn));
            $(".postBigDiv").css("cursor", "default");
         });
      }
      //här är knapparna, om de inte finns mer i arrayen så ska knappen disabled
      if(n <= 8){
         $('#indexBack').attr('disabled','disabled').addClass("disabledOn");
      } else {
         $('#indexBack').removeAttr('disabled').removeClass("disabledOn");
      }
   });
}

//Om man är inne på sin profil
function createPostProfile(dbArray){
   let onlyPosts = dbArray.post;
   let onlyUsers = dbArray.users;
   globalArrayUsers = dbArray.users;
   let myPostsArray = onlyPosts.filter(curr => curr.creatorID == loggedInUserID);

   myPostsArray.sort((a, b) => a.date > b.date ? -1: 1);

   myPostsArray.forEach(post => {
      let creatorName = onlyUsers.find(name => name.id == post.creatorID);
      creatorName = creatorName.username;

      let newPost = new PostOwn(post);
      $("#myPosts").append(newPost.buildOnHTML(checkIfLoggedIn, creatorName));
   });
}

//Popup fönstret för en användare, kallas vid klick-event inne i funktionen "createPopupPost"
function createPostCreator(cID, name) {
   //Tar bort de element som inte ska vara med här
   $(".popCatDesc").remove();
   $(".popCreatorDesc").remove();
   $(".addToBuckDiv").remove();
   $(".popupRightDiv").css("background-image", "none");
   $(".inTheMiddleLine").css("display", "block");

   //Titlen ska vara användarnamnet man tryckt på
   $(".popTitle").html(name);

   $(".popupLeftDiv").addClass("popupLeftProfile");
   $(".popupRightDiv").addClass("popupRightProfile");

   const reqUser = new  Request("../admin/tipsApi.php");
   fetch(reqUser)
   .then(r => r.json())
   .then(resp => {
      let userArray = resp.data.users;
      let postArray = resp.data.post;
      let foundUser = userArray.find(element => element.username == name);
      $(".popPostDesc").html(foundUser.profileDesc);

      postArray.forEach(element => {
         if (element.creatorID == cID) {
            let profileOwnDiv = $("<div>").addClass("profileOwnDiv").css("background-image", `url(${element.postImg})`);

            let hoverDiv = $("<div>").addClass("profileOwnDiv hover");
            let hoverTitle = $("<div>").html(element.title).addClass("postTitleHov");
            let hoverText = $("<div>").html("Click to see more...").addClass("ownHoverText");
            hoverDiv.append(hoverTitle, hoverText)

            profileOwnDiv.append(hoverDiv);
            $(".popupRightProfile").append(profileOwnDiv);

            hoverDiv.on("click", function() {
               let currentArray = {postID: element.postID, postTitle: element.title, postCreatorID: element.creatorID, postImg: element.postImg, postCreatorName: name, desc: element.postDesc, postCategory: element.category}
               hoverText = $(".ownHoverText").html();

               $(".popBigDiv").remove();
               createPopupPost(currentArray, hoverText);
            });
         }
      });
   });
}

//POPUP FÖNSTER
let bio = [];
function createPopupPost(popupArr, hoverText) {

   //Här tar vi id som vi klickar in oss på
   let currID = parseInt(popupArr.postID);
   //Här hämtas ibjektet för den användare som är inloggad
   let currUserArray = globalArrayUsers.find(user => user.id == loggedInUserID);
   //här sparar vi de två arryer som används när man sparar en post till databasen
   let currUserArrayDo = currUserArray.postDo;
   let currUserArrayDone = currUserArray.postDone;

   //Här skapar vi elementet där man klickar på knappen för att lägga till posten
   let addToBuckDiv = $("<div>").addClass("addToBuckDiv").attr('id',popupArr.postID)
   let addButt = $("<div>").addClass("addButt").attr("id", popupArr.postCreatorID);
   let addText = $("<div>").addClass("addText").html("Add to bucket list");
   addToBuckDiv.append(addButt, addText);

   //sedan kollar vi om "currID" finns i något av de två nya arrayerna
   let trueOrFalse = currUserArrayDo.includes(currID)
   if(trueOrFalse == true) {
      addButt.css({backgroundImage: "url('/assets/images/minusLine.png')"});
      addText.html("Remove from bucket list");
   }
   trueOrFalse = currUserArrayDone.includes(currID)
   if(trueOrFalse == true) {
      addButt.css({backgroundImage: "url('/assets/images/minusLine.png')"});
      addText.html("Remove from bucket list");
   }

   //alla stora divar
   let popBigDiv = $("<div>").addClass("popBigDiv");
   let popupMiddle = $("<div>").addClass("popupMiddle");
   let popupInfoDiv = $("<div>").addClass("popupInfoDiv");
   let popupLeftDiv = $("<div>").addClass("popupLeftDiv");

   //exit grejer
   let exitDiv = $("<div>").addClass("exitDiv");
   let exitButt = $("<div>").addClass("exitButt");
   exitDiv.append(exitButt);

   //titlen på posten
   let popTitle = $("<div>").addClass("popTitle").html(popupArr.postTitle);

   //All text till vänster
   let popAdditional = $("<div>").addClass("popAdditional");
   let popCatDesc = $("<div>").html("Category: " + `${popupArr.postCategory}`).addClass("popCatDesc");

   let popCreatorDesc = $("<div>").addClass("popCreatorDesc").html("Creator: " + popupArr.postCreatorName);
   popAdditional.append(popCatDesc, popCreatorDesc);

   //Om inloggad så bara en vanlig div med beskrivning
   //Om profile så en textarea som man ska KUNNA redigera
   let popDesc;
   if(hoverText == "Click to see more...") {
      popDesc = $("<div>").addClass("popPostDesc").html(popupArr.desc);
   }else if (hoverText == "Click to edit...") {
      let text = popupArr.desc;
      $(popCreatorDesc).remove();

      let form = $("<div>");
      form.append($("<div>").addClass("changeDescFeedback").append($("<p>")));
      if(bio-length > 0) {
         form.append($('<textarea type="text" maxlength="1000">').attr("id", "descInput").val(bio[0]));
      }else {
         form.append($('<textarea type="text" maxlength="1000">').attr("id", "descInput").val(text));
      }
      form.append($("<div>").attr("id", popupArr.postID).html("Save changes").addClass("changeDescButt"));
      popDesc = form;
   }

   //Tar bort lägg till knappen om man är profile
   if(hoverText == "Click to edit...") {
      addToBuckDiv.css("display", "none");
   }

   //Linjen i mitten finns ej sålänge man ej är inne i annans posts
   let inTheMiddleLine = $("<div>").addClass("inTheMiddleLine").css("display", "none");

   popupLeftDiv.append(popTitle, popAdditional, popDesc, addToBuckDiv);

   //Bilden i popup fönstret, till höger
   let popupRightDiv = $("<div>").addClass("popupRightDiv").css("background-image", `url(${popupArr.postImg})`);

   popupMiddle.append(popupLeftDiv, inTheMiddleLine, popupRightDiv);
   popupInfoDiv.append(exitDiv, popupMiddle);
   popBigDiv.append(popupInfoDiv);

   $("body").prepend(popBigDiv);

   //stänger popup fönstret
   exitButt.on("click", function() {
      popBigDiv.remove();
   });

   //när man klickar på en användare
   popCreatorDesc.on("click", function() {
      if(hoverText !== "Click to edit...") {
         let creatorID = popupArr.postCreatorID;
         let name = popupArr.postCreatorName;
         createPostCreator(creatorID, name);
      }
   });

   //när man redigerar beskrivning på sin egna post
   $(".changeDescButt").on("click", function(event) {
      event.preventDefault();
      let newText = $("#descInput").val();
      let pressedPost = $(this).attr("id");
      let statusCode;

      const request = new Request("../admin/tipsApi.php", {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({"newText": newText, "pressedPost": pressedPost})
      })
      fetch(request)
      .then(response => {
         statusCode = response.status;
         return response.json();
      })
      .then(resp => {
         popupArr.desc = resp.data.newText;
         if(statusCode == "200") {
            $(".changeDescFeedback p").html("Your description has been updated").css("color", "green").fadeIn( 400 ).delay(400).fadeOut(400);
            $(".changeDescFeedback p").html();

         }else if(statusCode == "400") {
            $(".changeDescFeedback p").html("Something went wrong, try again").css("color", "red").fadeIn( 400 ).delay(400).fadeOut(400);
            $(".changeDescFeedback p").html();
         }
      });
   });

   //när man lägger till den i sin bucket list
   addToBuckDiv.on("click", function() {
      let checkIfAddRemove = $(".addText").html();
      let ID = $(this).attr("id");
      let statusCode;

      //Detta kollar om man klickat på att ta bort en post från ens bucketlist
      if(checkIfAddRemove == "Remove from bucket list") {
         const removeRequest = new Request("../admin/userApi.php", {
            method: "PATCH",
            header: {"Content-Type": "application/json"},
            body: JSON.stringify({"deletedPostID": ID})
         })
         fetch(removeRequest)
         .then(response => {
            statusCode = response.status;
            return response.json();
         })
         .then(delRes => {
            if(statusCode == "200") {
               addButt.css({backgroundImage: "url('/assets/images/plus.png')"});
               $(".addText").html("Add to bucket list");
            }else if(statusCode == "400") {
               $(".addText").html("Something went wrong").css("color", "red").fadeIn( 400 ).delay(600);
               setTimeout(function() {
                 $(".addText").html("Remove from bucket list").css("color", "black");
             }, 1000);
            }
         });

         //Detta kollar om man klickat i att lägga till en post i ens bucketlist
      }else if(checkIfAddRemove == "Add to bucket list") {
         const request = new Request("../admin/userApi.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"postDo": ID})
         })
         fetch(request)
         .then(response => {
            statusCode = response.status;
            return response.json();
         })
         .then(respone => {
            if(statusCode == "201") {
               addButt.css({backgroundImage: "url('/assets/images/minusLine.png')"});
               $(".addText").html("Remove from bucket list");
            }else if(statusCode == "400") {
               $(".addText").html("Something went wrong").css("color", "red").fadeIn( 400 ).delay(600);
               setTimeout(function() {
                 $(".addText").html("Add to bucket list").css("color", "black");
             }, 1000);
            }
         });
      }
   });
}

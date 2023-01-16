"use strict";

//Början i att alla posts skapas
getFromDatabase();

// NEW POST FORMULÄR
// Hämtar information från formuläret och skapar ett nytt inlägg
let formUpload = document.getElementById("formUpload");

if (formUpload !== null) {
  formUpload.addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData(formUpload);
    let request = new Request("../admin/profileApi.php", {
      method: "POST",
      body: formData
    });

    fetch(request)
      .then(response => {
        return response.json();
      })
      .then(json => {
        // Feedback error
        $(".errorProfile").html(json.error);
        // .show() för .fadeOut() har tagit bort
        $(".errorProfile").show();
        // Click på ngn av fälten ska ta bort error-meddelandet
        $(".inputProfile").on("click", function(){
          $(".errorProfile").fadeOut();
        });

        if (json.error) {
          console.log(json.error);
        } else if (json.data.postID !== undefined && json.data.creatorID !== undefined && json.data.title !== undefined && json.data.category !== undefined && json.data.postDesc !== undefined && json.data.postImg !== undefined && json.data.date !== undefined) {
          // Om json.data inte är undefined (alltså att det nya inläggets info finns) så töms alla fält och inlägget läggs till på sidan
          // Töm eventuella error-meddelanden
          $(".errorProfile").empty();
          // Töm fälten
          $("#title").val("");
          $("#category").val("");
          $("#content").val("");
          $("#newPostImg").val("");
          // Feedback om att inlägget är tillagt
          $(".successProfile").html("Your post has been created");
          // .show() för att .fadeOut() har tagit bort den
          $(".successProfile").show();
          $(".successProfile").delay(700).fadeOut();

          // Töm diven med alla inlägg
          $("#myPosts").empty();
          // Lägger till inläggen på sidan igen med den senaste först
          getFromDatabase();
        }

      });
  });
}

//click
//klickar på logIn knappen
$('#dLogIn').on('click', function(){
   $('.error').empty();
   $('.good').empty();
   //denna gör att det fadeOut register innehållet
   $('#indexForm').fadeOut(300, function(){ $(this).remove();});
   $('#indexLogIn').animate({
   'height':'50vh',
   }, 600);
   //kallar på funktionen logIn efter 30s
   setTimeout(logIn,300);
});

$('#pRegister').on('click', function(){
   $('.error').empty();
   $('.good').empty();
   //denna gör att det fadeOut logIn innehållet
   $('#indexForm').fadeOut(300, function(){ $(this).remove();});
   $('#indexLogIn').animate({
   'height':'50vh',
 }, 600);
  //kallar på funktionen registrera efter 30s
  setTimeout(registrera,300);
});

//Klickar man utanför rutan login och registera så stängs den.
$(document).mouseup(function(e){
   let container = $("#indexLogIn");
   // If the target of the click isn't the container
   if(!container.is(e.target) && container.has(e.target).length === 0){
      $('#indexForm').fadeOut(100, function(){ $(this).remove();});
      $('#indexLogIn').animate({
      'height':'30px',
   }, 600);
   }
});

//när man klickar på pilen ner på indexsidan så bläddras man ner på sidan.
$(document).ready(function(){
  $("#downClick").on("click", function () {
    let windowHeight = $(window).height(); // value i pixlar
    //ScrollTop () -metoden ställer in eller returnerar den vertikala rullningslistens position för de valda elementen.
    $('html, body').animate({
      scrollTop: windowHeight
    },1000);
  });
});

// Click på "Create new post" på profilsidan
// Om anv klickar på "+ Create new post" --> Visa formulär
// Om anv klickar på "- Create new post" --> Göm formulär
$("#createNewPost").on("click", function(){
  if ($("#newPostForm").hasClass("hideForm")){
    // Visa formuläret
    $("#newPostForm").removeClass("hideForm");
    $("#newPostForm").addClass("showForm");
    // Gör om + till -
    $("#createNewPost span").empty();
    $("#createNewPost span").html("—");
  } else {
    // Göm formuläret
    $("#newPostForm").removeClass("showForm");
    $("#newPostForm").addClass("hideForm");
    // Gör om - till +
    $("#createNewPost span").empty();
    $("#createNewPost span").html("+");
    // Ta bort eventuella error-meddelanden
    $(".errorProfile").empty();
  }
 });

let bio1 = "";

$("#profileUsername").on("click", function(){
  let bio = globalArrayUsers.find(e => {
     return e.id  == loggedInUserID;
  });

  let exitdiv = $("<div>").addClass("exitDiv");
  let exitButt = $("<div>").addClass("exitButt");
  exitdiv.append(exitButt);

  let popup1 = $("<div>").addClass("popBigDiv");
  let popup = $("<div>").addClass("popupInfoDiv");
  let box = $("<div>").attr("id", "userContent");
  let rubrik = $("<h1>").html("Change profile description");
  let feedback = $("<div>").addClass("changeDescFeedback").append($("<p>"));
  let text = $('<textarea type="text" maxlength="250" placeholder="Write a description">').attr("id", "userDescEdit").val(bio.profileDesc);
  let knapp = $("<div>").attr("id", "userDescB").html("Save changes");

  if (bio1 !== ""){
    text = $('<textarea type="text" maxlength="250" placeholder="Write a description">').attr("id", "userDescEdit").val(bio1);
  }

  box.append(rubrik, feedback, text, knapp);
  popup.append(exitdiv, box);
  popup1.append(popup);
  $("body").prepend(popup1);

  exitdiv.on("click", function(){
     popup1.remove();
  });

  knapp.on("click", function(){
     let newdesc = $("#userDescEdit").val()
     let statusCode;
     const removeRequest = new Request("../admin/userApi.php", {
        method: "PATCH",
        header: {"Content-Type": "application/json"},
        body: JSON.stringify({"userDesc": newdesc})
     })
     fetch(removeRequest)
     .then(response => {
        statusCode = response.status;
        return response.json();
     })
     .then(resp => {
       bio1 = resp.data.userDesc;
        $("#userDescEdit").val(bio1);

        if(statusCode == "200") {
           $(".changeDescFeedback p").html("Your description has been updated").css("color", "green").fadeIn( 400 ).delay(400).fadeOut(400);
           $(".changeDescFeedback p").html();

        }else if(statusCode == "400") {
           $(".changeDescFeedback p").html("Something went wrong, try again").css("color", "red").fadeIn( 400 ).delay(400).fadeOut(400);
           $(".changeDescFeedback p").html();
        }
     });
  });
});

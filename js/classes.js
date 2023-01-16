"use strict";
//om vi ska ha globala variabler

class PostBase {
   constructor(data) {
      this.id = data.postID; //= id på posten som används vid "stora" diven och plus tecknet
      this.title = data.title; // = titlen på posten
      this.container = $("<div>").addClass("postHover"); //denna är den gemensamma, där det står olika beroende på ej inloggad, inloggad eller redigerar
      this.creator = data.creatorID;
      this.img = data.postImg;
      this.desc = data.postDesc;
      this.category = data.category;

      let testArr = [data]
   }

   createHTML(curr, name) {
      let html = $("<div>").addClass("postBigDiv").attr("id", `postID${this.id}`).css("background-image", `url(${this.img})`);
      let hoverHtml = $("<div>").addClass("postBigDiv hover");

      let hoverText = this.container;
      hoverHtml.append(hoverText)

      let currentArray = {postID: this.id, postTitle: this.title, postCreatorID: this.creator, postImg: this.img, postCreatorName: name, desc: this.desc, postCategory: this.category}

      //när man klickar på bilden
      hoverHtml.on("click", function() {
         let hoverText = $(".hoverText").html();
         if(hoverText !== "Log in to see more...") {
            createPopupPost(currentArray, hoverText);
         }
      });

      html.append(hoverHtml)
      return html;
   }
}

//gör så att det står att man ska logga in för att få se den
class PostNotLoggedIn extends PostBase {
   constructor(data) {
      super(data);
   }

   buildOnHTML(curr) {
      let html = super.createHTML(curr);
      let titleHov = $("<div>").addClass("postTitleHov").html(this.title);
      let hoverText = "Log in to see more...";
      let feedbackText = $("<div>").addClass("hoverText").html(hoverText);

      this.container.append(titleHov, feedbackText);
      return html;

   }
}

//Gör så att det står att man kan se mer.
class PostLoggedIn extends PostBase {
   constructor(data) {
      super(data);
      this.date = data.date; //datum så man kan sortera
   }

   buildOnHTML(curr, name) {
      let html = super.createHTML(curr, name);
      let titleHov = $("<div>").addClass("postTitleHov").html(this.title);
      let hoverText = "Click to see more...";
      let feedbackText = $("<div>").addClass("hoverText").html(hoverText);
      this.container.append(titleHov, feedbackText);
      return html;
   }
}

//gör så att det står att man kan klicka och redigera.
class PostOwn extends PostBase {
   constructor(data) {
      super(data);
   }

   buildOnHTML(curr, name) {
      let html = super.createHTML(curr, name);
      let trashDiv = $('<div>').addClass("trashDiv");
      let trashBin = $('<div>').addClass("trashBin").attr("id", this.id);
      trashDiv.append(trashBin);

      let titleHov = $("<div>").addClass("postTitleHov").html(this.title);
      let hoverText = "Click to edit...";
      let feedbackText = $("<div>").addClass("hoverText").html(hoverText);

      //när man trycker på soptunnan
      trashBin.on("click", function(e) {
         e.stopPropagation();
         let clickedTrash = $(this).attr("id");

         // Popup där användaren måste bekräfta att den vill ta bort sitt inlägg
         // Om användaren clickar "ja" returneras true och vi går in i if-satsen om anv trycker nej returneras
         // false, popup:en stängs ner och inget händer
         if (window.confirm("Are you sure you want to delete this post?")) {
            //sedan måste vi in i user-arrayn i databasen för att ta bort i siffran från allas interna arrayer
            //först raderar vi hela posten så att den försvinner helt från post-arrayn i databasen
            const deleteRequest = new Request("../admin/tipsApi.php", {
               method: "DELETE",
               header: {"Content-Type": "application/json"},
               body: JSON.stringify({"id": clickedTrash})
            })
            fetch(deleteRequest)
            .then(r => r.json())
            .then(delRes => {
               const removeRequest = new Request("../admin/tipsApi.php", {
                  method: "PATCH",
                  header: {"Content-Type": "application/json"},
                  body: JSON.stringify({"deletedPostID": clickedTrash})
               })
               fetch(removeRequest)
               .then(r => r.json())
               .then(delRes => {
                  window.location.href = '/pages/profile.php';
               });
            });
         }
      });

      this.container.append(trashDiv, titleHov, feedbackText);
      return html;
   }
}

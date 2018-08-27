$(document).ready(function() {
    
    var chapterContainer = $(".chapter-container");
    $(document).on("click", ".btn.save", handleChapterSave);
    $(document).on("click", ".scrape-new", handleChapterScrape);
    $(".clear").on("click", handleChapterClear);
  
    function initPage() {
      // get unsaved chapters
      $.get("/api/chapters?saved=false").then(function(data) {
        chapterContainer.empty();
        // Render them if they exist
        if (data && data.length) {
          renderChapters(data);
        } else {
          // Otherwise render empty message
          renderEmpty();
        }
      });
    }
  
    function renderChapters(chapters) {
      
      var chapterCards = [];
      
      for (var i = 0; i < chapters.length; i++) {
        chapterCards.push(createCard(chapters[i]));
      }
      
      chapterContainer.append(chapterCards);
    }
  
    function createCard(chapter) {
      
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
          $("<a class='chapter-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", chapter.url)
            .text(chapter.chapter),
          $("<a class='btn btn-success save'>Save Chapter</a>")
        )
      );
  
      var cardBody = $("<div class='card-body'>").text(chapter.book);
  
      card.append(cardHeader, cardBody);
      
      card.data("_id", chapter._id);
      
      return card;
    }
  
    function renderEmpty() {
      
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new chapters.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='card-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Chapters</a></h4>",
          "<h4><a href='/saved'>Go to Saved Chapters</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      
      chapterContainer.append(emptyAlert);
    }
  
    function handleChapterSave() {
      
      var chapterToSave = $(this)
        .parents(".card")
        .data();
  
      //remove card
      $(this)
        .parents(".card")
        .remove();
  
      chapterToSave.saved = true;
      //update chapter.
      $.ajax({
        method: "PUT",
        url: "/api/chapters/" + chapterToSave._id,
        data: chapterToSave
      }).then(function(data) {
        
        if (data.saved) {
          // reload after saving.
          initPage();
        }
      });
    }
  
    function handleChapterScrape() {
      console.log("This is being hit.");
      // handles user wanting to scrape new chapters
      $.get("/api/fetch").then(function(data) {
        console.log("Definitely been hit.");
        initPage();
        //alerts user of unique chapters saved.
        bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
      });
    }
  
    function handleChapterClear() {
      $.get("api/clear").then(function() {
        chapterContainer.empty();
        initPage();
      });
    }
  });
  
$(document).ready(function () {

    var chapterContainer = $(".chapter-container");

    $(document).on("click", ".btn.delete", handleChapterDelete);
    $(document).on("click", ".btn.comments", handleChapterComments);
    $(document).on("click", ".btn.save", handleCommentSave);
    $(document).on("click", ".btn.comment-delete", handleCommentDelete);
    $(".clear").on("click", handleChapterClear);

    function initPage() {
        // empty container and load chapters
        $.get("/api/chapters?saved=true").then(function (data) {
            chapterContainer.empty();
            // If we have chapters, render them to the page
            if (data && data.length) {
                renderChapters(data);
            } else {
                // Otherwise render a message explaining we have no chapters
                renderEmpty();
            }
        });
    }

    function renderChapters(chapters) {
        // This function handles appending HTML containing our chapter data to the page
        // We are passed an array of JSON containing all available chapters in our database
        var chapterCards = [];
        // We pass each chapter JSON object to the createCard function which returns a bootstrap
        // card with our chapter data inside
        for (var i = 0; i < chapters.length; i++) {
            chapterCards.push(createCard(chapters[i]));
        }
        // Once we have all of the HTML for the chapters stored in our chapterCards array,
        // append them to the chapterCards container
        chapterContainer.append(chapterCards);
    }

    function createCard(chapter) {
        // This function takes in a single JSON object for an chapter/chapter
        // It constructs a jQuery element containing all of the formatted HTML for the
        // chapter card
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='chapter-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", chapter.url)
                    .text(chapter.chapter),
                $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
                $("<a class='btn btn-info comments'>Chapter Comments</a>")
            )
        );

        var cardBody = $("<div class='card-body'>").text(chapter.book);

        card.append(cardHeader, cardBody);

        // We attach the chapter's id to the jQuery element
        // We will use this when trying to figure out which chapter the user wants to remove or open comments for
        card.data("_id", chapter._id);
        // We return the constructed card jQuery element
        return card;
    }

    function renderEmpty() {
        // This function renders some HTML to the page explaining we don't have any chapters to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved chapters.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center'>",
                "<h3>Would You Like to Browse Available Chapters?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a href='/'>Browse Chapters</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        // Appending this data to the page
        chapterContainer.append(emptyAlert);
    }

    function renderCommentsList(data) {
        
        var commentsToRender = [];
        var currentComment;
        if (!data.comments.length) {
            
            currentComment = $("<li class='list-group-item'>No comments for this chapter yet.</li>");
            commentsToRender.push(currentComment);
        } else {
            // loop through comments if exist.
            for (var i = 0; i < data.comments.length; i++) {
                
                currentComment = $("<li class='list-group-item comment'>")
                    .text(data.comments[i].commentText)
                    .append($("<button class='btn btn-danger comment-delete'>x</button>"));
                // Id added to delete button for re-use.
                currentComment.children("button").data("_id", data.comments[i]._id);
                // add comment to array
                commentsToRender.push(currentComment);
            }
        }
        // Now append the commentsToRender to the comment-container inside the comment modal
        $(".comment-container").append(commentsToRender);
    }

    function handleChapterDelete() {

        var chapterToDelete = $(this)
            .parents(".card")
            .data();

        // Remove card 
        $(this)
            .parents(".card")
            .remove();
        // delete chapter
        $.ajax({
            method: "DELETE",
            url: "/api/chapters/" + chapterToDelete._id
        }).then(function (data) {
            // If this works out, run initPage again which will re-render our list of saved chapters
            if (data.ok) {
                initPage();
            }
        });
    }
    function handleChapterComments(event) {
        // This function handles opening the comments modal and displaying our comments
        // We grab the id of the chapter to get comments for from the card element the delete button sits inside
        var currentChapter = $(this)
            .parents(".card")
            .data();
        // Grab any comments with this id
        $.get("/api/comments/" + currentChapter._id).then(function (data) {
            // Constructing our initial HTML to add to the comments modal
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Comments For Chapter: " + currentChapter._id),
                $("<hr>"),
                $("<ul class='list-group comment-container'>"),
                $("<textarea placeholder='New Comment' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Comment</button>")
            );
            // add to modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var commentData = {
                _id: currentChapter._id,
                comments: data || []
            };
            // Adding some information about the chapter and chapter comments to the save button for easy access
            // When trying to add a new comment
            $(".btn.save").data("chapter", commentData);
            // renderCommentsList will populate the actual comment HTML inside of the modal we just created/opened
            renderCommentsList(commentData);
        });
    }

    function handleCommentSave() {
        // This function handles what happens when a user tries to save a new comment for an chapter
        // Setting a variable to hold some formatted data about our comment,
        // grabbing the comment typed into the input box
        var commentData;
        var newComment = $(".bootbox-body textarea")
            .val()
            .trim();
        // If we actually have data typed into the comment input field, format it
        // and post it to the "/api/comments" route and send the formatted commentData as well
        if (newComment) {
            commentData = { _chapterId: $(this).data("chapter")._id, commentText: newComment };
            $.post("/api/comments", commentData).then(function () {
                // When complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    function handleCommentDelete() {
        // This function handles the deletion of comments
        // First we grab the id of the comment we want to delete
        // We stored this data on the delete button when we created it
        var commentToDelete = $(this).data("_id");
        // Perform an DELETE request to "/api/comments/" with the id of the comment we're deleting as a parameter
        $.ajax({
            url: "/api/comments/" + commentToDelete,
            method: "DELETE"
        }).then(function () {
            // When done, hide the modal
            bootbox.hideAll();
        });
    }

    function handleChapterClear() {
        $.get("api/clear")
            .then(function () {
                chapterContainer.empty();
                initPage();
            });
    }
});

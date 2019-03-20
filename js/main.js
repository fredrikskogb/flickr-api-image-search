$(document).ready(function(){

    // Store var depending on radio check
    var isFloat; 
    var imageWrapper;
    var itemsWrapper;
    function floatOrFlex(){
        if($('#float').is(':checked')){
            $("#searchResult").attr("id", "searchResultFloat");
            isFloat = true;
            itemsWrapper = "itemsWrapperFloat";
            imageWrapper = "imageWrapperFloat";
        }else{
            $("#searchResultFloat").attr("id", "searchResult");
            isFloat = false;
            itemsWrapper = "itemsWrapper";
            imageWrapper = "imageWrapper";
        }
    }

    // Clear the old search result
    function refreshResult(parent){
        if(parent[0].hasChildNodes()){
            while (parent[0].hasChildNodes()){
                parent[0].removeChild(parent[0].lastChild);
            }
        }
    }

    function search(){
        if($("input").val().length > 0){
            $(".lds-dual-ring").show(); // loading animation
            let searchResult = $("#searchResult");
            if(isFloat){
                searchResult = $("#searchResultFloat");
            }
            refreshResult(searchResult);

            $.getJSON( "http://www.flickr.com/services/feeds/photos_public.gne?tags=" + $("input").val() + "&format=json&jsoncallback=?", function(data){
                
                // Reach the array inside the object 
                let array = Object.values(data)[5];
                // Put the values in html
                $.each(array, function(index, element){
                    let title = $("<p>").addClass("title").text(element.title);;
                    let date = $("<p>").text(element.date_taken);
                    let description = $("<div>").addClass("description d-none").append([title, date])
                    let image = $("<img>").attr("src", element.media.m).addClass("imageCropped");
                    image = $("<div>").addClass(imageWrapper).append(image); // Wrap image to div
                    let closeButton = $("<i>").addClass("closeButton fas fa-times");
                    let singleResult =  $("<div>").addClass(itemsWrapper).append([image, description, closeButton])
                    searchResult.append(singleResult);
                });
                $(".lds-dual-ring").hide(); // loading animation
            });
        }else{
            alert("Search value missing.");
        }
    }
    
    // Run search function on click and enter key
    $("#search").on("click", function(){
        floatOrFlex();
        search();
    })
    $("#value").on("keypress", function (e) {
        if(e.which === 13){
            floatOrFlex();
            search();
        }
    });

    // Open dialog with jQueryUI
    $(function(){
        $("#dialog").dialog({
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 200
            },
            hide: {
                effect: "explode",
                duration: 200
            },
            minWidth: 200,
            minHeight: 200
        });
         
        $(document).on("click", ".imageCropped", function(){
            // Get values
            let src = $(this).attr("src");
            let title = $(this).parent().siblings(".d-none").find(".title")[0].innerHTML;
            let date = $(this).parent().siblings(".d-none").find("p")[1].innerHTML;
            date = date.slice(0, -9).replace("T", " "); // Trim date
            // Put values in the dialog
            $("#dialog").dialog("option", "title", date);
            $("#dialogDescription").text(title);
            $("#dialogImage").attr("src", src);
            $("#dialog").dialog( "open" );
        });
    });

/*
    // Without jQueryUI
    // Give the elements their initial CSS properties by removing/adding classes and attributes
    function closeWindow(){
        $(".secondView").removeClass("secondView");
        $(".imageFull").removeClass("imageFull", 100);
        $(".description").addClass("d-none");
        $(".imageCropped").css("cursor", "pointer"); // Display pointer where it previously was default
        $("." + itemsWrapper).removeAttr("style");
        $(".description").removeAttr("style");
        $(".imageWrapperFloat").removeAttr("style");
        $(".closeButton").removeAttr("style");
    }

    // Clicking image
    $(document).on("click", ".imageCropped", function(){
        if(!$(this).closest("." + itemsWrapper).hasClass("secondView")){ // If this is not already open, enables opening of other images when this is open
            closeWindow(); // Close display window if already open
            
            if(isFloat){ // Add style for float display to THIS wrapper
                $(this).closest("." + itemsWrapper).css(
                    {
                        "width" : "100%",
                        "text-align" : "initial"
                    }
                );
                if($(window).width() >= 750){
                    $(this).parent().css("text-align", "left");
                    $(this).closest("." + itemsWrapper).css("padding-left", "2em");
                }else{
                    $(this).closest("." + itemsWrapper).css("width", "100vw");
                }    
            }else{ // isFlex
                if($(window).width() <= 750){
                    $(this).closest("." + itemsWrapper).css("flex-direction", "column");
                }
            }
            
            $(this).css("cursor", "default"); // Image won't be able to click again, change cursor
            $(this).closest("." + itemsWrapper).addClass("secondView"); // Get new position for content wrapper
            $(this).parent().siblings(".d-none").removeClass("d-none", 50); // Display description
            $(this).addClass("imageFull", 100); // Put image to original size
            $(this).parent().siblings(".closeButton").show();

        }
    });

    $(document).on("click", ".closeButton", function(){
        closeWindow();
    });
*/
});
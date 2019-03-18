$(document).ready(function(){

    /*$("#value").on("keypress", function (e) {
        if(e.which === 13){
            callback();
        }
    });*/
    
    $("#search").on("click", function(){
    
        $(".lds-dual-ring").show(); // loading animation

        var isFloat;
        // Store value of radio input  
        if($('#float').is(':checked')){
            isFloat = true;
        }else{ // Check if float has been used
            isFloat = false;
        }

        // Clear the old search result
        function refreshResult(){
            let parent = $("#searchResults");
            if(isFloat){
                parent = $("#searchResultsFloat");
            }
            if(parent[0].hasChildNodes()){
                while (parent[0].hasChildNodes()){
                    parent[0].removeChild(parent[0].lastChild);
                }
            }
        }

        if($("input").val().length > 0){
            refreshResult();
        }else{
            alert("Search value missing.");
        }

        $.getJSON( "http://www.flickr.com/services/feeds/photos_public.gne?tags=" + $("input").val() + "&format=json&jsoncallback=?", function(data){
            
            // Reach the array inside the object 
            let array = Object.values(data)[5];

            // Put the values in html
            $.each(array, function(index){
                let title = "<p class='title'>" + array[index].title + "</p>";
                let date = "<p>" + array[index].date_taken + "</p>";
                let image = "<img src='" + array[index].media.m + "' class='imageCropped'>";

                let searchResult = $("#searchResults");
                if(isFloat){
                    searchResult = $("#searchResultsFloat");
                }
                let itemsWrapper = "itemsWrapper";
                if(isFloat){
                    itemsWrapper = "itemsWrapperFloat";
                }

                searchResult.append("<div class='" + itemsWrapper + "'>" + image + "<div class='description d-none'>" + date + title +  "</div>" + "<i class='closeButton fas fa-times'></i>" + "</div>");
            });

            let imageWrapper = "imageWrapper";
            if(isFloat){
                imageWrapper = "imageWrapperFloat";
            }
            
            $(".imageCropped").wrap("<div class='" + imageWrapper + "'></div>"); // Wrap image to <div>
            $(".lds-dual-ring").hide(); // loading animation


            // Clicking image
    $(document).on("click", ".imageCropped", function(){

        let itemsWrapper = ".itemsWrapper";
        if(isFloat){
            itemsWrapper = ".itemsWrapperFloat";
        }

        if(!$(this).closest(itemsWrapper).hasClass("secondView")){ // If this is not already open, enables opening of other images when this is open
            closeWindow(); // Close display window if already open
            if(isFloat){ // Add style for float display to THIS wrapper
                $(this).closest(itemsWrapper).css(
                    {
                        "width" : "100%",
                        "text-align" : "initial"
                    }
                );
                if($(window).width() >= 768){
                    $(this).parent().css("text-align", "left");
                    $(this).closest(itemsWrapper).css("padding-left", "2em");
                }else{
                    $(this).closest(itemsWrapper).css("width", "100vw");
                }    
            }else{ // isFlex
                if($(window).width() < 768){
                    $(this).closest(itemsWrapper).css("flex-direction", "column");
                }
            }
            $(this).css("cursor", "default"); // Image won't be able to click again, change cursor
            $(this).closest(itemsWrapper).addClass("secondView"); // Get new position for content wrapper
            $(this).parent().siblings(".d-none").removeClass("d-none", 50); // Display description
            $(this).addClass("imageFull", 100); // Put image to original size
        }
        
    });

        });
            // Give the elements their initial CSS properties by removing/adding classes and attributes

        function closeWindow(){
            $(".secondView").removeClass("secondView");
            $(".imageFull").removeClass("imageFull", 100);
            $(".description").addClass("d-none");
            $(".imageCropped").css("cursor", "pointer"); // Display pointer where it previously was default
            $(".itemsWrapperFloat").removeAttr("style");
            $(".itemsWrapper").removeAttr("style");
            $(".description").removeAttr("style");
            $(".imageWrapperFloat").removeAttr("style");
        }

        $(document).on("click", ".closeButton", function(){
            closeWindow();
        });
    
    });

});
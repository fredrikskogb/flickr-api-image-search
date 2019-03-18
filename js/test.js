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

    function search(){

        // Clear the old search result
        function refreshResult(parent){
            if(parent[0].hasChildNodes()){
                while (parent[0].hasChildNodes()){
                    parent[0].removeChild(parent[0].lastChild);
                }
            }
        }

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
                $.each(array, function(index){
                    let title = "<p class='title'>" + array[index].title + "</p>";
                    let date = "<p>" + array[index].date_taken + "</p>";
                    let image = "<img src='" + array[index].media.m + "' class='imageCropped'>";

                    searchResult.append("<div class='" + itemsWrapper + "'>" + image + "<div class='description d-none'>" + date + title +  "</div>" + "<i class='closeButton fas fa-times'></i>" + "</div>");
                });
                
                $(".imageCropped").wrap("<div class='" + imageWrapper + "'></div>"); // Wrap image to <div>
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

    // Give the elements their initial CSS properties by removing/adding classes and attributes
    function closeWindow(){
        $(".secondView").removeClass("secondView");
        $(".imageFull").removeClass("imageFull", 100);
        $(".description").addClass("d-none");
        $(".imageCropped").css("cursor", "pointer"); // Display pointer where it previously was default
        $("." + itemsWrapper).removeAttr("style");
        $(".description").removeAttr("style");
        $(".imageWrapperFloat").removeAttr("style");
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
                if($(window).width() >= 768){
                    $(this).parent().css("text-align", "left");
                    $(this).closest("." + itemsWrapper).css("padding-left", "2em");
                }else{
                    $(this).closest("." + itemsWrapper).css("width", "100vw");
                }    
            }else{ // isFlex
                if($(window).width() < 768){
                    $(this).closest("." + itemsWrapper).css("flex-direction", "column");
                }
            }
            $(this).css("cursor", "default"); // Image won't be able to click again, change cursor
            $(this).closest("." + itemsWrapper).addClass("secondView"); // Get new position for content wrapper
            $(this).parent().siblings(".d-none").removeClass("d-none", 50); // Display description
            $(this).addClass("imageFull", 100); // Put image to original size
        }
    });

    $(document).on("click", ".closeButton", function(){
        closeWindow();
    });

});
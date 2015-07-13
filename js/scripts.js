"use strict";

//* Material code for the Ripples and Dropdown */
  $.material.init();

// Set Window Location Hash
  window.page = window.location.hash || "#welcome";

  $(document).ready(function() {

	 // Check for location,
	 $(".menu").find("li[data-target=" + window.page + "]").trigger("click");

	 // If 'welcome' page, then don't show certain content
	 if (window.page === "#welcome") $(".panel, .ad-space.small.medium").hide();

	// Monitor Window Space, Move Menu to Keep it persistant, Add/Remove Persistant Branding Element
    if($(window).width() >= 992){
      $(function() {
        var $sidebar   = $(".menu ul"),
              $window    = $(window),
              offset     = $sidebar.offset(),
              topPadding = 15;
        $window.scroll(function() {
          if ($window.scrollTop() > 249) {
            $sidebar.stop().animate({
              marginTop: $window.scrollTop() - offset.top + topPadding
            }, 1500);
            $('#ducks-logo').css({
              "visibility": "visible",
              "height":"110px"
            });
          } else {
            if (window.page === "#welcome") {
              $sidebar.stop().animate({
                marginTop: 0
              }, 100);
            } else {
              $sidebar.stop().animate({
                marginTop: 0
              }, 1500);
            }
            $('#ducks-logo').css({
              "visibility": "hidden",
              "height":"0px"
            });
          }
        });
      });
    }
  });

  // When a menu item is clicked, the main content area will be rewritten
  $(".menu li").click(function() {
    // Check if already active (if so, no action)
    if ($(this).is(".active")) return;
    
    if(!$(window).scrollTop(250)) $("html, body").animate({ scrollTop: 250 });

    var pageDiv = $(".page");
	// Remove active classes
    $(".menu li").not($(this)).removeClass("active");
    pageDiv.removeClass("active").hide();
	// Find new page target
    window.page = $(this).data("target");
    var page = $(window.page);
	// Reset page hash
    window.location.hash = window.page;
	// Reset active on menu
    $(this).addClass("active");

    $(function() {
	  // empty the carousel
      $(".carousel-inner").html("");
	  // clean page hash
      var thisPage = page.selector.replace("#", "");
      thisPage = thisPage.replace(/\-/g, "");
	  // set page id
      $(".well.page").attr("id", thisPage);
	  // Show or Hide Elements based on page state
      if(thisPage != "welcome") $(".panel, .ad-space.small.medium").show();
      else $(".panel, .ad-space.small.medium").hide();
	  // Iterate through the dataObject
      for (var dataProperty in dataObject[thisPage]) {
		// Sanity Check
        if (dataObject[thisPage].hasOwnProperty(dataProperty)) {
		  // Get value from key, use key/value to update DOM with dataObject value
          var propValue = dataObject[thisPage][dataProperty];
		  // Audio and Photos require special case
          if(dataProperty === "audio") $(selectorDataMap[dataProperty]).attr("src", propValue);
          else if(dataProperty === "photos") photoHandle(thisPage);
		  // Standard Case = Match dataObject key to selectorDataMap key to find target, update with dataObject value
          else $(selectorDataMap[dataProperty]).html(propValue);
        }
      }

	  // Reveal new page, slight animation using CSS transitions
      $(function() {
        pageDiv.show(function() {
          pageDiv.addClass("active");
        });
      });
    });
  });

  // Map of selector targets per dataObject keys
  var selectorDataMap = {
    header: ".header",
    content: "#content",
    latin: "#latin",
    avgLength: "#avgLength",
    avgWeight: "#avgWeight",
    audio: "#duckCall",
  };

  // writes HTML items for Bootstrap carousel and Ekko lightbox
  // iterates through all photos in dataObject.photos
  function photoHandle(thisPage) {
    var x = 0;
    for (var photoProperty in dataObject[thisPage].photos) {
      var propValue = dataObject[thisPage].photos[photoProperty]
	  var pageSlider = thisPage + "-slider";
      $(".carousel.slide").attr("id", pageSlider);
      $(".carousel-control").attr("href", "#"+pageSlider);
      var itemDiv;
      if(x === 0)
        itemDiv = "<div class=\"item active\">";
      else
        itemDiv = "<div class=\"item\">";
      itemDiv += "<a href=" + propValue + " data-toggle=\"lightbox\" data-gallery=\"" + thisPage + "\">";
      itemDiv += "<img src=" + propValue + " class=\"img-responsive item\">";
      itemDiv += "</a></div>";
      $("#"+pageSlider+" .carousel-inner").append(itemDiv);
      x++;
    }
  }

  //** Ekko Lightbox Code */
  $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
  	event.preventDefault();
  	$(this).ekkoLightbox()
  });

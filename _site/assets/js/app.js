// Initialise FlexSlider for Carousels
$(window).load(function() {
  $('.flexslider1').flexslider({
    animation: "fade",
    controlNav: false,
    directionNav: true,
    slideshowSpeed: 3000,
    animationSpeed: 500,
    touch: true,
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next"  
  });

  $('.flexslider2').flexslider({
    animation: "fade",
    controlNav: false,
    directionNav: true,
    slideshowSpeed: 3000,
    animationSpeed: 500,
    touch: true
  });

	$('.flexslider3').flexslider({
	 animation: "fade",
	 controlNav: false,
	 directionNav: true,
	 slideshowSpeed: 3000,
	 animationSpeed: 500,
	 touch: true
   });
});

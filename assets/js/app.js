// Initialise FlexSlider for Carousels
$(window).load(function() {
  $('.flexslider1').flexslider({
    animation: "fade",
    controlNav: false,
    directionNav: true,
    slideshowSpeed: 1000,
    animationSpeed: 100,
    touch: true
  });

  $('.flexslider2').flexslider({
    animation: "fade",
    controlNav: false,
    directionNav: true,
    slideshowSpeed: 5000,
    animationSpeed: 600,
    touch: true
  });
});

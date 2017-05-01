$(document).ready(function(){
  $('.openMenu').on('click', function(){    $('nav').removeClass('close').addClass('open opening');    setTimeout(function(){      $('nav').removeClass('opening');    }, 800)  });  $('.closeButton').on('click', function(){    $('nav').removeClass('open').addClass('close');  });
  $(document).on('click', function closeMenu (e){
    if(!$('nav').hasClass('opening') && $('nav').attr('class') != undefined && $('nav').has(e.target).length === 0){
        $('nav').removeClass('open').addClass('close');
    }
  });

  homepage();
});


// Homepage specific stuff, trying to keep the JavaScript input in MSL clean
function homepage(){
  $('.success .stories').unslider({
  	infinite: true,
  	arrows: {
  		//  Unslider default behaviour
  		prev: '',
  		next: '',
  	},
  	autoplay: true,
  	speed: 1200,
    delay: 5000
  });
}
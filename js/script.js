$(document).ready(function(){
  $('.openMenu').on('click', function(){    $('nav').removeClass('close').addClass('open');  });  $('.closeButton').on('click', function(){    $('nav').removeClass('open').addClass('close');  });
});
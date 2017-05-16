/*Config Variables*/var navSlideSpeed = 300,    dropdownOptions = {        duration : 300,        complete: function(){}    },    accordionOptions = {        duration : 300,        complete: function(){}    };$(document).ready(function(){  setupHeader();

  $('.openMenu').on('click', function(){    $('nav').removeClass('close').addClass('open opening');    setTimeout(function(){      $('nav').removeClass('opening');    }, 800)  });  $('.closeButton').on('click', function(){    $('nav').removeClass('open').addClass('close');  });
  $(document).on('click', function closeMenu (e){
    if(!$('nav').hasClass('opening') && $('nav').attr('class') != undefined && $('nav').has(e.target).length === 0){
        $('nav').removeClass('open').addClass('close');
    }
  });

  homepage();
  setupAccordion();
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


  // Setup the news widget
  $newsItems = $('#homepagebanner .news_item');
  $newsWrap = $('.newsItems');
  $newsList = $('.newsList ul');

  for(var i = 0; i < $newsItems.length; i++){
    var href = $newsItems.eq(i).find('a').attr('href');
    var src = $newsItems.eq(i).find('img').attr('src');
    var toAppend = '<div class="newsItem ' + (i + 1) + '">';
    var title = $newsItems.eq(i).find('a').text();
    toAppend += '<a href="' + href + '" class="image">';
    toAppend += '<img src="' + src + '" /></a><div class="newsDescription">';
    toAppend += '<p>' + title + '</p><span>';
    toAppend += '<a href="' + href + '" class="blockLink greenBg white">Read more</a></span></div></div>';

    $newsWrap.append(toAppend);

    var listToAppend = '<li id="' + (i + 1) + '"><p>' + title + '</p></li>';
    $newsList.append(listToAppend);
  }

  newsItemClick(1);

  $newsList.find('li').on('click', function(){
    newsItemClick($(this).attr('id'));
  });
}

function newsItemClick(index){
  $('.newsItem').hide();
  $('.newsItem.' + index).show();
  $('.newsList li').removeClass('active');
  $('#' + index).addClass('active');
}

// Setup the header with the admin login stuff
function setupHeader(){
  $user = $('#account_widgets .controlpanel');
  $control = $('#account_widgets #controlpanel');
  $admin = $('#account_widgets #msl_admin');
  $basket = $('#account_widgets #basket');
  $header_login = $('header .login');
  $header_user = $('header .user');
  $header_basket = $('header .basket');

  if($user.length == 1){
    $header_login.addClass('hide');
    $header_user.addClass('active');
    $header_basket.addClass('active');

    var name = $user.find(' > p').text().trim().split(' ')[2]

    var userDropdownContent = '<p>Hey ' + name + '</p>' +
    '<ul class="userActions">' +
    '<li><a href="/profile/" class="profile">Profile</a></li>' +
    '<li><a href="/memberships/" class="memberships">Memberships</a></li>' +
    '<li><a href="/contactdetails/">Contact Details</a></li>'

    if($control.length == 1){
      var links = $control.find('a');
      for(var i = 0; i < links.length; i++){
        userDropdownContent += '<li><a href="' + links[i].attributes.href.value + '">' + links[i].innerText + '</a></li>';
      }
    }

    userDropdownContent += '</ul>';

    $header_user.find('.dropdown').append(userDropdownContent);

    $header_user.find('.name').text(name);

    $header_user.find('.chevron').on('click', function(){
      userDropdownClick();
    });
  }
  if($admin.length == 1){
    var adminDropdownContent = '<p>Admin</p>' +
    '<ul class="adminActions">';

    var links = $admin.find('a');
    for(var i = 0; i < links.length; i++){
      adminDropdownContent += '<li><a href="' + links[i].attributes.href.value + '">' + links[i].innerText + '</a></li>';
    }

    adminDropdownContent += '</ul>';

    $header_user.find('.dropdown').append(adminDropdownContent);
  }
  if($basket.length == 1 && $basket.text().match(/Your basket is empty/) == null){
    var items = $basket.find('dd.qty');
    var total = 0;

    for(var i = 0; i < items.length; i++){
      total += parseInt(items[i].innerText.trim().split(' ')[1].replace(/(\r\n|\n|\r)/gm,""));
    }

    if(total > 0){
      $header_basket.find('.itemCount').addClass('active').text(total);
    }
  }
}

function userDropdownClick(){
  $chevron = $('header .user .chevron');
  $dropdown = $('header .user .dropdown');

  if($dropdown.hasClass('open')){
    $dropdown.removeClass('open');
    $chevron.removeClass('active');
  } else {
    $dropdown.addClass('open');
    $chevron.addClass('active');
  }
}

function setupAccordion(){
  $('.accordion').each(function(){
    try {
      var content = $(this).find('> .accordionContent');
      var headers = $(this).find('> .accordionTitle');
      if($(content).length != $(headers).length){
        throw "Number of contents does not much the number of headers";
      }
      else {
        //Hide all the content
        $(content).hide();
        //For each header
        $(headers).each(function(){
          var currentContent = $(this).next();
          $(this).click(function(){
            //If the current content is already visible, hide it
            if($(currentContent).is(":visible")){
              $(currentContent).slideUp(accordionOptions);
              $(this).removeClass('dropped');
            }
            //Otherwise, slide it down
            else{
              $(currentContent).slideDown(accordionOptions);
              $(this).addClass('dropped');
            }
            ga('send', 'event', 'Components', 'Accordion', $(this).text());
          });
        })
      }
    }
    catch(err){
        console.error("Accordion Error: " + err);
    }
  });
}

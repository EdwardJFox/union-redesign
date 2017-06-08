/*Config Variables*/var navSlideSpeed = 300,    dropdownOptions = {        duration : 300,        complete: function(){}    },    accordionOptions = {        duration : 300,        complete: function(){}    };$(document).ready(function(){  setupHeader();
  setupNav();

  // If on homepage, run the homepage stuff
  if($('.page_root').length > 0){
    homepage();
  }

  // Components
  setupAccordion();
  setupDropdown();
  setupTabs();

  // Widgets
  rearrangeNews();
  mailingList();
  rearrangeEventList();
  setupCalendar();
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
    var toAppend = "";
  });

  // Setup the events widget
  $eventsItems = $('#whatson .event_item');

  for(var i = 0; i < $eventsItems.length; i++){

  }
}

function setupNav(){
  $('.openMenu').on('click', function(){
    $('nav').removeClass('close').addClass('open opening');
    setTimeout(function(){
      $('nav').removeClass('opening');
    }, 800)
  });
  $('.closeButton').on('click', function(){
    $('nav').removeClass('open').addClass('close');
  });

  $(document).on('click', function closeMenu (e){
    if(!$('nav').hasClass('opening') && $('nav').attr('class') != undefined && $('nav').has(e.target).length === 0){
        $('nav').removeClass('open').addClass('close');
    }
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

// Setup Dropdown
function setupDropdown(){
  //For each of the .dropdown class on the page
  $('.dropdown').each(function(){
    try {
      //Get the list which is directly under the .dropdown class
      var list = $(this).find('> ul');
      var title = $(this).find(' > .dropdownTitle');
      //Only run if there is a ul directly underneath, otherwise don't run
      if ($(list).length) {
        //Hide the dropdown content
        $(list).hide();
        $(title).click(function () {
          //If the list is currently visible
          if ($(list).is(':visible')) {
            $(list).slideUp(dropdownOptions);
            //Add back the default background image
            $(title).removeClass('dropped');
          }
          //If it is hidden
          else {
            $(list).slideDown(dropdownOptions);
            //Add the rotated background image
            $(title).addClass('dropped');
          }
          ga('send', 'event', 'Components', 'Dropdown', $(this).text());
        });
      }
      //If there isn't a list directly underneath (e.g. not following the rules of the component), then error handle
      else {
        throw "No <ul> found under the .dropdown class, please refer to the component guide for the layout of dropdown menus.";
      }
    }
    catch(err){
      console.error("Dropdown Error: " + err);
    }
  });
}

//Setting up the tabbales
function setupTabs(){
  $('.tabs').each(function(){
    try {
      var nav = $(this).find('> .nav-tabs > li');
      var panes = $(this).find('> .panes > div');
      if($(panes).length < $(nav).length){
        throw "There are too few .panes for the number of links in the .nav-tabs";
      }
      else if($(panes).length < $(nav).length){
        throw "There are too many .panes for the number of links in the .nav-tabs";
      }
      else {
        $(nav).each(function(i){
          var link = $(this).find('a');
          if(!link){
            throw "No link found in the nav list at index " + i;
          }
          $(link).click(function(e){
            e.preventDefault();
            $(panes).hide();
            $(nav).removeClass('active');
            $(this).parent().addClass('active');
            $($(this).attr('href')).show();
            ga('send', 'event', 'Components', 'Tabs', $(this).text());
          })
        })
      }
      //Setup initial
      $(panes).hide();
      $(nav).eq(0).addClass('active');
      $(panes).eq(0).show();
    }
    catch(err){
      console.error("Tabs Error: " + err);
    }
  })
}

/*Widgets*/
/*News*/
function rearrangeNews(){
    $('.news_full').each(function(){
        var items = $(this).find('.news_item_inner');
        items.each(function(){
            $(this).prepend($(this).find('.news_image'));
            $(this).append('<div class="news_info"></div>');
            $(this).find('.news_info').append($(this).find('h5'));
            $(this).find('.news_info').append($(this).find('.leader'));
            $(this).find('.news_item_hook').remove();
        })
    });
}
/*Mailing List*/
function mailingList(){
    $('.mailingListWidget').each(function(){
        var rows = $(this).find('tr');
        rows.each(function(i){
            $(rows).eq(0).append($(this).find("> td"));
            if(i > 0){
                $(this).remove();
            }
        })
        $(rows).find('td label').prepend('<span></span>');
    })
}

/*Event List*/
function rearrangeEventList(){
    $('.msl_eventlist').each(function(){
        var events = $(this).find('.event_item');
        events.each(function(){
            event = $(this).find('>dl');
            $(this).prepend('<div class="event_image"></div>');
            $(this).find('.event_image').append($(this).find('dt > a:eq(0)'));
            $(this).find('dt, dd').wrapAll("<div class='event_info' />");
        });
    });
}

/*Calendar*/
function setupCalendar(){
    $('.msl_event_calendar').each(function(){
        var selectedDays = $(this).find('.msl_event_calendar_selected_day');
        selectedDays.each(function(){
            $(this).click(function(e){
                var hoverbox = $(this).find('.msl-cal-hoverbox');
                if($(hoverbox).is(":visible")){
                    $(hoverbox).css({display: "none"});
                }
                else {
                    $(hoverbox).css({display: "block"});
                }
            })
        })
    })
}

/* Helpers */

/*Accessability*/
function setupStyles(){
    var temp = readCookie("style");
    if(temp){
        setPassiveStyleSheet()
    }
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca;
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setActiveStyleSheet(title) {
    var i, a, main;
    for(i=0; (a = document.getElementsByTagName("link")); i++) {
        if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
            a.disabled = true;
            if(a.getAttribute("title") == title) {
                a.disabled = false;
                createCookie("style", title, 365);
            }
        }
    }
}

function setPassiveStyleSheet(title) {
    var i, a, main;
    for(i=0; (a = document.getElementsByTagName("link")); i++) {
        if(a.getAttribute("rel") && a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
            a.disabled = true;
            if(a.getAttribute("title") == title) a.disabled = false;
        }
    }
}


/* For detecing those pesky IE users */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

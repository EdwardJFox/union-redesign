/*Config Variables*/
var navSlideSpeed = 300,
    dropdownOptions = {
        duration : 300,
        complete: function(){}
    },
    accordionOptions = {
        duration : 300,
        complete: function(){}
    };

$(document).ready(function(){
  setupHeader();
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

  // Admin
  setupAdminInput();

  // Profile images aspect ratio fix
  fixProfileImages();

  // Google Analytics
  setupAnalytics();
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
    }, 800);
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

  // Search bar
  var searchUrl = "/searchresults/?q=";
  var $searchIcon = $('.search .icon');
  $searchIcon.on('click', function(){
    location.href = searchUrl + $('.searchInput input').val();
  });
  $('.searchInput input').on('keypress', function(e){
    if(e.keyCode == 13){
      location.href = searchUrl + $('.searchInput input').val();
    }
  })
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

/* Admin text highlighted input */
function setupAdminInput(){
  if($('#ctl00_Main_txtHTML').length > 0){
    var htmlCodeMirror = CodeMirror.fromTextArea($('#ctl00_Main_txtHTML')[0], {lineNumbers: true, mode:  "htmlmixed", theme: "monokai"})
  }
  if($('#ctl00_Main_txtCSS').length > 0){
    var cssCodeMirror = CodeMirror.fromTextArea($('#ctl00_Main_txtCSS')[0], {lineNumbers: true, mode:  "css", theme: "monokai"})
    $('#ctl00_Main_lnkCSS').on('click', function(){
      cssCodeMirror.refresh();
    }.bind(this))
  }
  if($('#ctl00_Main_txtScript').length > 0){
    var jsCodeMirror = CodeMirror.fromTextArea($('#ctl00_Main_txtScript')[0], {lineNumbers: true, mode:  "javascript", theme: "monokai"})
    $('#ctl00_Main_lnkScript').on('click', function(){
      jsCodeMirror.refresh();
    }.bind(this))
  }

  // Replace the gross default images with nice google material icons
  if($('#ctl00_Main_btnInsertAsset').length > 0){
    $('#ctl00_Main_btnInsertAsset').after('<label for="ctl00_Main_btnInsertAsset" class="icon image" alt="Insert an image">image<div class="tip">Insert an image</div></label>');
  }
  if($('#ctl00_Main_btnInsertDocument').length > 0){
    $('#ctl00_Main_btnInsertDocument').after('<label for="ctl00_Main_btnInsertDocument" class="icon file" alt="Insert a file">insert_drive_file<div class="tip">Insert a file</div></label>');
  }
  if($('#ctl00_Main_btnInsertCSSAsset').length > 0){
    $('#ctl00_Main_btnInsertCSSAsset').after('<label for="ctl00_Main_btnInsertCSSAsset" class="icon image" alt="Insert an image">image<div class="tip">Insert an image</div></label>');
  }
}

function fixProfileImages(){
  $images = $('main img');
  // Check if it is a profile image, has to be done like this due to inconsistent class names
  for(var i = 0; i < $images.length; i++){
    var url =$images.eq(i).attr('src');
    if(url.match(/\/asset\/profilephoto\//)){
      $images.eq(i).attr('src', "/asset/profilephoto/" + url.match(/\w+\.jpg/g)[0] + "?thumbnail_width=512&thumbnail_height=512&resize_type=CropToFit");
    }
  }
}

// Setup deeper Google Analytics tracking on the site
function setupAnalytics(){
  // All links on the main page
  $('main a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Link',
      eventAction: 'click',
      eventLabel: e.target.href,
      transport: 'beacon'
    });
  })

  // Nav menu
  $('.openMenu').on('click', function(){
    ga('send', 'event', {
      eventCategory: 'Nav',
      eventAction: 'click',
      eventLabel: 'open'
    });
  });
  $('.closeMenu').on('click', function(){
    ga('send', 'event', {
      eventCategory: 'Nav',
      eventAction: 'click',
      eventLabel: 'close'
    });
  });
  $('nav section a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Nav link',
      eventAction: 'click',
      eventLabel: e.target.href,
      transport: 'beacon'
    });
  });

  // Searchbar
  $('.searchInput input').on('keypress', function(e){
    if(e.keyCode == 13){
      ga('send', 'event', {
        eventCategory: 'Search',
        eventAction: 'enter',
        eventLabel: $('.searchInput input').val(),
        transport: 'beacon'
      });
    }
  });
  $('.search .icon').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Search',
      eventAction: 'click',
      eventLabel: $('.searchInput input').val(),
      transport: 'beacon'
    });
  });
  
  // User dropdown menu
  $('.chevron').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'User menu',
      eventAction: 'click',
      eventLabel: $('.searchInput input').val()
    });
  });
  $('.user .dropdown a', function(e){
    var value = $(e.target).text();
    ga('send', 'event', {
      eventCategory: 'User menu item',
      eventAction: 'click',
      eventLabel: value,
      transport: 'beacon'
    });
  });

  // Basket icon
  $('header .basket').on('click', function(){
    ga('send', 'event', {
      eventCategory: 'Basket icon',
      eventAction: 'click',
      eventLabel: $('.basket .itemCount').text()
    });
  });

  // Footer
  $('footer a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Footer Link',
      eventAction: 'click',
      eventLabel: $(e.target).text(),
      transport: 'beacon'
    });
  });

  // Homepage
  $('.newsList li').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'News',
      eventAction: 'click',
      eventLabel: $(e.target).text()
    });
  });
  $('.newsItem a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'News Item Image',
      eventAction: 'click',
      eventLabel: e.target.href,
      transport: 'beacon'
    });
  });

  // Unslider
  $('.unslider-nav li').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Unslider',
      eventAction: 'button click',
      eventLabel: $(e.target).text()
    });
  });
  $('.unslider-arrow').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Unslider',
      eventAction: 'arrow click',
      eventLabel: $(e.target).text()
    });
  });

  // Accordion
  $('.accordion .accordionTitle', function(){
    ga('send', 'event', {
      eventCategory: 'Component',
      eventAction: 'accordion',
      eventLabel: 'click'
    });
  });

  // Dropdown
  $('.dropdown .dropdownTitle', function(){
    ga('send', 'event', {
      eventCategory: 'Component',
      eventAction: 'dropdown',
      eventLabel: 'click'
    });
  });

  // Tabbed Navigation
  $('.tabs .nav-tabs a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Component',
      eventAction: 'tabbed navigation',
      eventLabel: $(e.target).text()
    });
  });

  // Quickbar
  $('.quickbar a').on('click', function(e){
    ga('send', 'event', {
      eventCategory: 'Quickbar',
      eventAction: 'click',
      eventLabel: $(e.target).text(),
      transport: 'beacon'
    });
  });

  // Header logo
  $('header .logo a').on('click', function(){
    ga('send', 'event', {
      eventCategory: 'Header logo',
      eventAction: 'click',
      transport: 'beacon'
    });
  });
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

$(document).ready(function(){
  $('.activity-detail .vol-skills-list li').each(function(){
    var number = $(this).text().trim().slice(-1);
    var text = $(this).text().trim().slice(0, -1).trim();
    $(this).html('<span class="skill-name">' + text + '</span><span class="skill-count">' + number + '</span>');
  });
  $('.opportunity-list .vol-skills-list li').each(function(){
    var text = $(this).text().trim();
    $(this).html('<span class="skill-name">' + text + '</span>');
  });

  if($('#browse-opps').length > 0){
    $search = $('.search-panel').detach();
    $opportunitylist = $('#browse-opps .opportunity-list').detach();
    $pagination = $('#ctl00_Main_ActivityListPaged1_dp1').detach();
    $pagination = $('#ctl00_Main_ActivityListPaged1_dp2').remove();

    $('#browse-opps').append('<div class="allopps"></div>');
    $allopps = $('#browse-opps').find('.allopps');

    $allopps.append($search);
    $allopps.append($opportunitylist);
    $allopps.append($pagination);
  }
});
$(document).ready(function(){
  // General Fixes
  setupAdminHeader();

  // Specific section fixes
  opportunityFixes();
});

function setupAdminHeader(){
  if($('main h1:first-of-type').length > 1){
    $('.row.header h1').text($('main h1:first-of-type').eq(1).text().trim());
    $('main h1:first-of-type').eq(1).hide();
  }
}

function opportunityFixes(){
  // Opportunity Date page edits
  $('#ctl00_ctl00_Main_AdminPageContent_tc1_tpDates_EditActivityDatesCtl_drDateRange_lblTitle').text('If this role is part of a project or event, when will the project or event be held?').css({'width':'auto'});
  $('#ctl00_ctl00_Main_AdminPageContent_tc1_tpDates_fsWelcomeMsg > p').text('Every student who expresses an interest in your role will receive the message below, so tell them what they can expect to happen next. Maybe you want them to contact you, or wait to be contacted or to fill in an application form.');
}
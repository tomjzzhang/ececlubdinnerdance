//need array to remove duplicates. can use id's of users to uniquely identify
function generateList(users){
  var items = [];

   $.each(users, function(i, user) {
    var name = user.name;
    var email = user.email;
    var ticketNum = user.ticketNumber;
    
    items.push('<li><div>'+ ticketNum + ' ' + name + '<br>'+ email +'</div><button class="add-recipient btn btn-sm btn-primary">+</button></li>');
   });  // close each()

   $("#queryResults").append( items.join('') );
}

$("#queryBtn").click(function(){
    var queryJSON = $("#queryJSON").val();
    var csrf = $("#csrf").val();
    var data = {query: queryJSON, _csrf: csrf};
    $.ajax({
      type: "POST",
      url: '/user/query',
      data: data,
      dataType: 'json'
    }).done(function( users ) {
      $("#queryResults").empty();
      generateList(users);
    }).fail(function(msg){
      alert(msg);
    });
});


$(document).on('click', '.add-recipient', function() {
  console.log("adding recipient");
  $(this).html('-');
  $(this).click(function() {
    $(this).parent().remove();
  });
  $(this).toggleClass( "add-recipient" );
  var el = $(this).parent();
  el.detach().appendTo('#emailRecipients');
});

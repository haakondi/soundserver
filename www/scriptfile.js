$(document).ready(function() {
  var fixer = function( data ) {
      $( ".result" ).html( data );
  };
  var songID = parseInt($("#song_id_input").val(), 10);
   $('#play_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "play_new",song_id :' + songID + '}}', fixer);
   }); 
});
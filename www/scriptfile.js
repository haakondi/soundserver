$(document).ready(function() {
  var fixer = function( data ) {
      $( ".result" ).html( data );
  };
   $('#play_button').click(function() {
      var songID = parseInt($("#song_id_input").val(), 10);
      $.post( "/index.html",'{command_container : {command : "play_new",song_id :' + songID + '}}', fixer);
   }); 
});
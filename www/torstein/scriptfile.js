$(document).ready(function() {
  var fixer = function( data ) {
      $( ".result" ).html( data );
  };
   $('#play_button').click(function() {
      $.post( "/index.html", fixer);
   }); 
});
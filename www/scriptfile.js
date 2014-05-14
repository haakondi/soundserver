var fixer = function( data ) {
    $( ".result" ).html( data );
};
function update(){
  $.post( "/index.html",'{command_container : {command : "status"}}', fixer);
}

$(document).ready(function() {
   $('#play_button').click(function() {
      var songID = parseInt($("#song_id_input").val(), 10);
      $.post( "/index.html",'{command_container : {command : "play_new",song_id :' + songID + '}}', fixer);
   }); 
   $('#pause_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "pause"}}', fixer);
   }); 
   $('#resume_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "resume"}}', fixer);
   }); 
   $('#volume_slider').on('change',function() {
      var volume = parseFloat($('#volume_slider').val(), 10.00);
      console.log(volume)
      $.post( "/index.html",'{command_container : {command : "set_volume", volume : ' + volume + '}}', fixer);
   });
   //window.setInterval(update, 3000);

});
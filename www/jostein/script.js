
var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
  console.log(songs);
	for (var i = 0; i < songs.length; i++) {
		var song = songs[i];
		$('#songTable').append('<tr class="songElement" id="'+i+'"><td>'+song.track_name+'</td><td>'+song.artist+'</td><td>'+song.album+'</td></tr>');
	};
  $('.songElement').click(function() {
      console.log("clicked!");
      var songID = $(this).attr('id');
      playSong(songID);
  });
}

function fixer( data ) {

}

function playSong(id) {
  $.post( "/",'{command_container : {command : "play_new" , song_id : '+ id +'}}');
}

$(document).ready(function() {
    
    $.post( "/",'{command_container : {command : "list_songs"}}', listSongs);
    $('#play_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "resume"}}', fixer);
   }); 
   $('#pause_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "pause"}}', fixer);
   }); 
   $('#stop_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "stop"}}', fixer);
   }); 
});


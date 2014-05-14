
var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
	for (var i = 0; i < songs.length; i++) {
		var song = songs[i];
		$('#songTable').append('<tr><td>'+song.track_name+'</td><td>'+song.artist+'</td><td>'+song.album+'</td></tr>');
	};
}

$(document).ready(function() {
  var fixer = function( data ) {
      $( ".result" ).html( data );
  };
   $('#play_button').click(function() {
      $.post( "http://192.168.2.189:3000/",'{command_container : {command : "list_songs"}}', listSongs);
   }); 
});



var listSongs = function( data ) {
	var songs = $.parseJSON(data);
	console.log(songs);
	$('#songTable').append('<tr><td>my data</td><td>more data</td></tr>');
}

$(document).ready(function() {
  var fixer = function( data ) {
      $( ".result" ).html( data );
  };
   $('#play_button').click(function() {
      $.post( "http://192.168.2.189:3000/",'{command_container : {command : "list_songs"}}', listSongs);
   }); 
});


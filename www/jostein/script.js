var dataStatus = {};


var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
	for (var i = 0; i < songs.length; i++) {
		var song = songs[i];
    dataStatus[i] = song;
		$('#songTable').append('<tr class="songElement" id="'+i+'"><td>'+song.track_name+'</td><td>'+song.artist+'</td><td>'+song.album+'</td></tr>');
    //$('#songTable').append('<tr class="songElement" id="'+i+'"><td>'+(dataStatus.i)[0]+'</td><td>'+(dataStatus.i)[1]+'</td><td>'+(dataStatus.i)[2]+'</td></tr>');
	};
  $('.songElement').click(function() {
      var songID = $(this).attr('id');
      playSong(songID);
  });
}

function fixer( data ) {
  console.log(dataStatus);
  var status = $.parseJSON(data);
  status = status.status;
  var currentSong = dataStatus[status.song_id_playing];
  console.log(dataStatus[status.song_id_playing]);
  $('.current-display').remove('.current-displaytext');
  $('.current-display').html('<span class="current-displaytext">'+ currentSong.artist + ' - '+ currentSong.track_name +'</span>');

}

function playSong(id) {
  $.post( "/",'{command_container : {command : "play_new" , song_id : '+ id +'}}', fixer);
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
   $('#volume-slider').on('change',function() {
      var volume = parseFloat($('#volume_slider').val(), 10.00);
      $.post( "/index.html",'{command_container : {command : "set_volume", volume : ' + volume + '}}', fixer);
   }); 
});


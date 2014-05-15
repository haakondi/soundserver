var dataStatus = {};
var invertedSort = -1;
var currentSortOn = 'track_name';
var playing = false;


var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
	for (var i = 0; i < songs.length; i++) {
		var song = songs[i];
    dataStatus[i] = song;
		$('#songTable').append('<tr class="songElement tableElement" id="'+i+'"><td>'+song.track_name+'</td><td>'+song.artist+'</td><td>'+song.album+'</td></tr>');
	};
  $('.songElement').click(function() {
      var songID = $(this).attr('id');
      playSong(songID);
      playing = true;
  });
}
function update(){
  $.post( "/index.html",'{command_container : {command : "status"}}', fixer);
}

Object.toArray = function(obj, sortOn) {
    var array = [], key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) array[key] = [key,dataStatus[key][sortOn]];
    }
    return array;
};

function checkAscending(sortOn) {
  if(sortOn === currentSortOn) {
    if(invertedSort === -1) {
      invertedSort = 1;
    } else {
      invertedSort = -1;
    }
  }
}

function sortSongs(sortOn) {
  checkAscending(sortOn);
  var array = Object.toArray(dataStatus, sortOn);
  array.sort(function(a, b){
    var nameA=a[1].toLowerCase(), nameB=b[1].toLowerCase()
    if (nameA < nameB) //sort string ascending
      return -1 * invertedSort; 
    if (nameA > nameB)
      return 1 * invertedSort;
    return 0 ;//default return value (no sorting)
  });
  $('#songTable tr').remove('.songElement');
  for (var i = 0; i < array.length; i++) {
    var key = array[i][0];
    var song = dataStatus[key];
    $('#songTable').append('<tr class="songElement tableElement" id="'+key+'"><td>'+song.track_name+'</td><td>'+song.artist+'</td><td>'+song.album+'</td></tr>');

  };
}
function computeTime(seconds) {
  var minutes = Math.floor(seconds/60)
  var seconds = seconds%60;
  if(seconds < 10) {
    var lastpartofstring = '0' + seconds;
  } else {
    lastpartofstring = ''+seconds;
  }
  return '' + minutes + ':' + lastpartofstring;
}

function updateProgress(status , currentSong) {
  console.log(status.time);
  console.log(currentSong.length);
  $('#progressbar-slider').val(status.time/currentSong.length);

  $('#progress-made-container span').remove('#progress-made');
  $('#progress-made-container').append('<span class="progress-label" id="progress-made"> ' + computeTime(status.time) + '</span>');

  $('#progress-left-container span').remove('#progress-left');
  $('#progress-left-container').append('<span class="progress-label" id="progress-left"> -' + computeTime(currentSong.length - status.time) + '</span>');
}

function fixer( data ) {
  var status = $.parseJSON(data);
  status = status.status;
  $('.current-display').remove('.current-displaytext');
  if(status.song_id_playing !== -1) {
    var currentSong = dataStatus[status.song_id_playing];
    $('.current-display').html('<span class="current-displaytext">'+ currentSong.artist + ' - '+ currentSong.track_name +'</span>');
  }
  $('#volume-slider').val(status.volume);

  updateProgress(status,currentSong);

  if(status.is_playing) {
      $('#pause_button').show();
      $('#play_button').hide();
  } else {
      $('#pause_button').hide();
      $('#play_button').show();
  }
}

function playSong(id) {
  $.post( "/",'{command_container : {command : "play_new" , song_id : '+ id +'}}', fixer);
}

$(document).ready(function() {
    
    $.post( "/",'{command_container : {command : "list_songs"}}', listSongs);
    $.post( "/",'{command_container : {command : "status"}}', fixer);


    $('#pause_button').hide();

    window.setInterval(update, 1000);

    $('#play_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "resume"}}', fixer);
   });
    $('#pause_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "pause"}}', fixer);
   }); 
   $('#backward_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "prev"}}', fixer);
   }); 
   $('#forward_button').click(function() {
      $.post( "/index.html",'{command_container : {command : "next"}}', fixer);
   });
   $('#volume-slider').on('change',function() {
      var volume = parseFloat($('#volume-slider').val(), 10.00);
      $.post( "/index.html",'{command_container : {command : "set_volume", volume : ' + volume + '}}', fixer);
   });
   $('#progressbar-slider').on('change',function() {
      var time_float = parseFloat($('#progressbar-slider').val(), 10.00);
      $.post( "/index.html",'{command_container : {command : "seek", time_float : ' + time_float + '}}', fixer);
   });
   $('#songHeader').click(function() {
    sortSongs('track_name');
   });
   $('#artistHeader').click(function() {
    sortSongs('artist');
   });
   $('#albumHeader').click(function() {
    sortSongs('album');
   });
});


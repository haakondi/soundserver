var dataStatus = {};
var queueStatus = [];
var invertedSort = -1;
var currentSortOn = 'track_name';


var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
	for (var i = 0; i < songs.length; i++) {
		var song = songs[i];
    dataStatus[i] = song;
		$('#songTable').append('<tr class="songElement tableElement" id="'+i+'"><td class="songTableElement">'+song.track_name+'</td><td class="artistTableElement">'+song.artist+'</td><td class="albumTableElement">'+song.album+'</td></tr>');
	};
  $('.songElement').click(function() {
      var songID = $(this).attr('id');
      playSong(songID);
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
  } else {
    invertedSort = 1;
  }
}

function compareArrays(a, b){
  if(a.length !== b.length)
    return false;
  for(i in a){
    if(a[i] != b[i])
      return false;
  }
  return true;
}

function sortSongs(sortOn) {
  checkAscending(sortOn);
  currentSortOn = sortOn;
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
    $('#songTable').append('<tr class="songElement tableElement" id="'+key+'"><td class="songTableElement">'+song.track_name+'</td><td class="artistTableElement">'+song.artist+'</td><td class="albumTableElement">'+song.album+'</td></tr>');

  };
  $('.songElement').click(function() {
      var songID = $(this).attr('id');
      playSong(songID);
  });
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

function makeListItem(songid){
  var track = dataStatus[songid].track_name;
  var artist = dataStatus[songid].artist;
  var album = dataStatus[songid].album;
  var result = '<li class="drag-drop list-group-item" songid="'+songid+'">';
  result += '<div class="queue-element songTableElement">'+track+'</div>';
  result += '<div class="queue-element artistTableElement">'+artist+'</div>';
  result += '<div class="queue-element albumTableElement">'+album+'</div>';
  result += '</li>';
  return result;

}

function redrawQueue(){
  $('#queue-list li').remove();
  for(i in queueStatus){
    $('#queue-list').append(makeListItem(queueStatus[i]));
  }
}

function maintainQueue(queue_array) {
  var newQueue = queue_array;
  if(!(compareArrays(newQueue, queueStatus))) {
    queueStatus = newQueue;
    redrawQueue();
  }
}

function fixer( data ) {
  var status = $.parseJSON(data);
  status = status.status;
  $('.current-display').remove('.current-displaytext');
  if(status.song_id_playing !== -1) {
    var currentSong = dataStatus[status.song_id_playing];
    $('.current-display').html('<span class="current-displaytext">'+ currentSong.artist + ' - '+ currentSong.track_name +'</span>');
    updateProgress(status,currentSong);
  }
  $('#volume-slider').val(status.volume);

  maintainQueue(status.queue_array);

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
    var panelList = $('#queue-list');

    panelList.sortable({
            // Only make the .panel-heading child elements support dragging.
            // Omit this to make the entire <li>...</li> draggable.
            handle: '.queue-element',
            update: function() {
                $('.drag-drop', panelList).each(function(index, elem) {
                     var listItem = $(elem),
                         newIndex = listItem.index();

                      queueStatus[newIndex] = parseInt(listItem.attr('songid'));
                });
                $.post( "/index.html",'{command_container : {command : "queue", queue_array: ['+queueStatus+']}}', fixer);
            }
          });
});



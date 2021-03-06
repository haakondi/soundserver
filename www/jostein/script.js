var dataStatus = {};
var queueStatus = [];
var invertedSort = -1;
var currentSortOn = 'track_name';
var currentSongID = -1;

function makeTableItem(songid) {
  var song = dataStatus[songid];
  var track = song.track_name;
  var artist = song.artist;
  var album = song.album;

  var result = '<li class="songElement list-group-item tableElement" id="'+songid+'">';
  result += '<div class="songTableElement">'+track+'</div>';
  result += '<div class="artistTableElement">'+artist+'</div>';
  result += '<div class="albumTableElement">'+album+'</div>';
  result += '<div class="queueButton queueSpace"><span class="glyphicon glyphicon-plus-sign queueGlyph"></span> </div> '
  result += '</li>';
  return result;
  
}
function addTableListeners() {
  $('.songElement').dblclick(function() {
      var songID = $(this).attr('id');
      playSong(songID);
  });
  $('.queueButton').click(function(e) {
    e.stopPropagation();
    var songID = $(this).parent('.songElement').attr('id');
    queueStatus[queueStatus.length] = songID;
    $.post( "/index.html",'{command_container : {command : "queue", queue_array: ['+queueStatus+']}}', fixer);
    redrawQueue();
    $(this).parent().fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  });
}
function addQueueListeners(e) {

  $('.dequeueButton').click(function(e) {
    e.stopPropagation();
    var songID = $(this).parent('.drag-drop').attr('songid');
    queueStatus.splice($(this).parent('.drag-drop').index(),1);
    $.post( "/index.html",'{command_container : {command : "queue", queue_array: ['+queueStatus+']}}', fixer);
    redrawQueue();

  });
}

function searchForSongs(param){
  var matching = [];
  var paramList = param.split(" ");
  for(key in dataStatus){
    var song = dataStatus[key];
    totalString = song.track_name + song.artist + song.album;
    var match = true;
    for(index in paramList){
      if(totalString.toLowerCase().indexOf(paramList[index]) <= -1){
        match = false;
        break;
      }
    }
    if(match){
      matching.push(key);
    }
  }
  $('#songTable li').remove();
  for(key in matching){
    $('#songTable').append(makeTableItem(matching[key]));
  }
  addTableListeners();

}


var listSongs = function( data ) {
	var songs = ($.parseJSON(data)).song_list;
	for (var i = 0; i < songs.length; i++) {
    var song = songs[i];
    dataStatus[i] = song;
    $('#songTable').append(makeTableItem(i));
  };
  addTableListeners();
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
  $('#songTable li').remove();
  for (var i = 0; i < array.length; i++) {
    var key = array[i][0];
    var song = dataStatus[key];
    $('#songTable').append(makeTableItem(key));

  };
  addTableListeners();
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
  $('#progressbar-slider').val(status.time/currentSong.length);

  $('#progress-made').text('' + computeTime(status.time));

  $('#progress-left').text('-' + computeTime(currentSong.length - status.time));
}

function makeListItem(songid){
  var track = dataStatus[songid].track_name;
  var artist = dataStatus[songid].artist;
  var album = dataStatus[songid].album;
  var result = '<li class="drag-drop list-group-item" songid="'+songid+'">';
  result += '<div class="queue-element songTableElement">'+track+'</div>';
  result += '<div class="queue-element artistTableElement">'+artist+'</div>';
  result += '<div class="queue-element albumTableElement">'+album+'</div>';
  result += '<div class="queue-element dequeueButton"><span class="glyphicon glyphicon-minus-sign dequeueGlyph"></span></div>' ;
  result += '</li>';
  return result;
}

function redrawQueue(){
  $('#queue-list li').remove();
  for(i in queueStatus){
    $('#queue-list').append(makeListItem(queueStatus[i]));
  }
  addQueueListeners();
}

function maintainQueue(queue_array) {
  var newQueue = queue_array;
  if(!(compareArrays(newQueue, queueStatus))) {
    queueStatus = newQueue;
    redrawQueue();
  }
}
function addAlbumCover(data) {
  var img = $.parseJSON(data);
  var artwork = img.artwork;
  if(artwork.success){
    $('#albumCover').show();
    var imgString = 'data:' + artwork.mime_type + ';'+artwork.image_encoding+',' + artwork.image_data;
    $('#albumCover').attr('src', imgString);
    $('body').css('background-image', 'url(' + imgString + ')');
  } else {
    $('#albumCover').hide();
  }
}
function fixer( data ) {
  var status = $.parseJSON(data);
  status = status.status;
  $('.current-display').remove('.current-displaytext');
  if(status.song_id_playing !== -1) {
    if(currentSongID !== status.song_id_playing) {
      currentSongID = status.song_id_playing;
      $.post( "/",'{command_container : {command : "get_artwork" , song_id : '+ currentSongID +'}}', addAlbumCover);
    }
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
    $('#progressbar-slider').val(0);

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
   $('#searchBox').on( "keyup change", function(){
    searchForSongs($(this).val());
   });
   $('#artistHeader').click(function() {
    sortSongs('artist');
   });
   $('#albumHeader').click(function() {
    sortSongs('album');
   });
   $('')
    var panelList = $('#queue-list');

    panelList.sortable({

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



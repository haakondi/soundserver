package server;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javafx.embed.swing.JFXPanel;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaPlayer.Status;
import javafx.util.Duration;

public class Player {
	private LinkedList<Integer> queue;
	private LinkedList<Integer> history;
	private final List<Song> songs;
	private MediaPlayer active;
	private String songDirectory;
	private int songPlaying = -1;
	private Queuer queuer;
	private double volume = 1;
	private volatile boolean playing;

	public Player(String songDirectory) {
		System.out.println("Starting player");
		// new JFXPanel();
		System.out.println("panel created");
		queue = new LinkedList<Integer>();
		history = new LinkedList<Integer>();
		this.songDirectory = songDirectory;
		songs = new ArrayList<Song>();
		listSongs(new File(songDirectory));
		System.out.println("Found " + songs.size() + " songs!");
		queuer = new Queuer();
	}
	
	private class Queuer implements Runnable{
		@Override
		public void run() {
			synchronized (queue) {
				if(songPlaying != -1){
					history.addFirst(songPlaying);					
				}
				if(queue.size() > 0){
					playNextSong();
				}
				playing = false;
			}
			
		}
		
	}

	public int getSongPlaying() {
		return songPlaying;
	}

	private void listSongs(File dir) {
		if (dir.isFile()) {
			if (validFormat(dir.getAbsolutePath()))
				songs.add(new Song(dir.getAbsolutePath()));
		} else {
			for (File file : dir.listFiles()) {
				listSongs(file);
			}
		}

	}

	public void setVolume(double volume) {
		if (active == null) {
			return;
		}
		this.volume = volume;
		active.setVolume(volume);
		System.out.println((volume * 100));
	}

	private boolean validFormat(String name) {
		// TODO
		return name.endsWith(".mp3");
	}

	public void resume() {
		if (active == null)
			return;
		active.play();
		playing = true;
	}

	public void pause() {
		if (active == null)
			return;
		active.pause();
		playing = false;
	}

	public Double getVolume() {
		if (active == null)
			return -1d;
		return active.getVolume();
	}
	
	public void playNewSong(int id){
		queue.clear();
		queue.add(id);
		playNextSong();
	}

	public void playNextSong() {
		if(songPlaying != -1)
			history.addFirst(songPlaying);
		if(queue.size() == 0){
			stop();
			return;
		}
		int id = queue.poll();
		play(id);
	}
	
	private void play(int id){
		System.out.println(history);
		if (active != null) {
			active.stop();
			active.dispose();
		}
		File file = new File(songs.get(id).uri);
		String bip = file.toURI().toASCIIString();
		Media hit = new Media(bip);
		active = new MediaPlayer(hit);
		active.setVolume(volume);
		active.setOnEndOfMedia(queuer);
		active.play();
		playing = true;
		songPlaying = id;
		System.out.println("playing: " + songs.get(id));
	}

	public List<Song> getSongs() {
		List<Song> result = new ArrayList<Song>();
		for (Song song : songs)
			result.add(song);
		return result;
	}
	
	public void queue(int songID){
		queue.add(songID);
	}
	
	public void stop(){
		queue.clear();
		history.clear();
		if(active != null){
			active.stop();
			active.dispose();
		}
		playing = false;
		
	}
	
	private void playPrevious(){
		if(songPlaying != -1){
			queue.addFirst(songPlaying);
		}
			play(history.poll());
		
	}
	
	private void restartSong(){
		active.seek(new Duration(0));
	}
	
	public void prev(){
		if(active == null){
			return;
		}
		if(history.size() == 0 || active.currentTimeProperty().getValue().toMillis() > 2500){
			restartSong();
		}else if(history.size() > 0){
			playPrevious();
		}
		
	}
	
	public void clearQueue(){
		queue.clear();
	}
	
	public int getTimeInSeconds(){
		if(active == null)
			return -1;
		return (int) active.getCurrentTime().toSeconds();
	}
	
	public void seek(float time){
		if(active == null || songPlaying == -1)
			return;
		active.seek(new Duration(time*1000*songs.get(songPlaying).getTrackLength()));
	}
	
	public LinkedList<Integer> getQueue(){
		return queue;
	}
	
	public boolean isPlaying(){
		return playing;
	}



}

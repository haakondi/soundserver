package server;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javafx.embed.swing.JFXPanel;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;

public class Player {
	private Queue<Integer> queue;
	private final List<Song> songs;
	private String sep = System.getProperty("file.separator");
	private MediaPlayer active;
	private String songDirectory;
	private int songPlaying;
	private Queuer queuer;

	public Player(String songDirectory) {
		System.out.println("Starting player");
		// new JFXPanel();
		System.out.println("panel created");
		queue = new LinkedList<Integer>();
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
				if(queue.size() > 0){
					playNewSong(queue.poll());
				}
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
	}

	public void pause() {
		if (active == null)
			return;
		active.pause();
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
		if (active != null) {
			active.stop();
		}
		int id = queue.poll();
		File file = new File(songs.get(id).uri);
		String bip = file.toURI().toASCIIString();
		Media hit = new Media(bip);
		active = new MediaPlayer(hit);
		active.setOnEndOfMedia(queuer);
		active.play();
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

	public static void main(String[] args) {
		Player p = new Player("C:\\users\\user\\Music\\");
		System.out.println(p.getSongs());
		// p.playNewSong("C:\\users\\user\\Music\\downupus.mp3");
		System.out.println(p.getSongs().get(0).toJSON());
	}

}

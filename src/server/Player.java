package server;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javafx.embed.swing.JFXPanel;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;

public class Player {
	private final List<String> songs;
	private String sep = System.getProperty("file.separator");
	private MediaPlayer active;
	private String songDirectory;
	private int songPlaying;

	
	
	public Player(String songDirectory) {
		System.out.println("Starting player");
//		new JFXPanel();
		System.out.println("panel created");
		this.songDirectory = songDirectory;
		songs = new ArrayList<String>();
		listSongs(new File(songDirectory));
		System.out.println("Found " + songs.size() + " songs!");
	}
	
	

	public int getSongPlaying() {
		return songPlaying;
	}



	private void listSongs(File dir){
		if(dir.isFile() && validFormat(dir.getAbsolutePath())){
			songs.add(dir.getAbsolutePath());
		}
		else{
			for(File file : dir.listFiles()){
				listSongs(file);			
			}			
		}
		
	}
	
	public void setVolume(double volume){
		if(active == null){
			return;
		}
		active.setVolume(volume);
		System.out.println((volume * 100));
	}
	
	private boolean validFormat(String name){
		//TODO
		return true;
	}
	
	public void resume(){
		if(active == null)
			return;
		active.play();
	}
	
	public void pause(){
		if(active == null)
			return;
		active.pause();
	}
	
	public Double getVolume(){
		if(active == null)
			return -1d;
		return active.getVolume();
	}
	
	public void playNewSong(int id){
		if(active != null){
			active.stop();
		}
		File file = new File(songs.get(id));
		String bip = file.toURI().toASCIIString();
		Media hit = new Media(bip);
		active = new MediaPlayer(hit);
		active.play();
		songPlaying = id;
		System.out.println("playing: " + songs.get(id));
	}
	
	
	public List<String> getSongs(){
		List<String> result = new ArrayList<String>();
		for(String song : songs)
			result.add(song);
		return result;
	}
	
	public static void main(String[] args) {
		Player p = new Player("C:\\users\\user\\Music\\");
		System.out.println(p.getSongs());
//		p.playNewSong("C:\\users\\user\\Music\\downupus.mp3");
	}
	
	
}

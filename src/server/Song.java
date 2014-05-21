package server;

import java.io.File;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.datatype.Artwork;
import org.json.JSONObject;

public class Song {
	private Tag tag;
	public final String uri;
	private AudioHeader audioHeader;
	private AudioFile f;
	
	
	
	public Song(String uri) {
		super();
		this.uri = uri;
		try {
			f = AudioFileIO.read(new File(uri));
			this.tag = f.getTag();
			this.audioHeader = f.getAudioHeader();
		} catch (Exception e) {
			this.tag = null;
			this.audioHeader = null;
			e.printStackTrace();
		}
	}
	
	public String readTag(FieldKey key){
		if(tag == null)
			return "";
		return tag.getFirst(key);
	}

	public String getArtist(){
		return readTag(FieldKey.ARTIST);
	}
	
	public String getAlbum(){
		return readTag(FieldKey.ALBUM);
	}
	
	public String getTrackName(){
		String name = readTag(FieldKey.TITLE);
		if(name.equals("")){
			String splitter = System.getProperty("file.separator").equals("\\") ? "\\\\" : System.getProperty("file.separator");
			String[] temp = uri.split(splitter);
			name = temp[temp.length - 1].replaceAll(".mp3", "");
		}
		return name;
	}
	
	public int getTrackLength(){
		return audioHeader.getTrackLength();
	}
	
	public Artwork getArtwork(){
		return tag.getFirstArtwork();
	}
	
	
	public JSONObject toJSON(){
		JSONObject result = new JSONObject();
		result.put(Constants.album, getAlbum());
		result.put(Constants.artist, getArtist());
		result.put(Constants.trackName, getTrackName());
		result.put(Constants.trackLength, getTrackLength());
		return result;
	}
	
	public String toString(){
		return getArtist() + " - " + getTrackName();
	}
	


}

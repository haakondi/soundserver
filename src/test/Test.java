package test;

import javafx.application.Application;
import javafx.stage.Stage;
import server.Song;
import sun.misc.BASE64Encoder;

public class Test extends Application {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Application.launch(Test.class, "arg");
	}

	@Override
	public void start(Stage arg0) throws Exception {
		Song song = new Song(
				"C:\\Users\\user\\Music\\Bonobo - The North Borders 2013 Electronic 320kbps CBR MP3 [VX]\\10 Bonobo - Antenna.mp3");
		Song currentSong = song;
		BASE64Encoder encoder = new BASE64Encoder();
		String base64 = encoder.encode(currentSong.getArtwork().getBinaryData());
		System.out.println(base64);
	}

}
